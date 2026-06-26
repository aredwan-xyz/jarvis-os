# JARVIS Core Backend

This folder is the first implementation spine for the JARVIS operating system.

It is dependency-free for now so the routing and catalog logic can be tested immediately. The intended production backend is FastAPI, but the first useful boundary is the domain model:

- agent catalog
- workflow catalog
- intent routing
- action safety gates
- audit-friendly route decisions
- local demo API endpoints
- memory, approval, integration, cost, and audit demo data

## Run Local API

```bash
PYTHONPATH=backend python3 backend/server.py
```

Then open:

```text
http://localhost:4173
```

## Run Core Tests

```bash
python3 -m unittest discover backend/tests
```

## Next Backend Milestone

Replace the lightweight standard-library surface with FastAPI endpoints:

- `POST /route`
- `GET /agents`
- `GET /workflows`
- `POST /memory/search`
- `POST /audit/events`
- `POST /confirmations`
