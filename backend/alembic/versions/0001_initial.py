"""create extraction laboratory tables"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "resume_files",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("original_name", sa.String(255), nullable=False),
        sa.Column("stored_name", sa.String(80), nullable=False, unique=True),
        sa.Column("storage_path", sa.String(1024), nullable=False),
        sa.Column("sha256", sa.String(64), nullable=False, unique=True),
        sa.Column("extension", sa.String(10), nullable=False),
        sa.Column("mime_type", sa.String(120), nullable=False),
        sa.Column("size_bytes", sa.BigInteger(), nullable=False),
        sa.Column("extracted_text", mysql.LONGTEXT(), nullable=True),
        sa.Column("extraction_note", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_resume_files_sha256", "resume_files", ["sha256"], unique=True)
    op.create_table(
        "extraction_jobs",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("resume_file_id", sa.String(36), sa.ForeignKey("resume_files.id"), nullable=False),
        sa.Column("requested_providers", sa.JSON(), nullable=False),
        sa.Column("status", sa.Enum("uploaded", "extracting", "ready_for_provider", "completed", "needs_review", "provider_not_configured", "failed", name="jobstatus"), nullable=False),
        sa.Column("error_code", sa.String(80), nullable=True),
        sa.Column("error_message", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("ix_extraction_jobs_resume_file_id", "extraction_jobs", ["resume_file_id"])
    op.create_index("ix_extraction_jobs_status", "extraction_jobs", ["status"])
    op.create_table(
        "extraction_results",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("job_id", sa.String(36), sa.ForeignKey("extraction_jobs.id"), nullable=False),
        sa.Column("provider", sa.String(30), nullable=False),
        sa.Column("status", sa.Enum("pending", "completed", "not_configured", "failed", name="providerstatus"), nullable=False),
        sa.Column("structured_data", sa.JSON(), nullable=True),
        sa.Column("error_code", sa.String(80), nullable=True),
        sa.Column("error_message", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_extraction_results_job_id", "extraction_results", ["job_id"])
    op.create_index("ix_result_job_provider", "extraction_results", ["job_id", "provider"], unique=True)
    op.create_table(
        "audit_events",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("event_type", sa.String(80), nullable=False),
        sa.Column("entity_type", sa.String(50), nullable=False),
        sa.Column("entity_id", sa.String(36), nullable=False),
        sa.Column("details", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_audit_events_event_type", "audit_events", ["event_type"])
    op.create_index("ix_audit_events_entity_id", "audit_events", ["entity_id"])


def downgrade() -> None:
    op.drop_table("audit_events")
    op.drop_table("extraction_results")
    op.drop_table("extraction_jobs")
    op.drop_table("resume_files")

