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


@pytest.mark.asyncio
async def test_templates_public(client: AsyncClient) -> None:
    r = await client.get("/api/templates")
    assert r.status_code == 200
    templates = r.json()
    assert len(templates) >= 5
    for t in templates:
        assert t["id"] and t["name"] and t["icon"]
        definition = t["definition"]
        assert definition["nodes"] and definition["edges"]
        # Chaque arête référence des nœuds existants (graphe valide)
        ids = {n["id"] for n in definition["nodes"]}
        for edge in definition["edges"]:
            assert edge["source"] in ids
            assert edge["target"] in ids


@pytest.mark.asyncio
async def test_workflow_schedule_cron(client: AsyncClient) -> None:
    tokens = await register(client)
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    r = await client.post(
        "/api/workflows",
        headers=headers,
        json={"name": "Planifié", "definition": {"nodes": [], "edges": []}},
    )
    wf_id = r.json()["id"]

    # cron invalide -> 400
    r = await client.patch(f"/api/workflows/{wf_id}", headers=headers, json={"cron": "not-a-cron"})
    assert r.status_code == 400

    # cron valide -> next_run_at peuplé
    r = await client.patch(f"/api/workflows/{wf_id}", headers=headers, json={"cron": "0 9 * * *"})
    assert r.status_code == 200
    wf = r.json()
    assert wf["cron"] == "0 9 * * *"
    assert wf["next_run_at"] is not None

    # retrait du cron -> next_run_at à None
    r = await client.patch(f"/api/workflows/{wf_id}", headers=headers, json={"cron": None})
    assert r.status_code == 200
    assert r.json()["cron"] is None
    assert r.json()["next_run_at"] is None


def _agentic_payload() -> dict:
    return {
        "name": "Résumé quotidien",
        "description": "Résume le texte fourni",
        "nodes": [
            {"id": "n1", "type": "trigger", "data": {"text": "un exemple"}},
            {"id": "n2", "type": "ai_summary", "data": {}},
            {"id": "n3", "type": "output", "data": {}},
        ],
        "edges": [
            {"id": "e1", "source": "n1", "target": "n2"},
            {"id": "e2", "source": "n2", "target": "n3"},
        ],
    }


@pytest.mark.asyncio
async def test_agentic_plan_generation(monkeypatch, client: AsyncClient) -> None:
    async def fake_llm_json(prompt: str, **_: object) -> dict:
        assert "Chaque matin" in prompt
        return _agentic_payload()

    monkeypatch.setattr("app.services.agentic.ai_client.llm_json", fake_llm_json)
    tokens = await register(client)
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    r = await client.post(
        "/api/agentic/plan",
        headers=headers,
        json={"objective": "Chaque matin, résume le texte fourni"},
    )
    assert r.status_code == 200, r.text
    plan = r.json()
    assert plan["name"] == "Résumé quotidien"
    nodes = plan["definition"]["nodes"]
    assert [n["type"] for n in nodes] == ["trigger", "ai_summary", "output"]
    for n in nodes:
        assert "position" in n and "data" in n

    # Création du workflow à partir du plan via l'endpoint standard
    r = await client.post(
        "/api/workflows",
        headers=headers,
        json={
            "name": plan["name"],
            "description": plan["description"],
            "definition": plan["definition"],
        },
    )
    assert r.status_code == 201
    assert len(r.json()["definition"]["nodes"]) == 3


@pytest.mark.asyncio
async def test_agentic_rejects_unknown_node_type(monkeypatch, client: AsyncClient) -> None:
    async def bad_llm_json(prompt: str, **_: object) -> dict:
        return {
            "name": "Plan cassé",
            "nodes": [{"id": "n1", "type": "not_a_real_type", "data": {}}],
            "edges": [],
        }

    monkeypatch.setattr("app.services.agentic.ai_client.llm_json", bad_llm_json)
    tokens = await register(client)
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    r = await client.post(
        "/api/agentic/plan",
        headers=headers,
        json={"objective": "Objectif volontairement inconnu de l'IA"},
    )
    assert r.status_code == 422


@pytest.mark.asyncio
async def test_agentic_requires_auth(client: AsyncClient) -> None:
    r = await client.post("/api/agentic/plan", json={"objective": "objectif sans compte"})
    assert r.status_code == 401


