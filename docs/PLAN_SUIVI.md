# FlowMind AI — Suivi du Plan

> À renseigner après chaque tâche. Chaque ligne = une tâche réalisée avec son statut, la date, la branche et le commit associé.

## Légende Statut
- ✅ Terminé
- 🔄 En cours
- ⏳ En attente
- ❌ Bloqué / Échoué

---

## Semaine 1 — Fondations

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 1.1 | Rédaction du plan (PLAN.md + PLAN_SUIVI.md) | ✅ | 2026-09-06 | `develop` | — | Documents créés dans `docs/` |
| 1.2 | Installation des skills premium (frontend-design, webapp-testing) | ✅ | 2026-09-06 | `main` | `a62f0f9` | Installés via degit depuis `anthropics/skills` |
| 1.3 | Skills complémentaires antigravity (6 scolaires + 1 custom) | ✅ | 2026-09-06 | `main` | `5c2197f` | react-flow-node-ts, frontend-ui-dark-ts, tailwind-patterns, fastapi-templates, gemini-api-dev, api-security-best-practices + skill custom `flowmind-design-system` |
| 1.4 | Config opencode projet (permission + compaction skills) | ✅ | 2026-09-06 | `main` | `b9a4749` | `opencode.json` créé ; discipline de chargement/déchargement des skills documentée dans AGENTS.md |
| 1.5 | Init monorepo (Turborepo + pnpm) | ✅ | 2026-09-06 | `feature/semaine1` | — | Turborepo 2.10.12 + pnpm 11.15.1 + Next 16.3.4 ; install vérifiée et committée à la reprise |
| 1.6 | Initialisation `apps/web` (Next.js 16 + shadcn/ui + Tailwind v4) | ✅ | 2026-09-06 | `feature/semaine1` | — | shadcn/ui v4 base-nova + Base UI (pas Radix) ; build + typecheck OK |
| 1.7 | Initialisation `apps/api` (FastAPI + SQLModel + SQLite + Alembic) | ✅ | 2026-09-06 | `feature/semaine1` | — | FastAPI 0.141+ async, SQLModel, aiosqlite, Alembic (migration initiale appliquée), uv, Ruff, pytest |
| 1.8 | Design system : tokens dark-first + Geist fonts | ✅ | 2026-09-06 | `feature/semaine1` | — | Tokens FlowMind dans globals.css (@theme) + bridge shadcn ; mode clair dérivé ; dark par défaut |
| 1.9 | Authentification (JWT access + refresh, Argon2, OAuth2 Bearer) | ✅ | 2026-09-06 | `feature/semaine1` | — | `pwdlib[argon2]` (place de passlib — bug bcrypt), pyjwt ; register/login/refresh/me testés |
| 1.10 | API CRUD workflows | ✅ | 2026-09-06 | `feature/semaine1` | — | CRUD complet + propriété (owner_id), validation Pydantic, 404/401 cohérents |
| 1.11 | Docker Compose local | ✅ | 2026-09-06 | `feature/semaine1` | — | Dockerfiles api (uv) + web (standalone monorepo), compose avec volume SQLite ; `docker compose config` validé |
| 1.12 | Commit initial du socle | ✅ | 2026-09-06 | `feature/semaine1` | — | README racine ajouté ; build web + tests API + ruff + typecheck shared validés ; branche prête à merger vers `develop` |

---

