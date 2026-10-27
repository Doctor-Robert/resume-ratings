from alembic import context
from sqlalchemy import create_engine

from app import models  # noqa: F401  (нужно, чтобы таблицы попали в Base.metadata)
from app.database import Base
from app.settings import settings

engine = create_engine(settings.database_url)

with engine.connect() as connection:
    context.configure(connection=connection, target_metadata=Base.metadata)
    with context.begin_transaction():
        context.run_migrations()