@pytest.mark.asyncio
async def test_workspace_folders_tags_search(client: AsyncClient) -> None:
    tokens = await register(client, "workspace@flowmind.app")
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    async def create(name: str, folder: str | None, tags: list[str]) -> int:
        r = await client.post(
            "/api/workflows",
            headers=headers,
            json={"name": name, "folder": folder, "tags": tags, "definition": {"nodes": [], "edges": []}},
        )
        assert r.status_code == 201
        return r.json()["id"]

    w1 = await create("Résumé des avis", "marketing", ["ai", "quotidien"])
    await create("Veille concurrentielle", "marketing", ["veille"])
    await create("Extraction factures", "compta", ["ocr"])

    async def listing(search: str = "", folder: str | None = None, tag: str | None = None) -> list[str]:
        url = "/api/workflows"
        params: list[str] = []
        if search:
            params.append(f"search={search}")
        if folder:
            params.append(f"folder={folder}")
        if tag:
            params.append(f"tag={tag}")
        if params:
            url += "?" + "&".join(params)
        r = await client.get(url, headers=headers)
        assert r.status_code == 200
        return [w["name"] for w in r.json()]

    assert len(await listing()) == 3
    assert sorted(await listing(folder="marketing")) == ["Résumé des avis", "Veille concurrentielle"]
    assert await listing(tag="veille") == ["Veille concurrentielle"]
    assert await listing(search="factures") == ["Extraction factures"]
    assert await listing(search="résumé") == ["Résumé des avis"]

    # Endpoint dossiers
    r = await client.get("/api/workflows/folders", headers=headers)
    assert r.status_code == 200
    assert r.json() == ["compta", "marketing"]

    # Mise à jour des tags (déduplication + normalisation lowercase)
    r = await client.patch(f"/api/workflows/{w1}", headers=headers, json={"tags": ["IA", "ia", "quotidien"]})
    assert r.status_code == 200
    assert r.json()["tags"] == ["ia", "quotidien"]

    # Retrait du dossier (string vide -> None)
    r = await client.patch(f"/api/workflows/{w1}", headers=headers, json={"folder": " "})
    assert r.status_code == 200
    assert r.json()["folder"] is None


@pytest.mark.asyncio
async def test_workflow_versions(client: AsyncClient) -> None:
    tokens = await register(client, "versions@flowmind.app")
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    definition_v1 = {"nodes": [{"id": "a", "type": "trigger", "position": {"x": 0, "y": 0}, "data": {}}], "edges": []}

    r = await client.post("/api/workflows", headers=headers, json={"name": "Versions", "definition": definition_v1})
    wf_id = r.json()["id"]

    # Liste vide puis save → 1 version
    r = await client.get(f"/api/workflows/{wf_id}/versions", headers=headers)
    assert r.status_code == 200 and r.json() == []

    r = await client.post(
        f"/api/workflows/{wf_id}/versions/save", headers=headers, json={"label": "point initial"}
    )
    assert r.status_code == 201
    version_id = r.json()["id"]

    # Modifier le workflow puis restaurer
    definition_v2 = {
        "nodes": [{"id": "a", "type": "trigger", "position": {"x": 0, "y": 0}, "data": {}}, {"id": "b", "type": "output", "position": {"x": 200, "y": 0}, "data": {}}],
        "edges": [{"id": "e", "source": "a", "target": "b"}],
    }
    r = await client.patch(f"/api/workflows/{wf_id}", headers=headers, json={"definition": definition_v2})
    assert r.status_code == 200 and len(r.json()["definition"]["nodes"]) == 2

    r = await client.post(f"/api/workflows/{wf_id}/versions/{version_id}/restore", headers=headers)
    assert r.status_code == 200
    assert r.json()["definition"]["nodes"] == definition_v1["nodes"]

    r = await client.get(f"/api/workflows/{wf_id}/versions", headers=headers)
    assert r.status_code == 200 and len(r.json()) == 1


@pytest.mark.asyncio
async def test_templates_marketplace(client: AsyncClient) -> None:
    tokens = await register(client, "market@flowmind.app")
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    # Publier un template
    r = await client.post(
        "/api/templates",
        headers=headers,
        json={
            "name": "Mon flux",
            "description": "créé pour le test",
            "category": "personnel",
            "definition": {"nodes": [{"id": "a", "type": "trigger", "position": {"x": 0, "y": 0}, "data": {}}], "edges": []},
        },
    )
    assert r.status_code == 201
    my_id = r.json()["id"]
    assert my_id.startswith("u")

    # Visible publiquement avec les 6 officiels
    r = await client.get("/api/templates")
    templates = r.json()
    published = [t for t in templates if t["id"] == my_id]
    assert len(published) == 1
    assert published[0]["source"] == "user"
    assert sum(1 for t in templates if t["source"] == "builtin") >= 5

    # Suppression par le propriétaire
    r = await client.delete(f"/api/templates/{my_id}", headers=headers)
    assert r.status_code == 204
    r = await client.get("/api/templates")
    assert all(t["id"] != my_id for t in r.json())

    # Suppression d'un official interdit
    r = await client.delete("/api/templates/bresume-document", headers=headers)
    assert r.status_code == 403