RAPPORT STRATÉGIQUE DE PROJET DE STAGE

## FlowMind AI

Plateforme d'automatisation intelligente pilotée par l'intelligence artificielle

Conception, architecture technique, méthodologie de développement et plan de mise en œuvre d'une plateforme SaaS de workflows intelligents (drag-and-drop) destinée aux étudiants, freelances, PME et entrepreneurs.

## TYPE DE PROJET

Plateforme SaaS d'automatisation IA — Projet de stage

DOMAINE TECHNIQUE

Ingénierie logicielle, IA appliquée, architecture cloud

PÉRIODE DE RÉALISATION

Plan de développement sur 3 semaines (MVP)

VERSION DU DOCUMENT

Édition 2026 — V1.0


## Rapport stratégique — FlowMind AI Table des matières


## 01 Résumé exécutif

FlowMind AI est une plateforme SaaS d'automatisation intelligente qui permet à ses utilisateurs de construire des workflows via une interface visuelle en glisser-déposer (drag-and-drop), sans compétence technique préalable. Le système reçoit des données depuis des déclencheurs variés — texte, fichiers, notes vocales, webhooks, e-mails — puis mobilise des services d'intelligence artificielle pour résumer du contenu, extraire automatiquement des tâches, classifier de l'information, générer des rapports et exécuter des décisions conditionnelles. Le projet est mené dans le cadre d'un stage et vise la livraison d'un MVP (Minimum Viable Product) fonctionnel en trois semaines, démontrable devant un jury ou un encadrant professionnel.

Le contexte de marché renforce la pertinence du projet : le marché mondial de l'automatisation par IA est évalué à environ 169,5 milliards de dollars en 2026 et devrait dépasser 1 140 milliards de dollars d'ici 2033, avec un taux de croissance annuel composé (CAGR) proche de 31 %. Sur le plan continental, les start-up technologiques africaines ont levé environ 4,1 milliards de dollars en 2025, un rebond de près de 25 % par rapport à 2024, confirmant l'appétit croissant des investisseurs pour les solutions logicielles et l'IA appliquée à la productivité des PME. FlowMind AI se positionne à l'intersection de ces deux dynamiques : une demande mondiale explosive pour l'automatisation intelligente et un marché africain encore sous-équipé en outils no-code abordables et localement adaptés.

## Objectifs du stage

- Concevoir et développer un MVP fonctionnel de plateforme d'automatisation par workflows intelligents.

- Mettre en œuvre une architecture technique moderne, scalable et majoritairement gratuite ou open source.

- Intégrer des capacités d'IA générative (résumé, extraction de tâches, classification, OCR) via des API accessibles.

- Démontrer une maîtrise fullstack (frontend, backend, base de données, orchestration asynchrone, sécurité).

- Produire un livrable présentable en soutenance, avec documentation technique et démonstration vidéo.

## Résultats attendus

- Un workflow builder visuel opérationnel permettant de créer, sauvegarder et exécuter des scénarios automatisés.

- Au moins trois cas d'usage IA pleinement fonctionnels : transcription et résumé de notes vocales, extraction de tâches, classification de contenu.

- Un moteur d'exécution asynchrone fiable avec historique, notifications et gestion des erreurs.

- Une plateforme déployée en ligne, accessible via une URL publique, avec authentification sécurisée.

