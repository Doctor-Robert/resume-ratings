"""сохранение полного текста вакансии

Revision ID: 0004
Revises: 0003
"""
from alembic import op
import sqlalchemy as sa

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("evaluations", sa.Column("vacancy_text", sa.Text(), nullable=True))
    op.execute("UPDATE evaluations SET vacancy_text = vacancy_title")
    op.alter_column("evaluations", "vacancy_text", nullable=False)
    op.drop_column("evaluations", "vacancy_title")


def downgrade():
    op.add_column("evaluations", sa.Column("vacancy_title", sa.String(200), nullable=True))
    op.execute("UPDATE evaluations SET vacancy_title = left(vacancy_text, 200)")
    op.alter_column("evaluations", "vacancy_title", nullable=False)
    op.drop_column("evaluations", "vacancy_text")
