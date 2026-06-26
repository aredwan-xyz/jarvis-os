# JARVIS Mission Control

This repo contains three things:

- `jarvis-blueprint.html`: the original long-form architecture blueprint.
- `index.html` plus `src/`: an interactive Mission Control product prototype.
- `backend/`: a lightweight local API and core routing package for agents, workflows, approvals, memory, audit, integrations, and costs.

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://localhost:4173
```

The local server exposes both the app and API endpoints:

- `POST /api/route`
- `GET /api/agents`
- `GET /api/workflows`
- `GET /api/approvals`
- `GET /api/audit`
- `GET /api/memory/search?q=finance`
- `GET /api/integrations`
- `GET /api/costs`

## Validate

```bash
npm run validate
npm run test:core
```

The validation script checks that the product UI mount points exist, the local API server is wired into the dev command, and the agent catalog stays aligned with the expected 18-agent blueprint.

## Project Direction

The current implementation is intentionally dependency-free so the first version can run anywhere. The next milestone is to replace the lightweight API with a production stack:

- Frontend: React + TypeScript Mission Control dashboard.
- Backend: FastAPI orchestrator API.
- Storage: Postgres/Supabase schema for agents, memories, workflows, integrations, and audit logs.
- Queue: Redis-backed jobs for scheduled and event-driven workflows.
- Automation: n8n workflows for external integrations.
