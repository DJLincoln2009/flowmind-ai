from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


async def register(client: AsyncClient, email: str = "pytest@flowmind.app") -> dict:
    r = await client.post(
        "/api/auth/register",
        json={"email": email, "password": "secret123", "name": "Pytest"},
    )
    assert r.status_code == 201
    return r.json()


@pytest.mark.asyncio
async def test_health(client: AsyncClient) -> None:
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_auth_register_login(client: AsyncClient) -> None:
    tokens = await register(client)
    assert "access_token" in tokens

    r = await client.post(
        "/api/auth/login",
        json={"email": "pytest@flowmind.app", "password": "secret123"},
    )
    assert r.status_code == 200
    assert "access_token" in r.json()


@pytest.mark.asyncio
async def test_workflow_crud(client: AsyncClient) -> None:
    tokens = await register(client)
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    r = await client.post(
        "/api/workflows",
        headers=headers,
        json={"name": "Test", "description": "desc", "definition": {"nodes": [], "edges": []}},
    )
    assert r.status_code == 201
    wf_id = r.json()["id"]

    r = await client.get("/api/workflows", headers=headers)
    assert r.status_code == 200
    assert len(r.json()) == 1

    r = await client.patch(f"/api/workflows/{wf_id}", headers=headers, json={"name": "Renommé"})
    assert r.status_code == 200
    assert r.json()["name"] == "Renommé"

    r = await client.delete(f"/api/workflows/{wf_id}", headers=headers)
    assert r.status_code == 204


@pytest.mark.asyncio
async def test_auth_required(client: AsyncClient) -> None:
    r = await client.get("/api/workflows")
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_dashboard_stats_and_history(client: AsyncClient) -> None:
    tokens = await register(client)
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    r = await client.get("/api/stats", headers=headers)
    assert r.status_code == 200
    stats = r.json()
    assert stats["workflows_total"] == 0
    assert stats["executions_total"] == 0
    assert stats["execution_success_rate"] == 0.0
    assert stats["recent_executions"] == []

    r = await client.post(
        "/api/workflows",
        headers=headers,
        json={"name": "Stat", "definition": {"nodes": [], "edges": []}},
    )
    wf_id = r.json()["id"]

    r = await client.post(f"/api/workflows/{wf_id}/run", headers=headers)
    exec_id = r.json()["execution_id"]

    r = await client.get("/api/stats", headers=headers)
    stats = r.json()
    assert stats["workflows_total"] == 1
    assert stats["executions_total"] == 1

    r = await client.get("/api/executions", headers=headers)
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 1
    assert items[0]["id"] == exec_id
    assert items[0]["workflow_name"] == "Stat"
    assert "duration_ms" in items[0]

    # Isolé par utilisateur
    other = await register(client, "autre@flowmind.app")
    r = await client.get(
        "/api/executions", headers={"Authorization": f"Bearer {other['access_token']}"}
    )
    assert r.json() == []