- Une documentation technique complète (README, architecture, guide d'installation) publiée sur GitHub.

## Importance et positionnement du projet


Ce projet dépasse le cadre d'un simple exercice académique : il constitue une démonstration concrète de compétences directement recherchées sur le marché de l'emploi tech en 2026 — développement fullstack moderne, intégration d'API d'IA générative, architecture orientée événements et conception de systèmes asynchrones. Il répond également à un besoin réel et documenté : les outils d'automatisation existants (Zapier, Make) restent coûteux et complexes pour les débutants, en particulier dans un contexte africain où le pouvoir d'achat logiciel est limité. FlowMind AI a ainsi vocation à servir à la fois de pièce de portfolio à forte valeur ajoutée et de socle technique réutilisable pour une éventuelle suite entrepreneuriale.

## 02 Présentation détaillée du projet

## 2.1 — Description complète du concept

FlowMind AI est conçue comme un centre de commande personnel et professionnel : l'utilisateur y connecte des sources de données (notes vocales, e-mails, fichiers, formulaires, webhooks) à des blocs de traitement intelligent, puis à des actions de sortie (notification, création de tâche, envoi vers un outil tiers). Chaque workflow est représenté visuellement comme un graphe de nœuds reliés par des flèches, sur le modèle popularisé par des outils comme Zapier, Make ou n8n, mais avec une couche d'intelligence artificielle native à chaque étape plutôt qu'ajoutée en périphérie.

Concrètement, un scénario typique se lit comme une chaîne logique : « Quand un événement survient transforme ou analyse la donnée avec l'IA décide de l'action à mener exécute et notifie ». Cette logique événementielle permet de couvrir des besoins très variés sans que l'utilisateur ait à écrire une seule ligne de code.

## Exemple de workflow — de la voix à la tâche

```
Nouvelle note vocale Transcription IA Résumé automatique Extraction des
tâches Notification utilisateur
```

## 2.2 — Problème identifié

- Perte de temps considérable dans la gestion manuelle de tâches répétitives (tri d'e-mails, saisie, relecture de notes).

- Volume croissant d'informations non structurées (audio, documents, messages) difficile à traiter sans outil dédié.

- Fragmentation des outils de travail : les utilisateurs jonglent entre plusieurs applications non connectées.

- Manque de solutions d'automatisation réellement pilotées par l'IA, accessibles financièrement et pédagogiquement.

- Inadéquation des plateformes existantes (Zapier, Make) avec le contexte économique de nombreux marchés émergents, notamment africain.

## 2.3 — Solution proposée

FlowMind AI répond à ces constats par une plateforme unique combinant trois piliers : (1) un constructeur de workflows visuel accessible aux non-développeurs, (2) une couche d'intelligence artificielle intégrée nativement à chaque étape de traitement plutôt que comme option annexe, et (3) un modèle économique pensé pour rester abordable, avec un socle technique reposant principalement sur des services gratuits ou à coût marginal très faible.


## 2.4 — Public cible et utilisateurs concernés

| Segment | Profil | Besoin principal |
| --- | --- | --- |
| Étudiants | Preneurs de notes, révisions, gestion | Résumé de cours, organisation, fiches de |
|   | académique | révision |
| Freelances | Indépendants multi-clients, gestion | Automatisation des tâches répétitives, suivi de |
|   | administrative légère | projets |
| PME / TPE | Petites structures avec ressources IT limitées | Gestion des e-mails, factures et documents |
|   |   | administratifs |
| Startups | Équipes early-stage cherchant à scaler sans | Productivité d'équipe, centralisation des |
|   | recruter | workflows |
| Entrepreneurs | Porteurs de projets multi-casquettes | Prise de décision assistée, veille et alertes |
|   |   | automatiques |

## 2.5 — Fonctionnalités principales

| Fonctionnalité | Description | Valeur ajoutée |
| --- | --- | --- |
| Authentification sécurisée | Gestion des comptes utilisateurs (JWT / OAuth2) | Sécurité et personnalisation |
| Workflow Builder | Création visuelle des automatisations | Simplicité d'utilisation |
|   | (drag-and-drop) |   |
| Résumé IA | Génération automatique de résumés de texte ou | Gain de temps |
|   | d'audio |   |
| Extraction de tâches | Détection automatique des actions à mener (TODO) | Productivité |
| Classification intelligente | Analyse et catégorisation automatique de contenu | Organisation |
| OCR Documents | Extraction de texte depuis images et PDF | Automatisation administrative |
| Historique des workflows | Suivi des exécutions passées et de leur statut | Traçabilité |
| Notifications intelligentes | Alertes déclenchées selon des conditions définies | Réactivité |
| Webhooks / API | Intégration avec des services externes (Trello, | Extensibilité |
|   | e-mail, Telegram) |   |

## 2.6 — Valeur ajoutée du projet

| Avantage | Impact |
| --- | --- |
| Intégration IA native | Automatisations plus intelligentes qu'une simple chaîne trigger-action |
| Interface visuelle moderne | Expérience utilisateur simplifiée, accessible aux non-techniciens |
| Faible coût d'exploitation | Accessibilité pour étudiants, freelances et PME à budget limité |
| Adaptabilité locale | Potentiel d'adoption sur le marché africain, en forte croissance |
| Architecture scalable | Évolution future facilitée vers un produit commercialisable |


## 03 Analyse du besoin et étude de l'existant

## 3.1 — Analyse du problème

L'automatisation des tâches numériques est devenue un enjeu central de productivité, aussi bien pour les individus que pour les organisations. Les données de marché confirment cette tendance : selon Grand View Research, plus de 68 % des grandes entreprises avaient déployé au moins un système d'automatisation basé sur l'IA en 2024, contre 42 % en 2020 — une progression de 26 points en quatre ans. Du côté des petites et moyennes entreprises, l'adoption est passée d'environ 22 % en 2024 à près de 38 % en 2026, portée par la baisse des coûts d'implémentation et la maturité croissante des modèles d'IA générative accessibles par API.

Cette dynamique s'accompagne d'un retour sur investissement documenté : les entreprises ayant adopté l'automatisation IA rapportent en moyenne une réduction de 35 % de leurs coûts opérationnels, avec un ROI moyen estimé à 250 % sur dix-huit mois selon plusieurs études sectorielles (McKinsey, Deloitte, Salesforce). Pour les segments visés par FlowMind AI — étudiants, freelances et PME — le principal frein n'est donc plus la valeur perçue de l'automatisation, mais l'accessibilité technique et financière des outils existants.

## 3.2 — Limites des solutions existantes

Les plateformes dominantes du marché de l'automatisation — Zapier et Make (ex-Integromat) — illustrent bien ces limites d'accessibilité. Leurs modèles de tarification, bien que flexibles, deviennent rapidement coûteux dès que le volume d'automatisations augmente :

| Plateforme | Offre gratuite | Entrée payante | Limite principale |
| --- | --- | --- | --- |
| Zapier | 100 tâches / mois, 2 | 19,99829,99 $/mois pour 750 | Facturation par tâche : coût qui |
|   | étapes max | tâches | explose avec des workflows |
|   |   |   | multi-étapes |
| Make (Integromat) | 1 000 crédits / mois | 9612 $/mois pour 10 000 | Système de crédits complexe |
|   |   | crédits | à anticiper (chaque module |
|   |   |   | consomme un crédit) |
| IFTTT | 20 applets max (offre | 3,99 $/mois | Orienté grand public, peu |
|   | payante) |   | adapté aux automatisations |
|   |   |   | professionnelles complexes |

Tarifs constatés au premier semestre 2026, susceptibles d'évoluer ; sources : pages tarifaires officielles Zapier et Make, comparatifs indépendants (2026).

Au-delà du coût, ces outils historiques ont été conçus autour d'une logique trigger action à laquelle l'IA a été ajoutée a posteriori, sous forme de modules optionnels. Cela se traduit par une expérience utilisateur pensée pour des automatisations mécaniques plutôt que pour des décisions contextuelles nécessitant de la compréhension de langage naturel. Enfin, l'écosystème de facturation en dollars, l'absence de moyens de paiement locaux et l'interface exclusivement anglophone constituent des barrières supplémentaires pour une large partie des utilisateurs africains et francophones.

## 3.3 — Comparaison avec les outils concurrents

| Critère | Zapier | Make | n8n (open | FlowMind AI (cible) |
| --- | --- | --- | --- | --- |
|   |   |   | source) |   |
| IA native intégrée | Modules IA | Modules IA | Nécessite | IA au cœur de chaque |
|   | additionnels | additionnels | configuration | bloc |
|   |   |   | technique |   |


| Critère | Zapier | Make | n8n (open | FlowMind AI (cible) |
| --- | --- | --- | --- | --- |
|   |   |   | source) |   |
| Courbe d'apprentissage | Faible | Moyenne | Élevée (auto-hébe | Faible |
|   |   |   | rgement) |   |
| Coût d'entrée | Élevé à l'usage | Moyen | Faible | Très faible (free tier) |
|   |   |   | (self-hosted) |   |
| Personnalisation locale | Non | Non | Partielle | Oui (roadmap) |
| (FR/langues africaines) |   |   |   |   |
| Cas d'usage voix | tâche Non natif | Non natif | Via configuration | Natif |

## 3.4 — Opportunités d'amélioration

- Concevoir une expérience « IA-first » où chaque bloc peut raisonner sur le contenu, pas seulement le déplacer.

- Simplifier radicalement la tarification (freemium clair, sans système de crédits opaque).

- Optimiser pour les cas d'usage vocaux et documentaires, sous-exploités par les concurrents généralistes.

- Prioriser un déploiement low-cost, compatible avec des hébergements gratuits, pour rester accessible aux marchés à budget contraint.

- Prévoir dès la conception une extensibilité vers des canaux très utilisés localement (WhatsApp, Telegram).

## 3.5 — Justification du projet

## Pourquoi ce projet, maintenant ?

La convergence de trois facteurs rend FlowMind AI particulièrement pertinent en 2026 : (1) la baisse continue du coût des API d'IA générative rend l'intelligence embarquée économiquement viable même pour un projet à budget nul ; (2) le marché africain de la tech confirme sa reprise, avec un financement en hausse de 25 % en 2025 et une concentration croissante sur les outils B2B et de productivité SME ; (3) les plateformes historiques n'ont pas encore repensé leur produit autour de l'IA générative, laissant une fenêtre d'opportunité pour un acteur conçu « IA-native » dès l'origine.

## 04 Architecture technique recommandée

L'architecture retenue suit une logique en couches, où chaque composant a une responsabilité unique et communique avec les autres via des interfaces claires (API REST, files de messages). Ce découplage permet de faire évoluer, tester et déployer chaque brique indépendamment — un principe essentiel pour un projet mené en solo ou en petite équipe dans un délai contraint.

## 4.1 — Vue d'ensemble de l'architecture

Frontend — Next.js + React Flow + TailwindCSS

requêtes HTTP / REST (JSON) authentifiées par JWT

Backend API — FastAPI (Python), validation Pydantic, routes REST


- publication de tâches asynchrones

Workflow Engine — orchestrateur de nœuds, résolution du graphe d'exécution

- mise en file d'attente

Celery + Redis — exécution asynchrone, planification, retries automatiques

- appels API

Services IA — Gemini API / OpenRouter / HuggingFace Inference, moteurs OCR

- persistance

*PostgreSQL — utilisateurs, workflows, historique d'exécution, journaux*

*Figure 1 — Flux applicatif de FlowMind AI, de l'interface utilisateur jusqu'à la persistance des données.*

## 4.2 — Frontend : interface et constructeur visuel

Le frontend repose sur Next.js (React) pour bénéficier du rendu hybride (SSR/CSR), d'un écosystème mature et d'un déploiement gratuit simplifié via Vercel. La bibliothèque React Flow gère le canevas de workflow (nœuds, arêtes, zoom, connexions), tandis que TailwindCSS assure une interface cohérente et rapide à styliser. La gestion d'état globale (sélection de nœuds, statut d'exécution en temps réel) est confiée à Zustand, plus légère que Redux pour un projet de cette taille.

