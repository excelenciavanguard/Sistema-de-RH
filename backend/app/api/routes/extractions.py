from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ...config import Settings, get_settings
from ...db import get_db
from ...models import AuditEvent, ExtractionJob, ExtractionResult, JobStatus, ProviderStatus, ResumeFile
from ...schemas import ExtractionJobOut, ProviderName, ProviderResultOut, ResumeFileOut
from ...services.file_validation import FileValidationError, validate_file
from ...services.gemini_provider import ProviderError, extract_resume_with_gemini
from ...services.openai_provider import extract_resume_with_openai
from ...services.providers import configured
from ...services.storage import PrivateStorage
from ...services.text_extraction import TextExtractionError, extract_text


router = APIRouter(prefix="/extractions", tags=["extractions"])


def _providers(value: str) -> list[str]:
    normalized = value.lower().strip()
    if normalized == "both":
        return [ProviderName.openai.value, ProviderName.gemini.value]
    try:
        return [ProviderName(normalized).value]
    except ValueError as exc:
        raise HTTPException(status_code=422, detail={"code": "invalid_provider", "message": "Use openai, gemini ou both."}) from exc


def _job_out(job: ExtractionJob, duplicate: bool = False) -> ExtractionJobOut:
    resume = job.resume_file
    preview = None
    if resume.extracted_text:
        preview = resume.extracted_text[:2000]
    return ExtractionJobOut(
        id=job.id,
        status=job.status,
        requested_providers=job.requested_providers,
        file=ResumeFileOut(
            id=resume.id,
            original_name=resume.original_name,
            sha256=resume.sha256,
            extension=resume.extension,
            mime_type=resume.mime_type,
            size_bytes=resume.size_bytes,
            duplicate=duplicate,
            text_preview=preview,
            extraction_note=resume.extraction_note,
        ),
        results=[ProviderResultOut.model_validate(item) for item in job.results],
        error_code=job.error_code,
        error_message=job.error_message,
        created_at=job.created_at,
    )


@router.post("", response_model=ExtractionJobOut, status_code=status.HTTP_201_CREATED)
def create_extraction(
    file: UploadFile = File(...),
    provider: str = Form("both"),
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> ExtractionJobOut:
    requested = _providers(provider)
    safe_name = Path(file.filename or "curriculo").name
    content = file.file.read(settings.max_upload_bytes + 1)
    try:
        validated = validate_file(safe_name, content, settings.max_upload_bytes)
    except FileValidationError as exc:
        raise HTTPException(status_code=422, detail={"code": exc.code, "message": str(exc)}) from exc

    resume = db.scalar(select(ResumeFile).where(ResumeFile.sha256 == validated.sha256))
    duplicate = resume is not None
    if resume is None:
        storage = PrivateStorage(settings.upload_dir)
        stored_name, path = storage.save(content, validated.extension)
        resume = ResumeFile(
            original_name=safe_name,
            stored_name=stored_name,
            storage_path=str(path),
            sha256=validated.sha256,
            extension=validated.extension,
            mime_type=validated.mime_type,
            size_bytes=validated.size_bytes,
        )
        db.add(resume)
        db.flush()
        try:
            resume.extracted_text, resume.extraction_note = extract_text(content, validated.extension)
        except TextExtractionError as exc:
            resume.extraction_note = str(exc)

    job = ExtractionJob(resume_file_id=resume.id, requested_providers=requested, status=JobStatus.ready_for_provider)
    db.add(job)
    db.flush()

    result_rows: list[ExtractionResult] = []
    for provider_name in requested:
        is_configured = configured(settings, provider_name)
        result = ExtractionResult(
            job_id=job.id,
            provider=provider_name,
            status=ProviderStatus.pending,
        )
        if resume.extracted_text is None:
            result.status = ProviderStatus.failed
            result.error_code = "text_extraction_needs_review"
            result.error_message = resume.extraction_note or "Não foi possível extrair o texto do arquivo."
        elif not is_configured:
            result.status = ProviderStatus.not_configured
            result.error_code = "provider_not_configured"
            result.error_message = f"{provider_name.title()} ainda não possui chave configurada."
        elif provider_name == ProviderName.gemini.value:
            try:
                result.structured_data = extract_resume_with_gemini(resume.extracted_text, settings)
                result.status = ProviderStatus.completed
            except ProviderError as exc:
                result.status = ProviderStatus.failed
                result.error_code = exc.code
                result.error_message = str(exc)
        elif provider_name == ProviderName.openai.value:
            try:
                result.structured_data = extract_resume_with_openai(resume.extracted_text, settings)
                result.status = ProviderStatus.completed
            except ProviderError as exc:
                result.status = ProviderStatus.failed
                result.error_code = exc.code
                result.error_message = str(exc)
        else:
            result.status = ProviderStatus.failed
            result.error_code = "provider_not_implemented"
            result.error_message = "O provedor solicitado ainda não foi habilitado neste laboratório."
        db.add(result)
        result_rows.append(result)

    if resume.extracted_text is None:
        job.status = JobStatus.needs_review
        job.error_code = "text_extraction_needs_review"
        job.error_message = resume.extraction_note
    elif any(item.status == ProviderStatus.completed for item in result_rows):
        job.status = JobStatus.completed
    elif any(item.status == ProviderStatus.failed for item in result_rows):
        job.status = JobStatus.failed
        job.error_code = "provider_processing_failed"
        job.error_message = "Nenhum provedor configurado concluiu a análise."
    else:
        job.status = JobStatus.provider_not_configured
    job.completed_at = datetime.now(timezone.utc)

    db.add(AuditEvent(
        event_type="resume_received",
        entity_type="extraction_job",
        entity_id=job.id,
        details={
            "duplicate": duplicate,
            "extension": validated.extension,
            "providers": requested,
            "provider_statuses": {item.provider: item.status.value for item in result_rows},
        },
    ))
    db.commit()

    loaded = db.scalar(
        select(ExtractionJob)
        .options(selectinload(ExtractionJob.resume_file), selectinload(ExtractionJob.results))
        .where(ExtractionJob.id == job.id)
    )
    return _job_out(loaded, duplicate=duplicate)


@router.get("/{job_id}", response_model=ExtractionJobOut)
def get_extraction(job_id: str, db: Session = Depends(get_db)) -> ExtractionJobOut:
    job = db.scalar(
        select(ExtractionJob)
        .options(selectinload(ExtractionJob.resume_file), selectinload(ExtractionJob.results))
        .where(ExtractionJob.id == job_id)
    )
    if job is None:
        raise HTTPException(status_code=404, detail={"code": "job_not_found", "message": "Processamento não encontrado."})
    return _job_out(job)
