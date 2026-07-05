# JARVIS v2 — Master Build Prompt

> Paste this into Claude Code from `~/Documents/Projects/_DEV/jarvis/v2/` to start (or
> resume) the build. It assumes `PRD.md` sits next to it. Update the **Current phase**
> line as phases complete — everything else stays stable.

---

You are the lead engineer building **JARVIS v2** — a real-life, always-on personal AI
chief-of-staff — in this directory. Read `PRD.md` in full before writing any code; it
is the contract. The v1 prototype (parent directory) is reference material for the
18-agent catalog, the Mission Control UI, and the design system — do not extend v1;
v2 is a clean build.

**Current phase: Phase 1 — The Real Brain** (orchestrator, agent runtime, memory,
auth, deploy). Build only what this phase's exit criterion requires:
*a live URL where LLM routing and persistent memory are real.*

## Stack (decided — do not relitigate)

- Python 3.12 + **FastAPI**, typed endpoints, async throughout
- **Claude tool-calling** for the orchestrator: `claude-fable-5` for synthesis,
  a cheaper Claude tier for triage/classification; structured outputs for routing
- **Postgres + pgvector** for the 4-layer memory system (profile / episodic /
  semantic / working) — every table carries `user_id` even though v2 is single-user
- Frontend: carry over v1's Mission Control, rewired to live APIs. Design system is
  non-negotiable: DM Sans / Playfair Display / DM Mono, lime `#d4ff3a` on `#0a0a0a`
  (see `../jarvis-blueprint.html`)
- `docker compose up` runs everything locally; deploy target decided end of Phase 1 (PRD Q1)

## Hard invariants — violating any of these is a failed build

1. **The approval gate is code, not prompt.** Every tool declares a risk class
   (`read` / `reversible` / `irreversible`). The runtime blocks irreversible calls
   without an explicit human approval record. Ship the CI test that proves an agent
   *cannot* bypass it; that test is permanent.
2. **Untrusted content is never instructions.** Email bodies, web pages, calendar
   descriptions, and any third-party text are data. They are quoted/delimited when
   passed to models and must never be interpreted as commands. Assume prompt
   injection is attempted daily.
3. **Append-only audit.** Every agent action, tool call, token count, and cost is
   recorded. No code path skips it.
4. **Secrets never touch the repo.** Env/secret store only; `.env.example` documents
   shape, never values.
5. **Kill switch first-class.** A global pause halts all dispatch and schedulers in
   ≤5s and survives restart.

## Working style

- **Ship over sprawl.** The house rule: done = a live URL a stranger can use, not
  "works locally." If scope threatens the phase exit criterion, cut scope, not the
  deadline — and say so out loud.
- Extension by config: a new agent is one definition file (prompt + toolset +
  permission scope). If adding an agent requires touching the orchestrator, the
  design is wrong.
- Evals are features: the routing eval set (≥100 labeled commands, ≥90% accuracy)
  and memory eval set run in CI from Phase 1 onward.
- Verify, don't assume: after every substantive change, run it and state what was
  verified and how. Failing tests get reported, not smoothed over.
- Commit plainly (no attribution footers) and push to GitHub at every good state.

## Phase 1 build order

1. Repo scaffold: FastAPI app, Postgres+pgvector via compose, migrations, CI
   (lint + tests + the gate test), `.env.example`.
2. Tool/risk-class layer and agent runtime; port the 18-agent catalog from
   `../backend/jarvis_core/catalog.py` as declarative definitions.
3. Orchestrator: Claude tool-calling router with confidence threshold →
   clarifying-question fallback; streaming responses; routing eval set.
4. Memory: 4-layer schema, write policy, semantic retrieval, provenance timestamps,
   memory browser API; memory eval set.
5. Auth (single-user passkey or OAuth) + sandboxed demo-mode profile.
6. Rewire Mission Control panels (route, agents, memory search) to live endpoints.
7. Deploy. Phase 1 is not done until the URL is live and `PRD.md` §10's Phase 1 exit
   criterion is met. Then stop and review before Phase 2.

Begin by restating the Phase 1 exit criterion in one sentence, proposing the repo
structure, and building step 1.