## 4.3 — Backend : API et logique métier

FastAPI a été retenu pour sa performance (basé sur Starlette et Pydantic), sa documentation OpenAPI générée automatiquement (Swagger UI) et sa syntaxe asynchrone native, idéale pour orchestrer des appels vers des API d'IA externes sans bloquer le serveur. Le backend expose des routes REST pour l'authentification, la gestion des workflows (CRUD), le déclenchement manuel d'exécutions et la consultation de l'historique.

## 4.4 — Moteur de workflows et exécution asynchrone

Le Workflow Engine est le cœur logique de la plateforme : il interprète le graphe défini par l'utilisateur (nœuds et connexions), résout l'ordre d'exécution (tri topologique) et délègue chaque étape à Celery, un système de tâches distribuées utilisant Redis comme broker de messages. Cette approche garantit que les appels IA potentiellement longs (transcription audio, OCR, génération de texte) ne bloquent jamais l'interface utilisateur, et permet une reprise automatique en cas d'échec (retry policy).

## 4.5 — Intelligence artificielle

Les capacités IA sont externalisées vers des API tierces afin d'éviter tout besoin de GPU ou d'hébergement de modèles lourds — un choix essentiel pour rester dans une enveloppe budgétaire nulle ou quasi nulle. Gemini API (offre gratuite généreuse pour le résumé et la classification), OpenRouter (accès mutualisé à plusieurs modèles avec option gratuite) et des moteurs OCR open source (Tesseract) ou API dédiées couvrent l'ensemble des besoins identifiés : résumé, extraction de tâches, classification et lecture de documents.

## 4.6 — Base de données

PostgreSQL stocke les entités structurées : comptes utilisateurs, définitions de workflows (au format JSON pour la flexibilité du graphe), historique d'exécution et journaux d'erreurs. Son support natif du type JSONB


permet de conserver la structure arborescente des workflows sans sacrifier les capacités de requêtage relationnel.

## 4.7 — Hébergement et déploiement

| Composant | Hébergement recommandé | Justification |
| --- | --- | --- |
| Frontend (Next.js) | Vercel (offre gratuite) | Déploiement continu, CDN global, |
|   |   | intégration Git native |
| Backend (FastAPI) | Render ou Railway (free tier) | Déploiement simple de conteneurs Python, |
|   |   | logs intégrés |
| Worker (Celery) | Render / Railway (service séparé) | Isolation du traitement asynchrone du |
|   |   | serveur web |
| Base de données | Supabase ou Neon (PostgreSQL | Sauvegarde automatique, interface |
|   | managé gratuit) | d'administration incluse |
| Redis | Upstash (Redis serverless, free tier) | Aucune gestion d'infrastructure, facturation |
|   |   | à l'usage |

## 4.8 — Sécurité

- Authentification par JWT (access + refresh token) avec hachage des mots de passe via bcrypt/argon2.

- Validation stricte des entrées côté API grâce aux schémas Pydantic (protection contre les injections).

- Chiffrement des données sensibles au repos et en transit (HTTPS obligatoire sur tous les environnements).

- Isolation des clés API tierces (Gemini, OpenRouter) dans des variables d'environnement, jamais côté client.

- Limitation de débit (rate limiting) sur les routes sensibles pour prévenir les abus.

## 4.9 — Monitoring et observabilité

- Journalisation structurée des exécutions de workflows (statut, durée, erreurs) en base de données.

- Suivi des files Celery via Flower (interface de monitoring open source pour Celery).

