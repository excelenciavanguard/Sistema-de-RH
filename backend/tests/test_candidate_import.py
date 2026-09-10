from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.db import Base
from app.models import ApplicationStage, AuditEvent, ExtractionJob, ExtractionResult, JobStatus, ProviderStatus, ResumeFile, Vacancy, VacancyStatus
from app.services.candidate_import import CandidateImportError, add_extraction_to_kanban
from app.api.routes.candidates import _card, move_application_stage
from app.schemas import MoveApplicationStageIn


STRUCTURED = {
    "nome": "Rafael de Teste",
    "localidade": "Rio de Janeiro, RJ",
    "experiencia": "Dois anos em serviços gerais",
    "escolaridade": "Ensino médio completo",
    "disponibilidade": None,
    "evidencias": [
        {
            "campo": "experiencia",
            "valor": "Jovem Aprendiz",
            "trecho": "Jovem Aprendiz na Petrobras",
            "pagina": 1,
            "confianca": "alta",
        }
    ],
    "informacoes_ausentes": ["Disponibilidade"],
    "perguntas_para_confirmar": ["Qual é sua disponibilidade?"],
}


def _database():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    return engine


def _job(db: Session, provider_status=ProviderStatus.completed) -> ExtractionJob:
    db.add(Vacancy(code="2026-0157", title="Auxiliar de Serviços Gerais", post_name="Leblon Power", status=VacancyStatus.active))
    resume = ResumeFile(
        original_name="curriculo.txt",
        stored_name="fixture.txt",
        storage_path="private/fixture.txt",
        sha256="a" * 64,
        extension="txt",
        mime_type="text/plain",
        size_bytes=20,
        extracted_text="Currículo fictício",
    )
    job = ExtractionJob(
        resume_file=resume,
        requested_providers=["openai"],
        status=JobStatus.completed,
    )
    job.results.append(
        ExtractionResult(
            provider="openai",
            status=provider_status,
            structured_data=STRUCTURED if provider_status == ProviderStatus.completed else None,
        )
    )
    db.add(job)
    db.commit()
    return job


def test_creates_candidate_and_reuses_same_application():
    with Session(_database()) as db:
        job = _job(db)

        first, duplicate = add_extraction_to_kanban(db, job.id, "openai", "2026-0157")
        db.commit()
        second, second_duplicate = add_extraction_to_kanban(db, job.id, "openai", "2026-0157")

        assert duplicate is False
        assert second_duplicate is True
        assert second.id == first.id
        assert first.stage.value == "application"
        assert first.candidate.name == "Rafael de Teste"
        assert first.review_status.value == "pending"

        card = _card(first)
        assert card.resumeFileName == "curriculo.txt"
        assert card.evidences[0]["valor"] == "Jovem Aprendiz"
        assert card.mobilityStatus == "pending"


def test_recruitment_pipeline_has_the_nine_approved_stages():
    assert [stage.value for stage in ApplicationStage] == [
        "application",
        "screening",
        "contact",
        "interview_hr",
        "manager_interview",
        "research",
        "documents",
        "training",
        "hiring",
    ]


def test_moves_application_stage_and_records_audit_event():
    with Session(_database()) as db:
        job = _job(db)
        application, _ = add_extraction_to_kanban(db, job.id, "openai", "2026-0157")
        db.commit()

        card = move_application_stage(
            application.id,
            MoveApplicationStageIn(stage=ApplicationStage.training),
            db,
        )

        assert card.stage == "training"
        event = db.scalar(
            select(AuditEvent)
            .where(AuditEvent.entity_id == application.id, AuditEvent.event_type == "application_stage_changed")
        )
        assert event is not None
        assert event.details == {"from": "application", "to": "training"}


def test_rejects_provider_without_completed_result():
    with Session(_database()) as db:
        job = _job(db, ProviderStatus.failed)

        try:
            add_extraction_to_kanban(db, job.id, "openai", "2026-0157")
        except CandidateImportError as error:
            assert error.code == "provider_result_not_completed"
        else:
            raise AssertionError("Expected CandidateImportError")
