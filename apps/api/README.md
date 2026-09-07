# FlowMind AI — API

Backend FastAPI (async) du monorepo. SQLModel + SQLite (aiosqlite) en local, swap PostgreSQL par `FLOWMIND_DATABASE_URL`.

## Démarrage

```powershell
uv sync            # installe les dépendances dans .venv
uv run alembic upgrade head   # applique les migrations
uv run uvicorn app.main:app --reload --port 8000
```

## Tests & lint

```powershell
uv run pytest -q
uv run ruff check app tests
```

## Migrations

```powershell
uv run alembic revision --autogenerate -m "description"   # générer
uv run alembic upgrade head                                 # appliquer
```

## Endpoints principaux

- `POST /api/auth/register` — création de compte (renvoie access + refresh token)
- `POST /api/auth/login` — connexion
- `POST /api/auth/refresh` — renouvellement
- `GET /api/auth/me` — profil (Bearer)
- `GET/POST /api/workflows` — liste / création
- `GET/PATCH/DELETE /api/workflows/{id}` — détail / mise à jour / suppression
- `GET /health` — santé

L'API écoute par défaut sur `http://localhost:8000`. La documentation interactive est sur `http://localhost:8000/docs`.