- Alertes applicatives simples par e-mail ou webhook en cas d'échec répété d'un workflow.

- Tableau de bord utilisateur affichant taux de succès, temps d'exécution moyen et historique.

## 05 Stack technologique idéale

Le tableau ci-dessous détaille l'ensemble des choix technologiques retenus pour FlowMind AI, avec leur rôle, leurs avantages, leur coût réel en 2026 et les alternatives gratuites envisageables. La priorité est systématiquement donnée aux solutions open source ou disposant d'un palier gratuit suffisant pour couvrir l'intégralité du cycle de développement du MVP.

## 5.1 — Frontend

| Technologie | Rôle | Avantages | Coût | Alternative |
| --- | --- | --- | --- | --- |
|   |   |   |   | gratuite |
| Next.js | Framework React | Écosystème mature, SEO, | Gratuit (open | — |
|   | (SSR/CSR) | routing intégré | source) |   |


| Technologie | Rôle | Avantages | Coût | Alternative |
| --- | --- | --- | --- | --- |
|   |   |   |   | gratuite |
| React Flow | Canevas de workflow | Bibliothèque dédiée aux | Gratuit (licence | — |
|   | visuel | graphes de nœuds | MIT) |   |
| TailwindCSS | Framework CSS utilitaire | Développement rapide, | Gratuit | — |
|   |   | cohérence visuelle |   |   |
| Zustand | Gestion d'état globale | Léger, simple, peu de code | Gratuit | Redux Toolkit |
|   |   | répétitif |   |   |

## 5.2 — Backend

| Technologie | Rôle | Avantages | Coût | Alternative |
| --- | --- | --- | --- | --- |
|   |   |   |   | gratuite |
| FastAPI | API REST asynchrone | Performances élevées, doc | Gratuit (open | Django REST, |
|   |   | OpenAPI auto-générée | source) | Node/Express |
| Celery | Files de tâches distribuées | Standard éprouvé pour | Gratuit | RQ (Redis Queue), |
|   |   | l'asynchrone en Python |   | Dramatiq |
| Redis | Broker de messages / | Rapide, léger, largement | Gratuit | Valkey (fork open |
|   | cache | supporté | (Upstash free | source) |
|   |   |   | tier) |   |
| PostgreSQL | Base de données | Robuste, JSONB, extensible | Gratuit (Supaba | SQLite (phase |
|   | relationnelle |   | se/Neon free | locale uniquement) |
|   |   |   | tier) |   |

## 5.3 — Intelligence artificielle

| Technologie | Rôle | Avantages | Coût | Alternative |
| --- | --- | --- | --- | --- |
|   |   |   |   | gratuite |
| Gemini API | Résumé, classification, | Palier gratuit généreux, | Free tier | OpenRouter |
|   | génération de texte | bonne qualité multilingue | disponible | (modèles |
|   |   |   |   | gratuits) |
| OpenRouter | Passerelle multi-modèles | Accès mutualisé à plusieurs | Free tier + | Groq API |
|   |   | LLM, dont modèles gratuits | pay-as-you-go | (inférence |
|   |   |   |   | rapide |
|   |   |   |   | gratuite) |
| HuggingFace | Modèles spécialisés (NLP, | Grand catalogue de | Free tier limité | Modèles |
| Inference API | classification) | modèles open source |   | auto-hébergés |
|   |   |   |   | (CPU) |
| Tesseract OCR | Extraction de texte depuis | Open source, aucune | Gratuit | — |
|   | image/PDF | dépendance API |   |   |
| Whisper (API ou | Transcription audio | Très bonne précision | Gratuit en | faster-whisper |
| open source) | texte | multilingue | self-hosted, payant | (CPU-friendly) |
|   |   |   | en API |   |

## 5.4 — Déploiement et infrastructure


| Technologie | Rôle | Avantages | Coût | Alternative |
| --- | --- | --- | --- | --- |
|   |   |   |   | gratuite |
| Vercel | Hébergement frontend | CI/CD intégré, CDN global | Free tier (projets | Netlify, |
|   |   |   | perso) | Cloudflare |
|   |   |   |   | Pages |
| Render | Hébergement backend / | Déploiement Docker simple, | Free tier (avec mise | Railway, Fly.io |
|   | workers | logs intégrés | en veille) |   |
| Railway | Hébergement backend | Interface simple, bon pour | Crédit gratuit | Render |
|   | alternatif | prototypage rapide | mensuel limité |   |
| Supabase | PostgreSQL managé + auth | Interface d'administration, | Free tier généreux | Neon |
|   | optionnelle | backups automatiques |   | (Postgres |
|   |   |   |   | serverless) |
| GitHub Actions | Intégration continue (CI/CD) | Tests et déploiements | Gratuit (repos | GitLab CI |
|   |   | automatisés | publics/limite privés) |   |

## 5.5 — Synthèse budgétaire du MVP

## Coût d'exploitation estimé pendant la phase de stage

En combinant les paliers gratuits de Vercel, Render/Railway, Supabase, Upstash et les API IA à quota gratuit (Gemini, OpenRouter), le coût direct d'infrastructure du MVP peut être maintenu à 0 \$ par mois pour un usage de démonstration et de développement. Un budget de précaution de 10 à 20 \$/mois est néanmoins recommandé pour couvrir un éventuel dépassement de quota d'API IA lors de démonstrations intensives ou de tests de charge.

## 06 Méthodologie et déroulement du projet

## 6.1 — Méthodologie retenue

Le projet adopte une méthodologie Agile / Kanban simplifiée, plus adaptée qu'un Scrum formel à un stage individuel de courte durée. Le travail est organisé en cycles hebdomadaires avec des objectifs clairs (correspondant aux trois semaines du plan de développement), un tableau Kanban (À faire / En cours / Terminé) pour visualiser l'avancement, et une revue de fin de semaine permettant d'ajuster les priorités.

## 6.2 — Organisation du travail

- Outil de suivi : tableau Kanban sur GitHub Projects ou Trello, avec étiquettes par composant (frontend, backend, IA, déploiement).

- Granularité des tâches : découpage en tickets atomiques (1 tâche = 2 à 6 heures de travail estimé) pour garder une vision claire de la progression quotidienne.

- Points de synchronisation : point d'avancement quotidien auto-rédigé (mini rapport journalier) et bilan hebdomadaire partagé avec l'encadrant de stage.

