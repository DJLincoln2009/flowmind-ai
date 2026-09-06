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
| 1.4 | Init monorepo (Turborepo + pnpm) | ⏳ | | | | |
| 1.5 | Initialisation `apps/web` (Next.js 16 + shadcn/ui + Tailwind v4) | ⏳ | | | | |
| 1.6 | Initialisation `apps/api` (FastAPI + SQLModel + SQLite + Alembic) | ⏳ | | | | |
| 1.7 | Design system : tokens dark-first + Geist fonts | ⏳ | | | | |
| 1.8 | Authentification (BetterAuth/Lucia — JWT + OAuth2) | ⏳ | | | | |
| 1.9 | API CRUD workflows | ⏳ | | | | |
| 1.10 | Docker Compose local | ⏳ | | | | |
| 1.11 | Commit initial du socle | ⏳ | | | | |

---

## Semaine 2 — Workflow Builder Core

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 2.1 | Canvas React Flow v12 + custom nodes | ⏳ | | | | |
| 2.2 | Node palette drag-and-drop | ⏳ | | | | |
| 2.3 | Save/load workflows (JSON → API → SQLite) | ⏳ | | | | |
| 2.4 | Zustand stores (4 domaines) | ⏳ | | | | |
| 2.5 | Command Palette (Cmd+K) | ⏳ | | | | |
| 2.6 | Sidebar navigation premium | ⏳ | | | | |

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
