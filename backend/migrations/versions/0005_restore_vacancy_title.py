"""сохранение названия отдельно от описания вакансии

Revision ID: 0005
Revises: 0004
"""
from alembic import op
import sqlalchemy as sa

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("evaluations", sa.Column("vacancy_title", sa.String(200), nullable=True))
    op.execute("UPDATE evaluations SET vacancy_title = left(vacancy_text, 200)")
    op.alter_column("evaluations", "vacancy_title", nullable=False)


def downgrade():
    op.drop_column("evaluations", "vacancy_title")
