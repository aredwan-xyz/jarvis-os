# JARVIS Mission Control

A prototype of a personal AI "operating system" — 18 specialized agents, automated
workflows, an approval gate for risky actions, and a memory/audit layer — wrapped in
an interactive Mission Control dashboard.

**Live demo:** https://aredwan-xyz.github.io/jarvis-os/

> The live site is static (GitHub Pages), so the UI renders fully but the
> backend-powered panels show an "API offline" notice. Run it locally (below) for
> the complete experience, including live routing, memory search, and the API.

## What's in here

| Path | What it is |
| --- | --- |
| `index.html` + `src/landing.*` | Marketing landing page with a live command-routing demo. |
| `mission-control.html` + `src/app.js` | The interactive Mission Control dashboard (agents, workflows, approvals, audit, costs, memory). |
| `jarvis-blueprint.html` | The original long-form architecture blueprint (the vision doc). |
| `backend/` | A dependency-free local API + core routing package (agents, workflows, approvals, memory, audit, integrations, costs). |
| `scripts/validate.js` | Structural checks (mount points, dev wiring, 18-agent catalog). |

## Run locally

```bash
npm run dev
```

Then open http://localhost:4173 — the local server serves both the UI and the API.

### API endpoints

| Method | Endpoint | Returns |
| --- | --- | --- |
| `POST` | `/api/route` | Routes a natural-language message to an agent (keyword router). |
| `GET` | `/api/health` | Service health check. |
| `GET` | `/api/agents` | The 18-agent catalog. |
| `GET` | `/api/workflows` | Scheduled / event-driven workflows. |
| `GET` | `/api/approvals` | Pending human-in-the-loop approvals. |
| `GET` | `/api/audit` | Audit log events. |
| `GET` | `/api/integrations` | Connected integration status. |
| `GET` | `/api/costs` | Cost tracking. |
| `GET` | `/api/memory/search?q=finance` | Searches the memory store. |

## Validate

```bash
npm run validate     # structural checks
npm run test:core    # backend unit tests
```

## Status & direction

This implementation is intentionally **dependency-free** so v1 runs anywhere. It is a
faithful skeleton — the data model and UX are real, but the orchestration is a
keyword router and the integrations, memory, and workflows are demo data, not live
services.

The roadmap toward a production stack:

1. **FastAPI core** — replace the stdlib API with authenticated, typed endpoints.
2. **Real orchestrator** — swap keyword routing for an LLM router (Claude tool-calling).
3. **Memory infrastructure** — Postgres + pgvector, write policies, semantic retrieval.
4. **Real integrations** — Gmail, Calendar, Notion, Stripe, GitHub, Telegram via OAuth.
5. **Automation engine** — Redis queue + n8n dispatch, retries, rate limits, dead-letter monitoring.
6. **Production hardening** — auth, secrets, deployment, cost caps, observability, red-team safety tests.
