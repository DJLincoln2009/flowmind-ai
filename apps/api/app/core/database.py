from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlmodel import SQLModel

from app.core.config import settings

engine = create_async_engine(settings.database_url, echo=settings.debug, future=True)

SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_session() -> AsyncGenerator[AsyncSession]:
    async with SessionLocal() as session:
        yield session


async def init_db() -> None:
    """Crée les tables non encore migrées (utile en dev local rapide)."""
    from app import models  # noqa: F401  (enregistre les metadata)

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
