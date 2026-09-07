import os

os.environ["FLOWMIND_DATABASE_URL"] = "sqlite+aiosqlite:///./test_flowmind.db"

import pytest
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel

from app.core.config import settings


@pytest.fixture(autouse=True)
async def _reset_db():
    engine = create_async_engine(settings.database_url)
    from app import models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)
    await engine.dispose()
    yield