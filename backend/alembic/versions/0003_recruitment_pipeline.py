"""expand application stages to the approved recruitment pipeline"""

from alembic import op


revision = "0003_recruitment_pipeline"
down_revision = "0002_candidates_applications"
branch_labels = None
depends_on = None


NEW_STAGES = (
    "application",
    "screening",
    "contact",
    "interview_hr",
    "manager_interview",
    "research",
    "documents",
    "training",
    "hiring",
)

LEGACY_STAGES = ("new", "screening", "contact", "interview", "offer", "hired")


def _mysql_enum(values: tuple[str, ...]) -> str:
    return ", ".join(f"'{value}'" for value in values)


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "mysql":
        raise RuntimeError("A migração 0003 foi projetada para o banco próprio MySQL do Alpha RH.")

    transitional = tuple(dict.fromkeys((*LEGACY_STAGES, *NEW_STAGES)))
    op.execute(f"ALTER TABLE applications MODIFY COLUMN stage ENUM({_mysql_enum(transitional)}) NOT NULL")
    op.execute("UPDATE applications SET stage = 'application' WHERE stage = 'new'")
    op.execute("UPDATE applications SET stage = 'interview_hr' WHERE stage = 'interview'")
    op.execute("UPDATE applications SET stage = 'manager_interview' WHERE stage = 'offer'")
    op.execute("UPDATE applications SET stage = 'hiring' WHERE stage = 'hired'")
    op.execute(f"ALTER TABLE applications MODIFY COLUMN stage ENUM({_mysql_enum(NEW_STAGES)}) NOT NULL")


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "mysql":
        raise RuntimeError("A migração 0003 foi projetada para o banco próprio MySQL do Alpha RH.")

    transitional = tuple(dict.fromkeys((*NEW_STAGES, *LEGACY_STAGES)))
    op.execute(f"ALTER TABLE applications MODIFY COLUMN stage ENUM({_mysql_enum(transitional)}) NOT NULL")
    op.execute("UPDATE applications SET stage = 'new' WHERE stage = 'application'")
    op.execute("UPDATE applications SET stage = 'interview' WHERE stage = 'interview_hr'")
    op.execute("UPDATE applications SET stage = 'offer' WHERE stage IN ('manager_interview', 'research', 'documents', 'training')")
    op.execute("UPDATE applications SET stage = 'hired' WHERE stage = 'hiring'")
    op.execute(f"ALTER TABLE applications MODIFY COLUMN stage ENUM({_mysql_enum(LEGACY_STAGES)}) NOT NULL")
