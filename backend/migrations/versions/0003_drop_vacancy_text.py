"""удаление описания вакансии (оно больше не нужно)

Revision ID: 0003
Revises: 0002
"""
from alembic import op
import sqlalchemy as sa

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column("evaluations", "vacancy_text")


def downgrade():
    op.add_column("evaluations", sa.Column("vacancy_text", sa.Text(), nullable=False, server_default=""))
