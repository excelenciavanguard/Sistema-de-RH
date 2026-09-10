import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, Index, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class JobStatus(str, enum.Enum):
    uploaded = "uploaded"
    extracting = "extracting"
    ready_for_provider = "ready_for_provider"
    completed = "completed"
    needs_review = "needs_review"
    provider_not_configured = "provider_not_configured"
    failed = "failed"


class ProviderStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    not_configured = "not_configured"
    failed = "failed"


class VacancyStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class ApplicationStage(str, enum.Enum):
    application = "application"
    screening = "screening"
    contact = "contact"
    interview_hr = "interview_hr"
    manager_interview = "manager_interview"
    research = "research"
    documents = "documents"
    training = "training"
    hiring = "hiring"


class ReviewStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"


class ResumeFile(Base):
    __tablename__ = "resume_files"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    original_name: Mapped[str] = mapped_column(String(255))
    stored_name: Mapped[str] = mapped_column(String(80), unique=True)
    storage_path: Mapped[str] = mapped_column(String(1024))
    sha256: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    extension: Mapped[str] = mapped_column(String(10))
    mime_type: Mapped[str] = mapped_column(String(120))
    size_bytes: Mapped[int] = mapped_column(BigInteger)
    extracted_text: Mapped[str | None] = mapped_column(Text().with_variant(LONGTEXT(), "mysql"), nullable=True)
    extraction_note: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    jobs: Mapped[list["ExtractionJob"]] = relationship(back_populates="resume_file")
    applications: Mapped[list["Application"]] = relationship(back_populates="resume_file")


class Vacancy(Base):
    __tablename__ = "vacancies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    post_name: Mapped[str] = mapped_column(String(255))
    status: Mapped[VacancyStatus] = mapped_column(Enum(VacancyStatus), default=VacancyStatus.active, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    applications: Mapped[list["Application"]] = relationship(back_populates="vacancy")


class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    location: Mapped[str | None] = mapped_column(String(500), nullable=True)
    experience: Mapped[str | None] = mapped_column(Text, nullable=True)
    education: Mapped[str | None] = mapped_column(String(500), nullable=True)
    availability: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    applications: Mapped[list["Application"]] = relationship(back_populates="candidate")


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id: Mapped[str] = mapped_column(ForeignKey("candidates.id"), index=True)
    vacancy_id: Mapped[str] = mapped_column(ForeignKey("vacancies.id"), index=True)
    resume_file_id: Mapped[str] = mapped_column(ForeignKey("resume_files.id"), index=True)
    source_provider: Mapped[str] = mapped_column(String(30))
    stage: Mapped[ApplicationStage] = mapped_column(Enum(ApplicationStage), default=ApplicationStage.application, index=True)
    review_status: Mapped[ReviewStatus] = mapped_column(Enum(ReviewStatus), default=ReviewStatus.pending)
    owner: Mapped[str] = mapped_column(String(120), default="Equipe RH")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    candidate: Mapped[Candidate] = relationship(back_populates="applications")
    vacancy: Mapped[Vacancy] = relationship(back_populates="applications")
    resume_file: Mapped[ResumeFile] = relationship(back_populates="applications")
    extraction_jobs: Mapped[list["ExtractionJob"]] = relationship(back_populates="application")

    __table_args__ = (
        UniqueConstraint("candidate_id", "vacancy_id", name="uq_application_candidate_vacancy"),
        UniqueConstraint("vacancy_id", "resume_file_id", name="uq_application_vacancy_resume"),
    )


class ExtractionJob(Base):
    __tablename__ = "extraction_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_file_id: Mapped[str] = mapped_column(ForeignKey("resume_files.id"), index=True)
    application_id: Mapped[str | None] = mapped_column(ForeignKey("applications.id"), nullable=True, index=True)
    requested_providers: Mapped[list[str]] = mapped_column(JSON)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus), default=JobStatus.uploaded, index=True)
    error_code: Mapped[str | None] = mapped_column(String(80), nullable=True)
    error_message: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    resume_file: Mapped[ResumeFile] = relationship(back_populates="jobs")
    application: Mapped[Application | None] = relationship(back_populates="extraction_jobs")
    results: Mapped[list["ExtractionResult"]] = relationship(back_populates="job")


class ExtractionResult(Base):
    __tablename__ = "extraction_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id: Mapped[str] = mapped_column(ForeignKey("extraction_jobs.id"), index=True)
    provider: Mapped[str] = mapped_column(String(30))
    status: Mapped[ProviderStatus] = mapped_column(Enum(ProviderStatus), default=ProviderStatus.pending)
    structured_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    error_code: Mapped[str | None] = mapped_column(String(80), nullable=True)
    error_message: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    job: Mapped[ExtractionJob] = relationship(back_populates="results")

    __table_args__ = (Index("ix_result_job_provider", "job_id", "provider", unique=True),)


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    event_type: Mapped[str] = mapped_column(String(80), index=True)
    entity_type: Mapped[str] = mapped_column(String(50))
    entity_id: Mapped[str] = mapped_column(String(36), index=True)
    details: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
