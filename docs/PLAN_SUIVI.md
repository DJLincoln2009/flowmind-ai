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
| 3.1 | DAG Engine (topological sort + levels) | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965` | `services/dag.py` — tri topologique de Kahn + niveaux parallèles ; détection de cycles testée |
| 3.2 | SSE streaming temps réel | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965` | `sse-starlette` ; événements `start/node/end/error` depuis le moteur (`SSEEvent`), sérialisation JSON manuelle ; token via Bearer ou query param |
| 3.3 | Intégration IA structurée (Gemini → Groq → Mistral) | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965` | `services/ai_client.py` — chaîne fallback Gemini 3.6-flash → OpenRouter (Nemotron free) → Groq (qwen3.6) → Mistral small (429 fallback) ; un seul point de bascule `AI_PRIMARY` |
| 3.4 | Bloc IA Résumé | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965` | Handler `ai_summary` (Gemini, testé end-to-end via SSE) |
| 3.5 | Bloc IA Extraction de tâches | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965` | Handler `ai_extract` (sortie JSON structurée) |
| 3.6 | Bloc IA Classification | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965` | Handler `ai_classify` |
| 3.7 | Bloc OCR (OCR.space + Tesseract fallback) | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965` | Handler `ocr` — OCR.space primaire, Tesseract fallback local ; besoins d'image (URL) |
| 3.8 | Transcription vocale (Groq Whisper) | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965` | Handler `transcription` — Groq Whisper, fallback faster-whisper CPU |
| 3.9 | State machine des exécutions | ✅ | 2026-09-07 | `feature/semaine3` | `bd7a965`, `3b6d643` | `services/executor.py` + `execution-store.ts` (idle/pending/running/success/error) ; nœuds : en attente/running/succès/échec en temps réel |
| 3.10 | Connecteur exécution API SSE → canvas | ✅ | 2026-09-07 | `feature/semaine3` | `3b6d643` | Bouton Exécuter/Arrêter dans le builder, hook `use-run-workflow`, stream branche sur le store (statuts par nœud). E2E Playwright vert (3 nœuds → Succès, 0 erreur console) |

---

## Semaine 4 — Dashboard + Polish UI

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 4.1 | Dashboard KPI | ✅ | 2026-09-07 | `feature/semaine4` | `9714343`, `84920b8` | `GET /api/stats` (workflows, exécutions, taux succès, durée moyenne, 6 récentes) + cartes KPI (skeleton, animation `appear`) |
| 4.2 | Historique des exécutions (TanStack Table) | ✅ | 2026-09-07 | `feature/semaine4` | `9714343`, `84920b8` | `GET /api/executions` (limit 100) + page `/history` (TanStack Table v9, statut/début/durée, EmptyState, skeleton) |
| 4.3 | Activity feed temps réel | ✅ | 2026-09-07 | `feature/semaine4` | `84920b8` | Récentes exécutions côté dashboard, polling `refetchInterval 4000 ms` |
| 4.4 | Notifications (Sonner + email) | ✅ | 2026-09-07 | `feature/semaine4` | `9714343`, `84920b8` | Toasts Sonner (lancée/succès/échec/erreur SSE, suppression workflow) + `services/notifier.py` SMTP best-effort (no-op sans `FLOWMIND_SMTP_HOST`) |
| 4.5 | Empty states, skeletons, error boundaries | ✅ | 2026-09-07 | `feature/semaine4` | `84920b8` | `components/shared/` : empty-state, skeleton, error-boundary (Toaster + ErrorBoundary layout) |
| 4.6 | Dark/Light toggle + responsive | ✅ | 2026-09-07 | `feature/semaine4` | `84920b8` | `next-themes` (toggle CSS-pur, sans hydration mismatch) + sidebar repliée <768px. E2E Playwright 7/7 vert, 0 erreur console |

---

