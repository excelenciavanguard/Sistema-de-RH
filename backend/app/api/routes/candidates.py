from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ...db import get_db
from ...models import Application, AuditEvent, ExtractionJob, ProviderStatus, Vacancy
from ...schemas import AddToKanbanIn, AddToKanbanOut, CandidateCardOut, MoveApplicationStageIn
from ...services.candidate_import import CandidateImportError, add_extraction_to_kanban


router = APIRouter(tags=["candidates"])


def _initials(name: str | None) -> str:
    words = [word for word in (name or "").split() if word]
    if not words:
        return "NI"
    return "".join(word[0] for word in words[:2]).upper()


def _selected_analysis(application: Application) -> dict:
    jobs = sorted(application.extraction_jobs, key=lambda item: item.created_at)
    for job in reversed(jobs):
        for result in job.results:
            if (
                result.provider == application.source_provider
                and result.status == ProviderStatus.completed
                and result.structured_data
            ):
                return result.structured_data
    return {}


def _card(application: Application, duplicate: bool = False) -> CandidateCardOut:
    candidate = application.candidate
    vacancy = application.vacancy
    analysis = _selected_analysis(application)
    evidences = analysis.get("evidencias") or []
    return CandidateCardOut(
        id=application.id,
        name=candidate.name or "Nome não informado",
        initials=_initials(candidate.name),
        photo=None,
        source=f"Extração {application.source_provider.title()}",
        stage=application.stage.value,
        evidence="Revisão pendente" if application.review_status.value == "pending" else "Confirmado",
        evidenceTone="warning" if application.review_status.value == "pending" else "success",
        requirements=f"{len(evidences)} evidência{'s' if len(evidences) != 1 else ''} extraída{'s' if len(evidences) != 1 else ''}",
        route="Mobilidade pendente",
        fare="Custo pendente",
        stageTime="Agora",
        owner=application.owner,
        messages=0,
        duplicate="Currículo já processado" if duplicate else None,
        role=vacancy.title,
        postName=vacancy.post_name,
        location=candidate.location or "Não informado",
        availability=candidate.availability or "Não informado",
        education=candidate.education or "Não informado",
        experience=candidate.experience or "Não informado",
        reviewStatus=application.review_status.value,
        resumeFileName=application.resume_file.original_name,
        isDemo=False,
        mobilityStatus="pending",
        evidences=evidences,
        missingInfo=analysis.get("informacoes_ausentes") or [],
        questions=analysis.get("perguntas_para_confirmar") or [],
    )


def _application_options():
    return (
        selectinload(Application.candidate),
        selectinload(Application.vacancy),
        selectinload(Application.resume_file),
        selectinload(Application.extraction_jobs).selectinload(ExtractionJob.results),
    )


@router.post(
    "/extractions/{job_id}/add-to-kanban",
    response_model=AddToKanbanOut,
    status_code=status.HTTP_200_OK,
)
def add_to_kanban(job_id: str, payload: AddToKanbanIn, db: Session = Depends(get_db)) -> AddToKanbanOut:
    try:
        application, duplicate = add_extraction_to_kanban(
            db,
            job_id,
            payload.provider.value,
            payload.vacancy_code,
        )
        db.commit()
        application = db.scalar(
            select(Application)
            .options(*_application_options())
            .where(Application.id == application.id)
        )
    except CandidateImportError as exc:
        db.rollback()
        http_status = 404 if exc.code in {"job_not_found", "vacancy_not_found"} else 409
        raise HTTPException(status_code=http_status, detail={"code": exc.code, "message": str(exc)}) from exc
    return AddToKanbanOut(candidate=_card(application, duplicate=duplicate), duplicate=duplicate)


@router.get("/vacancies/{vacancy_code}/candidates", response_model=list[CandidateCardOut])
def list_candidates(vacancy_code: str, db: Session = Depends(get_db)) -> list[CandidateCardOut]:
    vacancy = db.scalar(select(Vacancy).where(Vacancy.code == vacancy_code))
    if vacancy is None:
        raise HTTPException(status_code=404, detail={"code": "vacancy_not_found", "message": "Vaga não encontrada."})
    applications = db.scalars(
        select(Application)
        .options(*_application_options())
        .where(Application.vacancy_id == vacancy.id)
        .order_by(Application.created_at.desc())
    ).all()
    return [_card(application) for application in applications]


@router.patch("/applications/{application_id}/stage", response_model=CandidateCardOut)
def move_application_stage(
    application_id: str,
    payload: MoveApplicationStageIn,
    db: Session = Depends(get_db),
) -> CandidateCardOut:
    application = db.scalar(
        select(Application)
        .options(*_application_options())
        .where(Application.id == application_id)
    )
    if application is None:
        raise HTTPException(status_code=404, detail={"code": "application_not_found", "message": "Candidatura não encontrada."})

    previous_stage = application.stage
    if previous_stage != payload.stage:
        application.stage = payload.stage
        db.add(AuditEvent(
            event_type="application_stage_changed",
            entity_type="application",
            entity_id=application.id,
            details={"from": previous_stage.value, "to": payload.stage.value},
        ))
        db.commit()
        application = db.scalar(
            select(Application)
            .options(*_application_options())
            .where(Application.id == application_id)
        )
    return _card(application)