- Documentation continue : mise à jour du README et du journal de développement au fil de l'eau, plutôt qu'en fin de projet.

## 6.3 — Gestion des versions


Le code est versionné avec Git et hébergé sur GitHub, selon un modèle de branches simplifié adapté au solo-développement : une branche main toujours stable et déployable, des branches de fonctionnalité (feature/workflow-builder, feature/ai-summary, etc.) fusionnées via des pull requests auto-revues, et des tags de version (v0.1, v0.2...) à chaque jalon important.

## 6.4 — Workflow de développement

- Développement local avec environnements isolés (Docker Compose pour Redis/PostgreSQL en local).

- Intégration continue via GitHub Actions : exécution automatique des tests à chaque push.

- Déploiement continu : chaque merge sur main déclenche un déploiement automatique sur Vercel (frontend) et Render/Railway (backend).

- Revue de code systématique avant fusion, même en solo, via une checklist de qualité (lisibilité, gestion d'erreurs, tests).

## 6.5 — Tests et validation

| Type de test | Outil recommandé | Objectif |
| --- | --- | --- |
| Tests unitaires backend | pytest | Valider la logique métier isolée (parsing de |
|   |   | workflow, règles conditionnelles) |
| Tests d'intégration API | pytest + httpx | Vérifier les routes FastAPI de bout en bout |
| Tests frontend | Vitest / React Testing Library | Valider les composants critiques (canevas, |
|   |   | formulaires) |
| Tests manuels de | Scénarios de démonstration | Valider les cas d'usage réels avant la soutenance |
| workflows | prédéfinis |   |
| Tests de charge légers | Locust (optionnel) | Vérifier la stabilité sous exécutions simultanées |

## 6.6 — Roadmap détaillée du projet

| Semaine | Jours | Activités clés |
| --- | --- | --- |
| Semaine 1 | J1–J2 | Initialisation des dépôts, configuration FastAPI + PostgreSQL, modèle de |
|   |   | données utilisateur |
|   | J3–J4 | Authentification (JWT), structure du projet Next.js, intégration TailwindCSS |
|   | J5–J7 | Dashboard initial, API CRUD des workflows (sans exécution), déploiement |
|   |   | continu |
| Semaine 2 | J8–J10 | Intégration React Flow, création et sauvegarde de nœuds, modélisation du |
|   |   | graphe |
|   | J11–J12 | Intégration Celery + Redis, premier moteur d'exécution séquentiel |
|   | J13–J14 | Intégration IA : résumé automatique et extraction de tâches |
|   |   | (Gemini/OpenRouter) |
| Semaine 3 | J15–J17 | Notifications, gestion des erreurs et retries, historique des exécutions |
|   | J18–J19 | Finalisation UI, tests de bout en bout, correction de bugs |


| Semaine | Jours | Activités clés |
| --- | --- | --- |
|   | J20–J21 | Déploiement final, rédaction de la documentation, préparation de la |
|   |   | démonstration |

## 07 Plan de réalisation du MVP

## 7.1 — Fonctionnalités prioritaires (must-have)

| Fonctionnalité | Justification de la priorité |
| --- | --- |
| Authentification utilisateur | Prérequis de sécurité et de personnalisation, base de toute la plateforme |
| Workflow Builder (création + sauvegarde) | Cœur fonctionnel du produit, sans lequel la démonstration n'a pas de sens |
| Exécution asynchrone d'un workflow | Prouve la faisabilité technique de l'orchestration |
| simple |   |
| Résumé automatique par IA | Cas d'usage le plus démonstratif et le plus facile à expliquer à un jury |
| Extraction automatique de tâches | Complète le pipeline « voix/texte action » de bout en bout |
| Historique des exécutions | Nécessaire pour démontrer la traçabilité et la fiabilité du moteur |

## 7.2 — Fonctionnalités secondaires (nice-to-have)

- Classification intelligente de contenu par catégories personnalisées.

- OCR de documents (factures, reçus) avec extraction de montants et dates.

- Intégrations externes (Trello, e-mail, Telegram) au-delà du webhook générique.

- Notifications intelligentes conditionnelles (mots-clés « urgent », « paiement »).

- Modèles de workflows prêts à l'emploi (templates) pour accélérer la prise en main.

- Tableau de bord analytique (temps gagné estimé, taux de succès par workflow).

La distinction entre fonctionnalités prioritaires et secondaires permet de garantir un MVP livrable même en cas d'imprévu technique : les fonctionnalités « nice-to-have » sont conçues comme des extensions indépendantes, activables une fois le socle « must-have » stabilisé.

## 7.3 — Étapes de développement et dépendances techniques

| Étape | Dépend de | Livrable associé |
| --- | --- | --- |
| 1. Modèle de données + Auth | Aucune (point de départ) | API d'authentification fonctionnelle |
| 2. CRUD Workflows (sans | Étape 1 | Sauvegarde/chargement de |
| exécution) |   | graphes JSON |
| 3. Canevas visuel (React Flow) | Étape 2 (format de données défini) | Interface de création de workflow |
| 4. Moteur d'exécution (Celery) | Étape 2 | Exécution séquentielle d'un |
|   |   | workflow simple |
| 5. Intégration IA (résumé, extraction) Étape 4 |   | Nœuds IA fonctionnels dans le |
|   |   | moteur |


| Étape | Dépend de | Livrable associé |
| --- | --- | --- |
| 6. Historique + notifications | Étape 4 | Traçabilité complète des exécutions |
| 7. Déploiement + documentation | Toutes les étapes précédentes | Plateforme accessible en ligne |

## 7.4 — Délais estimés et livrables par jalon

| Jalon | Échéance | Livrables attendus |
| --- | --- | --- |
| M1 — Infrastructure prête | Fin semaine 1 | API fonctionnelle, système utilisateur, structure de projet |
| M2 — Moteur opérationnel | Fin semaine 2 | Workflow builder utilisable, résumé IA, extraction de tâches |
| M3 — MVP finalisé | Fin semaine 3 | MVP complet déployé, démo vidéo, documentation GitHub |

## 08 Présentation de la démonstration (Demo)

La démonstration constitue le moment central de la soutenance : elle doit convaincre en moins de dix minutes que le projet fonctionne réellement, qu'il résout un problème concret, et que les choix techniques sont maîtrisés. Le scénario ci-dessous est conçu pour enchaîner les preuves de valeur sans temps mort.

## 8.1 — Durée idéale et structure du pitch oral

| Séquence | Durée | Contenu |
| --- | --- | --- |
| Introduction et contexte | 1 min 30 | Problème adressé, positionnement par rapport à Zapier/Make |
| Démonstration live | 5 à 6 min | Scénario de bout en bout (voir 8.2) |
| Explication technique | 2 min | Architecture, choix technologiques, difficultés surmontées |
| Perspectives et conclusion | 1 min | Évolutions envisagées, valeur du stage |
| Questions du jury | 5 à 10 min | Voir section 8.7 |

## 8.2 — Scénario complet de démonstration

- Étape 1 — Connexion : authentification sur la plateforme, présentation rapide du tableau de bord (workflows existants, historique).

- Étape 2 — Création d'un workflow : construction en direct d'un scénario « Note vocale Transcription Résumé Extraction de tâches Notification » sur le canevas drag-and-drop, en insistant sur la simplicité de connexion des blocs.

- Étape 3 — Déclenchement : envoi d'une note vocale de test (préparée à l'avance pour garantir la fiabilité de la démo), lancement de l'exécution.