## Semaine 5 — Finalisation + Deployment

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 5.1 | Templates de workflows (5–6) | ✅ | 2026-09-08 | `feature/semaine5` | `dcbcf06` `013321c` | 6 templates (`services/templates.py`) exposés en public via GET `/api/templates` ; page `/templates` + instanciation 1-clic → éditeur (3 nœuds) |
| 5.2 | Scheduled workflows (cron) | ✅ | 2026-09-08 | `feature/semaine5` | `dcbcf06` `013321c` | Crontab 5 champs via `croniter`, scheduler asyncio (tick 15 s, lock), PATCH validation (400 « Expression cron invalide »), `next_run_at` recalculé ; dialog Planification (exemples, switch actif, prochaine run). Fix : comparaisons en UTC naïf (SQLite ne stocke pas le tz) ; vérifié en live : exécution cron auto <80 s, `next_run_at` avancé |
| 5.3 | Docker Compose final | ✅ | 2026-09-08 | `feature/semaine5` | `8d5de4c` | healthchecks (python urllib API / wget web), `FLOWMIND_CORS_ORIGINS`, `NEXT_PUBLIC_API_URL`, `depends_on: service_healthy` ; `docker compose config` validé |
| 5.4 | CI/CD GitHub Actions | ✅ | 2026-09-08 | `feature/semaine5` | `8d5de4c` | `ci.yml` (uv : ruff + pytest ; pnpm : tsc shared/web, eslint, vitest, build) ; `deploy.yml` : deploy hooks Vercel + Railway.app (curl POST sur push `main`, garde `secrets != ''`) |
| 5.5 | Documentation (README, ARCHITECTURE.md) | ✅ | 2026-09-08 | `feature/semaine5` | `a01ba9e` | `docs/ARCHITECTURE.md` créé ; README complété (budget $0, qualité/CI + tests, déploiement) ; Fly.io → Railway.app partout (PLAN.md, AGENTS.md, Rapport Stratégique) |
| 5.6 | Tests (pytest backend, Vitest frontend) | ✅ | 2026-09-08 | `feature/semaine5` | `dcbcf06` `013321c` | pytest 7/7 (templates publics, validation cron) ; Vitest 5/5 (`format.test.ts` après extraction `lib/format.ts`) ; eslint + tsc web & shared clean ; `next build` OK ; E2E UI Playwright : Modèles (6) + dialog Planification (cron invalide rejeté, valide → prochaine exécution) |
| 5.7 | Déploiement production (Vercel + Railway.app) | ✅* | 2026-09-08 | `feature/semaine5` | `8d5de4c` | Automatisation prête (workflow deploy + hook endpoints, `railway.toml` healthcheck `/health`). *Déclenchement réel manuel : poser les secrets GitHub (`VERCEL_DEPLOY_HOOK`, `RAILWAY_DEPLOY_HOOK`) puis push sur `main` |
| 5.8 | Vidéo démo | ⏳ | | | | |

---

## Fonctionnalités Premium (transverse)

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| P.1 | Agentic execution (objectif → plan → exécution) | ✅ | 2026-09-12 | `feature/semaine6` | `003917b` `1efbead` | `routes/agentic.py` + `services/agentic.py` (objectif → plan agentique en 4 étapes asynchrones, téléversement du plan sur le graphe, SSE + store `agentic.js`) ; `agentic-dialog.tsx` traduit FR/EN |
| P.2 | Workspace intelligent (dossiers, tags, recherche) | ✅ | 2026-09-12 | `feature/semaine6` | `003917b` `1efbead` | `folder`/`tags` sur Workflow (validated, ≤10, lowercase), filtres `?search=&folder=&tag=`, `GET /workflows/folders`, requête tags SQLite via `cast(...) LIKE` ; UI : page workflows (recherche différée, chips dossiers/tags, reset), sidebar dossiers `/workflows?folder=`, dialog Propriétés |
| P.3 | Version history (undo/redo canvas) | ✅ | 2026-09-12 | `feature/semaine6` | `003917b` `1efbead` | `WorkflowVersion` + POST save / GET list / POST restore ; store zustand undo/redo (past/future, cap 50). Fix : `onNodesChange` `dimensions` (cosmétique) ne committe plus l'historique + déduplication → undo réel (testé : drop→undo→redo) ; raccourcis Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y |
| P.4 | Multi-language (FR/EN) | ✅ | 2026-09-12 | `feature/semaine6` | `1efbead` | `lib/i18n` : dictionnaire FR/EN à clés plates + provider `useI18n` (storage `flowmind_lang`) ; sidebar (nav + dossiers + toggle FR/EN), builder, palette, dashboard, history, workflows, templates, dialogs (planification, agentic, propriétés) |
| P.5 | PWA (installable, offline-capable) | ✅ | 2026-09-12 | `feature/semaine6` | `6aaed7e` | `app/manifest.ts` (Web Manifest Next) + `public/sw.js` (network-first navigations, cache assets, pas de `/api`) + inscription prod-only ; icônes 192/512/maskable générées ; E2E : `/sw.js` + `/manifest.webmanifest` → 200 |
| P.6 | Templates marketplace | ✅ | 2026-09-12 | `feature/semaine6` | `003917b` `1efbead` | `routes/templates.py` : GET = built-in (`b*`) + utilisateurs (`u{id}`, `source`), POST publish, DELETE owner-only (403 built-in) ; UI : onglets Galerie/Mes créations, bouton « Publier » dans le builder, dépublier |

---

## Semaine 6 — Fonctionnalités premium (P.1–P.6)

