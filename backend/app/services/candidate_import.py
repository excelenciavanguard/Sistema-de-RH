from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..models import (
    Application,
    ApplicationStage,
    AuditEvent,
    Candidate,
    ExtractionJob,
    ExtractionResult,
    ProviderStatus,
    ReviewStatus,
    Vacancy,
    VacancyStatus,
)


@dataclass(frozen=True)
class CandidateImportError(RuntimeError):
    code: str
    message: str

    def __str__(self) -> str:
        return self.message


def add_extraction_to_kanban(
    db: Session,
    job_id: str,
    provider: str,
    vacancy_code: str,
) -> tuple[Application, bool]:
    job = db.scalar(
        select(ExtractionJob)
        .options(
            selectinload(ExtractionJob.resume_file),
            selectinload(ExtractionJob.results),
            selectinload(ExtractionJob.application).selectinload(Application.candidate),
            selectinload(ExtractionJob.application).selectinload(Application.vacancy),
        )
        .where(ExtractionJob.id == job_id)
    )
    if job is None:
        raise CandidateImportError("job_not_found", "Processamento não encontrado.")

    vacancy = db.scalar(select(Vacancy).where(Vacancy.code == vacancy_code))
    if vacancy is None:
        raise CandidateImportError("vacancy_not_found", "A vaga informada não foi encontrada.")
    if vacancy.status != VacancyStatus.active:
        raise CandidateImportError("vacancy_inactive", "A vaga não está ativa para receber candidatos.")

    selected_result = next((item for item in job.results if item.provider == provider), None)
    if selected_result is None or selected_result.status != ProviderStatus.completed or not selected_result.structured_data:
        raise CandidateImportError(
            "provider_result_not_completed",
            "Escolha um resultado de IA concluído para adicionar ao Kanban.",
        )

    existing = db.scalar(
        select(Application)
        .options(selectinload(Application.candidate), selectinload(Application.vacancy))
        .where(
            Application.vacancy_id == vacancy.id,
            Application.resume_file_id == job.resume_file_id,
        )
    )
    if existing is not None:
        job.application = existing
        db.add(AuditEvent(
            event_type="application_reused",
            entity_type="application",
            entity_id=existing.id,
            details={"job_id": job.id, "provider": provider, "vacancy_code": vacancy_code},
        ))
        return existing, True

    previous_application = db.scalar(
        select(Application)
        .options(selectinload(Application.candidate))
        .where(Application.resume_file_id == job.resume_file_id)
        .limit(1)
    )
    candidate = previous_application.candidate if previous_application is not None else None
    data = selected_result.structured_data
    if candidate is None:
        candidate = Candidate(
            name=data.get("nome"),
            location=data.get("localidade"),
            experience=data.get("experiencia"),
            education=data.get("escolaridade"),
            availability=data.get("disponibilidade"),
        )
        db.add(candidate)
        db.flush()

    application = Application(
        candidate_id=candidate.id,
        vacancy_id=vacancy.id,
        resume_file_id=job.resume_file_id,
        source_provider=provider,
        stage=ApplicationStage.application,
        review_status=ReviewStatus.pending,
        owner="Equipe RH",
    )
    application.candidate = candidate
    application.vacancy = vacancy
    db.add(application)
    db.flush()
    job.application = application
    db.add(AuditEvent(
        event_type="application_created",
        entity_type="application",
        entity_id=application.id,
        details={"job_id": job.id, "provider": provider, "vacancy_code": vacancy_code},
    ))
    return application, False