- Étape 4 — Suivi en temps réel : affichage du statut d'exécution (en cours terminé) et du détail de chaque étape dans l'historique.

- Étape 5 — Résultat : présentation du résumé généré et de la liste de tâches extraites, comparée au contenu audio original pour prouver la pertinence.

- Étape 6 — Cas d'usage secondaire (si le temps le permet) : traitement d'un document (facture) via OCR pour illustrer la polyvalence de la plateforme.


## 8.3 — Données de démonstration

Il est recommandé de préparer à l'avance un jeu de données de démonstration maîtrisé : une note vocale de 30 à 60 secondes avec un contenu clairement actionnable (ex. compte-rendu de réunion avec 3 décisions explicites), un exemple de facture scannée pour l'OCR, et un compte utilisateur de démonstration pré-rempli avec un historique d'exécutions passées pour montrer la traçabilité sans dépendre uniquement du direct.

## 8.4 — Architecture visible pendant la présentation

Un schéma d'architecture (voir Figure 1, section 4.1) doit rester affiché ou rapidement accessible pendant la partie technique, afin de pouvoir pointer visuellement quel composant est sollicité à chaque étape du scénario (frontend API moteur asynchrone IA base de données). Cela ancre concrètement les choix d'architecture dans la démonstration plutôt que de les présenter de façon abstraite.

## 8.5 — Métriques et résultats à afficher

- Temps d'exécution du workflow (du déclenchement à la notification finale).

- Taux de succès des exécutions sur l'historique disponible.

- Nombre de tâches extraites automatiquement vs. saisie manuelle équivalente (estimation de gain de temps).

- Statut détaillé de chaque nœud du workflow (succès, erreur, temps par étape).

## 8.6 — Gestion des erreurs et fallback pendant la démo

## Plan de secours recommandé

Toute démonstration live comporte un risque de panne réseau ou de latence d'API. Il est fortement recommandé de préparer une vidéo de démonstration de secours (2-3 minutes, pré-enregistrée) montrant le scénario complet fonctionnel, à utiliser en cas d'incident technique pendant la soutenance. Le système doit également afficher des messages d'erreur explicites (plutôt qu'un écran figé) pour démontrer une gestion des erreurs pensée en amont — un point that les jurys techniques valorisent particulièrement.

## 8.7 — Matériel nécessaire

- Ordinateur portable avec connexion internet stable (+ partage de connexion mobile en secours).

- Plateforme déjà déployée en ligne (éviter une démo en local, plus fragile face au jury).

- Vidéo de démonstration de secours accessible hors ligne.

- Support de présentation synthétique (5 à 8 diapositives) reprenant les schémas clés du rapport.

- Accès au dépôt GitHub pour montrer, si demandé, un extrait de code ou la structure du projet.

## 8.8 — Points techniques importants à expliquer au jury

- Pourquoi une exécution asynchrone (Celery/Redis) plutôt que synchrone : latence des appels IA, résilience aux échecs, scalabilité.

- Comment le graphe de workflow est modélisé et interprété (structure JSON, tri topologique).

- Comment les clés API et données sensibles sont sécurisées (variables d'environnement, JWT).


- Pourquoi le choix d'API IA externes plutôt que de modèles auto-hébergés (coût, absence de GPU, rapidité de mise en œuvre).

## 8.9 — Questions potentielles du jury et réponses suggérées

| Question probable | Élément de réponse suggéré |
| --- | --- |
| Comment gérez-vous la confidentialité des données | Chiffrement en transit (HTTPS), absence de stockage des |
| envoyées aux API IA tierces ? | contenus bruts au-delà du nécessaire, politique de rétention |
|   | alignée sur les conditions d'usage des fournisseurs IA (Gemini, |
|   | OpenRouter). |
| Que se passe-t-il si l'API IA est indisponible ou | Le moteur applique une politique de retry avec backoff |
| dépasse son quota gratuit ? | exponentiel, puis bascule vers un fournisseur alternatif |
|   | (OpenRouter) ou notifie l'utilisateur d'un échec explicite. |
| Le système est-il scalable pour un usage réel à | L'architecture découplée (workers Celery horizontalement |
| plusieurs utilisateurs simultanés ? | scalables, base PostgreSQL managée) permet d'ajouter des |
|   | workers sans modifier le code applicatif. |
| Pourquoi ne pas avoir utilisé directement un outil | L'objectif du stage est de démontrer une maîtrise complète de la |
| existant comme n8n en marque blanche ? | conception d'un système fullstack et IA de bout en bout, ce qu'une |
|   | simple intégration d'outil existant ne permettrait pas. |
| Quelle est la limite actuelle la plus importante du | L'absence de gestion multi-tenant avancée et de tests de charge |
| MVP ? | à grande échelle, explicitement identifiée comme axe |
|   | d'amélioration post-stage (voir section 10). |

## 09 Analyse des risques

La réussite d'un projet de trois semaines dépend autant de la qualité technique que de l'anticipation des risques. Le tableau ci-dessous synthétise les risques identifiés, leur niveau de criticité et les mesures d'atténuation retenues.