| # | Tâche | Statut | Date | Branche | Commit | Notes |
|---|-------|--------|------|---------|--------|-------|
| 6.1 | Tests backend premium (13 pytest) | ✅ | 2026-09-12 | `feature/semaine6` | `003917b` | ruff clean ; `test_workflow_versions`, `test_templates_marketplace`, filtre dossiers/tags/recherche ; 13 passed |
| 6.2 | Checks frontend + build | ✅ | 2026-09-12 | `feature/semaine6` | `1efbead` `6aaed7e` | eslint 0 erreur, tsc web & shared clean, Vitest 7/7 (dont undo/redo store), `next build` OK |
| 6.3 | E2E Playwright premium | ✅ | 2026-09-12 | `feature/semaine6` | `6aaed7e` | 11/11 : PWA, templates, instanciation, agentic, drop+undo+redo, versions, propriétés dossier/tag + filtres, recherche + reset, i18n EN/FR, publication + dépublier, cohérence API |
| 6.4 | Merge semaine 6 | ✅ | 2026-09-12 | `feature/semaine6` → `develop` | `987ca06` | Merge no-ff (PR auto-revue) |

---

## Log des ajustements

| Date | Ajustement | Raison |
|------|-----------|--------|
| 2026-09-06 | Création des documents PLAN.md et PLAN_SUIVI.md | Demande utilisateur : plan + suivi dans `docs/` |
| 2026-09-06 | Installation des skills premium `frontend-design` + `webapp-testing` | Résultat à la hauteur du benchmark premium ; skills du repo officiel `anthropics/skills` installés dans `.opencode/skills/` |
| 2026-09-06 | Installation de 6 skills `antigravity-awesome-skills` + skill custom `flowmind-design-system` | Stack cible couverte : React Flow, dark UI, Tailwind v4, FastAPI, Gemini, sécu API ; skill custom = fusion des meilleurs non retenus + tokens FlowMind |
| 2026-09-07 | Correction des noms de modèles IA | Les modèles prévus (Gemini 2.5-flash, groq llama-3.3, openrouter gemini-2.5:free) sont indisponibles/non gratuits pour les nouveaux comptes → diagnostic live et remplacement : Gemini `gemini-3.6-flash`, OpenRouter `nvidia/nemotron-3-ultra-550b-a55b:free`, Groq `qwen/qwen3.6-27b`, Mistral `mistral-small-latest` (4e fallback, rate limit 429) |
| 2026-09-07 | SSE authorisé via token en query param | EventSource ne peut pas envoyer de header Authorization → double support Bearer + `?token=` sur `/api/executions/{id}/stream` (compromis assumé, local-first) |
| 2026-09-07 | `playwright` ajouté en dependency dev de l'API | Les E2E UI Playwright sont exécutés via le venv uv ; `uv sync` l'avait retiré car hors `pyproject.toml` |
| 2026-09-08 | **Fly.io → Railway.app** (décision utilisateur) | Déploiement backend sur Railway.app : crédit initial ~$5 **sans carte au premier déploiement** (carte requise après épuisement du crédit — caveat documenté dans PLAN.md/README/ARCHITECTURE)
| 2026-09-08 | `croniter` + `uv.lock` commité | Ajout croniter>=3 (résolu → 6.2.4) ; manifestations : la règle `uv.lock` du `.gitignore` retirée car CI `uv sync --frozen` exige le lock
| 2026-09-08 | Scheduler cron en UTC naïf | SQLite ne stocke pas le timezone → `TypeError` offset-aware/naive sur le tick ; corrigé par `utcnow_naive()` (compare et génère des datetimes sans tzinfo) |
| 2026-09-12 | Undo/redo : les changements `dimensions` de React Flow committaient l'historique | Après un drop, RF mesure les nœuds → `onNodesChange(dimensions)` empilait des snapshots identiques par-dessus le snapshot pré-action → Ctrl+Z ne changeait rien ; corrigé en filtrant les changements cosmétiques + déduplication des snapshots consécutifs |
| 2026-09-12 | Fix CI `tsc --noEmit` web : `LayoutProps` absent de `next` 16.3.4 | `app/layout.tsx:36` référençait le type `LayoutProps<"/">` (TS2304) → CI échouée (`ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL`), build Railway bloqué ; remplacé par `Readonly<{ children: React.ReactNode }>` conforme à la convention des autres layouts ; `tsc --noEmit` OK en local |
| 2026-09-12 | Fix build Docker Railway : `uv.lock` exclu du contexte | `apps/api/.dockerignore` contenait `uv.lock` → avec `Root Directory = apps/api`, Docker ne voyait pas le lockfile et `COPY pyproject.toml uv.lock ./` échouait malgré `uv.lock` commité ; ligne `uv.lock` retirée du `.dockerignore` |
