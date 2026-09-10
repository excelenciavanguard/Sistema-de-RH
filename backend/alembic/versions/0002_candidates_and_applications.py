"""create vacancies candidates and applications"""

from datetime import datetime, timezone

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


revision = "0002_candidates_applications"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "vacancies",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("code", sa.String(40), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("post_name", sa.String(255), nullable=False),
        sa.Column("status", sa.Enum("active", "inactive", name="vacancystatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_vacancies_code", "vacancies", ["code"], unique=True)
    op.create_index("ix_vacancies_status", "vacancies", ["status"])

    op.create_table(
        "candidates",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(255), nullable=True),
        sa.Column("location", sa.String(500), nullable=True),
        sa.Column("experience", mysql.LONGTEXT(), nullable=True),
        sa.Column("education", sa.String(500), nullable=True),
        sa.Column("availability", sa.String(500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "applications",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("candidate_id", sa.String(36), sa.ForeignKey("candidates.id"), nullable=False),
        sa.Column("vacancy_id", sa.String(36), sa.ForeignKey("vacancies.id"), nullable=False),
        sa.Column("resume_file_id", sa.String(36), sa.ForeignKey("resume_files.id"), nullable=False),
        sa.Column("source_provider", sa.String(30), nullable=False),
        sa.Column("stage", sa.Enum("new", "screening", "contact", "interview", "offer", "hired", name="applicationstage"), nullable=False),
        sa.Column("review_status", sa.Enum("pending", "confirmed", name="reviewstatus"), nullable=False),
        sa.Column("owner", sa.String(120), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("candidate_id", "vacancy_id", name="uq_application_candidate_vacancy"),
        sa.UniqueConstraint("vacancy_id", "resume_file_id", name="uq_application_vacancy_resume"),
    )
    op.create_index("ix_applications_candidate_id", "applications", ["candidate_id"])
    op.create_index("ix_applications_vacancy_id", "applications", ["vacancy_id"])
    op.create_index("ix_applications_resume_file_id", "applications", ["resume_file_id"])
    op.create_index("ix_applications_stage", "applications", ["stage"])

    op.add_column("extraction_jobs", sa.Column("application_id", sa.String(36), nullable=True))
    op.create_foreign_key(
        "fk_extraction_jobs_application_id",
        "extraction_jobs",
        "applications",
        ["application_id"],
        ["id"],
    )
    op.create_index("ix_extraction_jobs_application_id", "extraction_jobs", ["application_id"])

    vacancy = sa.table(
        "vacancies",
        sa.column("id", sa.String),
        sa.column("code", sa.String),
        sa.column("title", sa.String),
        sa.column("post_name", sa.String),
        sa.column("status", sa.String),
        sa.column("created_at", sa.DateTime),
    )
    op.bulk_insert(
        vacancy,
        [{
            "id": "00000000-0000-4000-8000-000000000157",
            "code": "2026-0157",
            "title": "Auxiliar de Serviços Gerais",
            "post_name": "Leblon Power",
            "status": "active",
            "created_at": datetime.now(timezone.utc),
        }],
    )


def downgrade() -> None:
    op.drop_index("ix_extraction_jobs_application_id", table_name="extraction_jobs")
    op.drop_constraint("fk_extraction_jobs_application_id", "extraction_jobs", type_="foreignkey")
    op.drop_column("extraction_jobs", "application_id")
    op.drop_table("applications")
    op.drop_table("candidates")
    op.drop_table("vacancies")