| Risque identifié | Catégorie | Criticité | Mesure d'atténuation |
| --- | --- | --- | --- |
| Gestion des workflows | Technique | Élevé | Prototyper le moteur d'exécution dès la semaine 1 sur |
| asynchrones |   |   | un cas trivial avant d'ajouter la complexité IA. |
| Synchronisation | Technique | Moyen | Définir un contrat d'API strict (schémas Pydantic) et |
| frontend/backend (état du |   |   | un format de graphe JSON figé avant le |
| canevas) |   |   | développement UI. |
| Dépassement de quota des | Externe / | Moyen | Mettre en cache les résultats, prévoir un fournisseur |
| API IA gratuites | Opérationnel |   | de secours (OpenRouter) et limiter les appels en |
|   |   |   | environnement de test. |
| Latence ou indisponibilité d'un | Externe | Moyen | Politique de retry avec backoff exponentiel et |
| service tiers |   |   | messages d'erreur explicites côté utilisateur. |
| Contrainte de temps (3 | Opérationnel | Élevé | Priorisation stricte du MVP (section 7.1), |
| semaines) |   |   | fonctionnalités secondaires traitées uniquement si le |
|   |   |   | temps le permet. |
| Optimisation UX du workflow | Produit | Moyen | S'appuyer sur les patterns UX éprouvés de React |
| builder |   |   | Flow plutôt que de réinventer l'interaction graphique. |


| Risque identifié | Catégorie | Criticité | Mesure d'atténuation |
| --- | --- | --- | --- |
| Gestion des états complexes | Technique | Faible | Isoler chaque exécution de workflow par un identifiant |
| (exécutions concurrentes) |   |   | unique et un état persistant en base de données. |
| Dépendance à un unique | Organisationnel | Moyen | Documentation continue du code et des décisions |
| développeur (bus factor) |   |   | techniques, dépôt Git avec historique de commits |
|   |   |   | clair. |
| Sécurité des clés API et | Sécurité | Élevé | Variables d'environnement, jamais de secret en dur |
| données utilisateurs |   |   | dans le code, revue de sécurité avant déploiement |
|   |   |   | public. |

## 9.1 — Synthèse des contraintes majeures

- Contrainte de temps : trois semaines imposent une discipline stricte de priorisation ; tout ajout de périmètre doit être validé contre l'impact sur le MVP.

- Limitation technique sans GPU : le choix d'API IA externes lève cette contrainte, au prix d'une dépendance à des services tiers et à leurs conditions d'usage.

- Dépendances externes : Gemini, OpenRouter, HuggingFace — une indisponibilité prolongée de l'un de ces services doit être anticipée par une architecture multi-fournisseurs.

## 10 Perspectives d'évolution

Au-delà du MVP livré en fin de stage, FlowMind AI dispose d'un potentiel d'évolution significatif, aussi bien technique que commercial. Cette section présente les axes d'amélioration jugés les plus porteurs, replacés dans le contexte d'un marché de l'automatisation IA en croissance annuelle soutenue (CAGR proche de 31 % jusqu'en 2033).

## 10.1 — Améliorations fonctionnelles futures

| Évolution | Description | Horizon |
| --- | --- | --- |
| Multi-agents IA | Orchestration de plusieurs agents spécialisés collaborant sur | Moyen terme |
|   | un même workflow complexe |   |
| Marketplace de workflows | Espace communautaire de partage et de vente de modèles | Moyen terme |
|   | de workflows prêts à l'emploi |   |
| Intégration WhatsApp | Déclencheurs et notifications via WhatsApp Business API, | Court terme |
|   | canal dominant en Afrique |   |
| Support mobile natif | Application mobile (React Native) pour la création et le suivi | Long terme |
|   | de workflows |   |
| Analyse prédictive | Suggestions proactives de workflows basées sur les | Long terme |
|   | habitudes de l'utilisateur |   |
| Automatisation financière | Rapprochement bancaire automatisé, suivi budgétaire | Long terme |
| avancée | intelligent pour PME |   |

## 10.2 — Intégration IA supplémentaire


- Passage à des modèles de raisonnement plus avancés pour les blocs de décision conditionnelle (compréhension de contexte plus fine que la simple détection de mots-clés).

- Ajout de capacités multimodales natives (analyse d'image en plus de l'OCR pur).

- Fine-tuning léger ou prompts spécialisés par secteur (comptabilité, éducation, santé administrative).

- Agents autonomes capables de proposer eux-mêmes des optimisations de workflow existants.

## 10.3 — Automatisation et extensibilité

- Système de plugins permettant à des développeurs tiers d'ajouter de nouveaux blocs.

- API publique documentée pour permettre à d'autres applications de déclencher des workflows FlowMind AI.

- Gestion multi-tenant complète pour un usage en équipe (rôles, permissions, espaces partagés).

- Observabilité avancée (métriques exportables, tableaux de bord temps réel façon Grafana).

## 10.4 — Potentiel de déploiement réel et mise sur le marché

