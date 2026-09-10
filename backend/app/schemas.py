from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field

from .models import ApplicationStage, JobStatus, ProviderStatus


class ProviderName(str, Enum):
    openai = "openai"
    gemini = "gemini"


class ProviderAvailability(BaseModel):
    provider: ProviderName
    configured: bool


class ProviderResultOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    provider: str
    status: ProviderStatus
    structured_data: dict | None = None
    error_code: str | None = None
    error_message: str | None = None


class ResumeFileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    original_name: str
    sha256: str
    extension: str
    mime_type: str
    size_bytes: int
    duplicate: bool = False
    text_preview: str | None = None
    extraction_note: str | None = None


class ExtractionJobOut(BaseModel):
    id: str
    status: JobStatus
    requested_providers: list[str]
    file: ResumeFileOut
    results: list[ProviderResultOut] = Field(default_factory=list)
    error_code: str | None = None
    error_message: str | None = None
    created_at: datetime


class AddToKanbanIn(BaseModel):
    provider: ProviderName
    vacancy_code: str = Field(min_length=1, max_length=40)


class CandidateCardOut(BaseModel):
    id: str
    name: str
    initials: str
    photo: str | None = None
    source: str
    stage: str
    evidence: str
    evidenceTone: str
    requirements: str
    route: str
    fare: str
    stageTime: str
    owner: str
    messages: int
    duplicate: str | None = None
    role: str
    postName: str
    location: str
    availability: str
    education: str
    experience: str
    reviewStatus: str
    resumeFileName: str
    isDemo: bool = False
    mobilityStatus: str = "pending"
    evidences: list[dict] = Field(default_factory=list)
    missingInfo: list[str] = Field(default_factory=list)
    questions: list[str] = Field(default_factory=list)


class AddToKanbanOut(BaseModel):
    candidate: CandidateCardOut
    duplicate: bool


class MoveApplicationStageIn(BaseModel):
    stage: ApplicationStage


class HealthOut(BaseModel):
    status: str
    database: str
    environment: str