## Semaine 2 — Workflow Builder Core

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 2.1 | Canvas React Flow v12 + custom nodes | ✅ | 2026-09-07 | `feature/semaine2` | — | Canvas + custom node unique thématisé (handles, badges statut d'exécution), MiniMap, Controls, Dots background |
| 2.2 | Node palette drag-and-drop | ✅ | 2026-09-07 | `feature/semaine2` | — | 10 types de nœuds, drag natif HTML5 (dataTransfer), drop → position via screenToFlowPosition |
| 2.3 | Save/load workflows (JSON → API → SQLite) | ✅ | 2026-09-07 | `feature/semaine2` | — | Hook persistence (hydratation GET + save POST/PATCH), autosave différé 1.5 s, sérialisation Zod partagée ; pages liste/nouvel éditeur reliées |
| 2.4 | Zustand stores (4 domaines) | ✅ | 2026-09-07 | `feature/semaine2` | — | workflow (graphe + dirty + serialize), execution (nodeStates SSE-ready), ui (palette commande, sidebar, inspect), settings (thème persisté) |
| 2.5 | Command Palette (Cmd+K) | ✅ | 2026-09-07 | `feature/semaine2` | — | Modale custom (backdrop blur, autoFocus, Escape/Cmd+K), accessible dans tout le dashboard |
| 2.6 | Sidebar navigation premium | ✅ | 2026-09-07 | `feature/semaine2` | — | Sidebar collapse/expand, nav active state, layout dashboard (route groups), QueryClientProvider, page liste workflows TanStack Query |

---

## Semaine 3 — Workflow Engine + AI

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 3.1 | DAG Engine (topological sort + levels) | ⏳ | | | | |
| 3.2 | SSE streaming temps réel | ⏳ | | | | |
| 3.3 | Intégration IA structurée (Gemini → Groq → Mistral) | ⏳ | | | | |
| 3.4 | Bloc IA Résumé | ⏳ | | | | |
| 3.5 | Bloc IA Extraction de tâches | ⏳ | | | | |
| 3.6 | Bloc IA Classification | ⏳ | | | | |
| 3.7 | Bloc OCR (OCR.space + Tesseract fallback) | ⏳ | | | | |
| 3.8 | Transcription vocale (Groq Whisper) | ⏳ | | | | |
| 3.9 | State machine des exécutions | ⏳ | | | | |

---

## Semaine 4 — Dashboard + Polish UI

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 4.1 | Dashboard KPI | ⏳ | | | | |
| 4.2 | Historique des exécutions (TanStack Table) | ⏳ | | | | |
| 4.3 | Activity feed temps réel | ⏳ | | | | |
| 4.4 | Notifications (Sonner + email) | ⏳ | | | | |
| 4.5 | Empty states, skeletons, error boundaries | ⏳ | | | | |
| 4.6 | Dark/Light toggle + responsive | ⏳ | | | | |

---

## Semaine 5 — Finalisation + Deployment

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 5.1 | Templates de workflows (5–6) | ⏳ | | | | |
| 5.2 | Scheduled workflows (cron) | ⏳ | | | | |
| 5.3 | Docker Compose final | ⏳ | | | | |
| 5.4 | CI/CD GitHub Actions | ⏳ | | | | |
| 5.5 | Documentation (README, ARCHITECTURE.md) | ⏳ | | | | |
| 5.6 | Tests (pytest backend, Vitest frontend) | ⏳ | | | | |
| 5.7 | Déploiement production (Vercel + Fly.io) | ⏳ | | | | |
| 5.8 | Vidéo démo | ⏳ | | | | |

---

## Fonctionnalités Premium (transverse)

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| P.1 | Agentic execution (objectif → plan → exécution) | ⏳ | | | | |
| P.2 | Workspace intelligent (dossiers, tags, recherche) | ⏳ | | | | |
| P.3 | Version history (undo/redo canvas) | ⏳ | | | | |
| P.4 | Multi-language (FR/EN) | ⏳ | | | | |
| P.6 | Templates marketplace | ⏳ | | | | |

---

## Log des ajustements

| Date | Ajustement | Raison |
|------|-----------|--------|
| 2026-09-06 | Création des documents PLAN.md et PLAN_SUIVI.md | Demande utilisateur : plan + suivi dans `docs/` |
| 2026-09-06 | Installation des skills premium `frontend-design` + `webapp-testing` | Résultat à la hauteur du benchmark premium ; skills du repo officiel `anthropics/skills` installés dans `.opencode/skills/` |
| 2026-09-06 | Installation de 6 skills `antigravity-awesome-skills` + skill custom `flowmind-design-system` | Stack cible couverte : React Flow, dark UI, Tailwind v4, FastAPI, Gemini, sécu API ; skill custom = fusion des meilleurs non retenus + tokens FlowMind |