Le marché mondial de l'automatisation par IA, estimé à 169,5 milliards de dollars en 2026 et en croissance annuelle de plus de 31 %, offre un contexte macroéconomique très favorable à une suite entrepreneuriale de ce projet. À l'échelle africaine, la reprise du financement technologique (4,1 milliards de dollars levés en 2025, en hausse de 25 % sur un an, avec une concentration croissante sur les outils B2B et l'infrastructure logicielle) constitue un signal encourageant pour une solution pensée dès l'origine pour ce marché. Une transformation du MVP en produit commercialisable nécessiterait néanmoins un travail conséquent de durcissement (sécurité, conformité RGPD/protection des données, tests de charge, support client) avant tout lancement public.

## 11 Recommandations finales

## 11.1 — Priorités techniques

- Stabiliser en premier le triptyque Auth CRUD Workflow Exécution asynchrone simple avant d'ajouter la moindre fonctionnalité IA : c'est le squelette sans lequel rien d'autre ne peut être démontré.

- Fixer le format de données du graphe de workflow (JSON) très tôt et ne plus le modifier en cours de route, pour éviter une désynchronisation coûteuse entre frontend et backend.

- Déployer en continu dès la première semaine, plutôt qu'en fin de projet, pour détecter tôt les problèmes liés à l'environnement de production.

## 11.2 — Meilleures décisions technologiques

- Conserver une stack majoritairement gratuite ou open source (Next.js, FastAPI, PostgreSQL, Celery/Redis) : elle élimine tout risque budgétaire et reste pertinente au-delà du stage.

- Privilégier des API IA à quota gratuit avec option de bascule (Gemini + OpenRouter) plutôt qu'un fournisseur unique, pour la résilience de la démonstration.

- Éviter l'auto-hébergement de modèles d'IA lourds : le gain de contrôle ne compense pas la complexité d'infrastructure pour un projet de trois semaines.

## 11.3 — Bonnes pratiques recommandées

- Documenter chaque décision d'architecture au fil de l'eau (fichier ARCHITECTURE.md) pour faciliter la rédaction du rapport final et la préparation de la soutenance.


- Écrire des tests dès qu'une fonctionnalité critique est stabilisée, pas uniquement en fin de projet.

- Garder une branche main toujours démontrable, quitte à retarder l'intégration d'une fonctionnalité secondaire non finalisée.

- Préparer la démonstration (données de test, vidéo de secours) au moins deux jours avant la soutenance, jamais la veille.

## 11.4 — Points critiques à surveiller

- Consommation des quotas gratuits des API IA pendant les phases de test intensif.

- Temps de mise en veille des instances gratuites (Render) pouvant introduire une latence lors du premier appel après inactivité — à anticiper avant la démonstration en direct.

- Complexité croissante du canevas visuel à mesure que le nombre de types de nœuds augmente.

- Dérive de périmètre (« feature creep ») au détriment du respect du délai de trois semaines.

## 11.5 — Facteurs clés de réussite

## Synthèse

La réussite de FlowMind AI repose sur trois piliers : (1) un socle technique volontairement simple et éprouvé plutôt qu'expérimental, (2) une priorisation stricte du périmètre fonctionnel autour d'un unique parcours de démonstration maîtrisé de bout en bout, et (3) une intégration IA pensée comme différenciateur central plutôt que comme fonctionnalité accessoire. Le respect de ces trois principes garantit un livrable crédible, démontrable et directement valorisable dans un portfolio professionnel.

## 12 Conclusion

FlowMind AI incarne une réponse technique et stratégique cohérente à un besoin réel : rendre l'automatisation intelligente accessible à des utilisateurs qui, aujourd'hui, en sont exclus par le coût ou la complexité des solutions dominantes. Le projet démontre qu'il est possible, dans un délai de trois semaines et avec un budget d'infrastructure quasi nul, de concevoir une plateforme fullstack moderne intégrant nativement l'intelligence artificielle générative — depuis la transcription vocale jusqu'à la prise de décision conditionnelle automatisée.

Sur le plan pédagogique et professionnel, ce stage permet de mobiliser et de démontrer un ensemble de compétences directement alignées avec les attentes du marché de l'emploi tech en 2026 : architecture asynchrone, intégration d'API d'IA, conception d'interfaces visuelles complexes, et rigueur méthodologique dans la gestion d'un projet à délai contraint. Sur le plan stratégique, le contexte de marché — croissance mondiale soutenue de l'automatisation IA et reprise confirmée du financement technologique africain — confère au projet un potentiel de poursuite qui dépasse largement le cadre du stage initial.

FlowMind AI constitue ainsi à la fois une pièce de portfolio à forte valeur ajoutée, une preuve de compétence technique complète, et un socle réaliste pour une éventuelle suite entrepreneuriale sous forme de produit SaaS commercialisable.

## 13 Annexes

## Annexe A — Glossaire technique


| Terme | Définition |
| --- | --- |
| MVP | Minimum Viable Product — version minimale d'un produit permettant de valider |
|   | ses hypothèses clés |
| Workflow | Enchaînement automatisé d'étapes déclenchées par un événement initial |
| Webhook | Mécanisme permettant à une application d'envoyer des données en temps réel |
|   | vers une autre via une URL |
| OCR | Optical Character Recognition — reconnaissance optique de caractères depuis |
|   | une image ou un PDF |
| JWT | JSON Web Token — format de jeton utilisé pour l'authentification sécurisée entre |
|   | client et serveur |
| Broker de messages | Système intermédiaire (ex. Redis) qui met en file d'attente les tâches à exécuter |
|   | de façon asynchrone |
| CAGR | Compound Annual Growth Rate — taux de croissance annuel composé, |
|   | indicateur standard en analyse de marché |
| SaaS | Software as a Service — logiciel accessible en ligne par abonnement, sans |
|   | installation locale |

## Annexe B — Sources et références de marché

- Grand View Research — AI Automation Market Size And Share Report, 2026 : estimation du marché mondial de l'automatisation IA à 169,5 milliards de dollars en 2026, avec un CAGR de 31,4 % jusqu'en 2033.

- MarketsandMarkets — AI Automation Market, avril 2026 : perspectives sectorielles par domaine fonctionnel (finance, opérations, marketing).

- Disrupt Africa — 11■ édition du rapport annuel de financement des start-up technologiques africaines, 2026 : 1,64 milliard de dollars levés par 178 start-up en 2025 (+46,2 % vs 2024).

- Partech Partners — 2025 Africa Tech Venture Capital Report : financement total (dette + capital) de 4,1 milliards de dollars en 2025 pour l'écosystème tech africain (+25 % vs 2024).

- Comparatifs indépendants de tarification Zapier / Make (2026) : pages tarifaires officielles et analyses de coûts réels par cas d'usage.

## Annexe C — Structure de dépôt GitHub recommandée

```
flowmind-ai/
frontend/ # Next.js + React Flow + Tailwind
backend/ # FastAPI + Celery + modèles Pydantic
worker/ # Configuration des tâches Celery
docs/ # ARCHITECTURE.md, guide d'installation
docker-compose.yml # Environnement local (Redis, PostgreSQL)
.github/workflows/ # CI/CD (tests, déploiement)
README.md
```

## Annexe D — Checklist de préparation à la soutenance

- Plateforme déployée et accessible en ligne, testée la veille de la soutenance.


- Vidéo de démonstration de secours enregistrée et accessible hors ligne.

- Jeu de données de démonstration préparé (note vocale, document pour OCR).

- Support de présentation (5 à 8 diapositives) synchronisé avec le présent rapport.

- Dépôt GitHub à jour avec README, documentation d'architecture et historique de commits propre.

- Réponses préparées aux questions techniques anticipées (section 8.9).
