# JARVIS v2 — Product Requirements Document

**Product:** JARVIS — a real-life, always-on personal AI chief-of-staff
**Owner:** Abid Redwan
**Status:** Draft v1.0 — 2026-07-05
**Predecessor:** [JARVIS Mission Control v1](../README.md) (live demo, keyword router, demo data)

---

## 0. One-line vision

> An always-on AI that knows my whole life, watches my inboxes, calendar, projects,
> money, and health, acts on my behalf within guardrails I set, speaks and listens
> like Tony Stark's JARVIS — and asks permission before doing anything irreversible.

v1 proved the shape: 18 agents, workflows, an approval gate, memory, audit, and a
Mission Control UI. Everything behind it was demo data and a keyword router.
**v2 makes it real.**

---

## 1. Problem Statement

Abid runs 39 projects, a job-search sprint, multiple product businesses, and a
personal life across two continents — coordinated today by his own attention, which
is the scarcest resource he has. Context lives scattered across Gmail, Calendar,
Notion, GitHub, projectctl, and his head; nothing watches it continuously, nothing
connects it, and nothing acts on it while he sleeps. The cost of not solving this is
the exact failure mode he's already named: **he starts faster than he ships**,
because attention leaks into triage, context-switching, and remembering instead of
finishing.

Existing tools don't solve it: chat assistants are stateless and reactive; automation
tools (n8n, Zapier) have no judgment; single-purpose agents don't share memory. The
gap is a persistent, proactive orchestrator with unified memory and a human approval
gate — a system, not a chatbot.

## 2. Goals

| # | Goal | Measure |
|---|------|---------|
| G1 | **Real orchestration** — natural-language commands route to the right agent via LLM tool-calling, and the agent actually executes (not demo data) | ≥90% routing accuracy on a 100-command eval set; ≥5 agents doing real work |
| G2 | **Proactive, not just reactive** — JARVIS initiates: morning briefing, inbox triage, deadline alerts, project drift warnings | ≥3 scheduled/event-driven automations running daily without intervention for 14 consecutive days |
| G3 | **Persistent memory** — remembers facts, preferences, decisions, and episode history across sessions; retrieval is semantic, not keyword | Memory hit-rate ≥80% on "what do you know about X" evals; zero re-asking of previously stated preferences in a 1-week test |
| G4 | **Trustworthy autonomy** — every risky action stops at the approval gate; every action is audited; spend is capped | 0 irreversible actions without approval, ever (hard invariant); full audit trail; monthly LLM spend ≤ configured cap |
| G5 | **Shipped, live, daily-driven** — a live URL Abid uses as his actual daily driver, replacing at least morning email triage and daily planning | Live deployment used ≥5 days/week for 30 days; "done = a stranger-usable URL," per the house rule |

User goal: get hours of attention back per week. Business goal: this becomes the
flagship portfolio piece proving Abid builds production AI systems (senior-role /
client credibility).

## 3. Non-Goals (v2)

1. **Physical-world control (robotics, smart-home actuation).** The Iron Man fantasy
   includes servos; v2 does not. Home/IoT stays read-only status at most — actuation
   is a separate risk domain and Abid's smart-building expertise deserves its own
   project later (P2 hook only).
2. **Multi-user / SaaS productization.** v2 is single-tenant, for Abid. Making it a
   product before it runs one person's life reliably is premature. Architecture stays
   single-user-simple (one auth identity, no org model).
3. **A custom wake-word DSP stack or holographic UI.** Voice ships via proven
   components (see P1); we don't build speech infrastructure from scratch. No 3D/AR
   interface — the Mission Control web UI + Telegram + voice is the surface.
4. **Fine-tuning or self-hosted LLMs.** Frontier hosted models (Claude) with good
   context engineering beat a fine-tune at this scale. Revisit only if cost caps are
   hit consistently.
5. **All 18 agents fully live at launch.** All 18 stay in the catalog and routable,
   but only the P0 five get real integrations in Phase 1–2. Shipping 18 shallow
   agents is worse than 5 deep ones.

## 4. Users & Personas

Single primary user, three modes of use:

- **Abid the operator** — daily driver: briefings, triage, commands, approvals.
- **Abid the builder** — extends JARVIS: adds agents, tools, automations; needs clean
  extension points and observability.
- **The stranger with the URL** — a recruiter, client, or peer visiting the live
  demo: sees a real system (safe demo mode with sandboxed data), not a mock.

## 5. User Stories

**Command & orchestration (operator)**
- As the operator, I want to type or say "what's my day look like and what's the one thing I must ship" and get a synthesized answer drawing on calendar, projectctl, and memory, so that planning takes 30 seconds instead of 20 minutes.
- As the operator, I want any natural-language request routed to the right specialist agent with visible reasoning ("routing to `finance` because…"), so that I trust and can correct the routing.
- As the operator, I want a request the router can't confidently place to fall back to a clarifying question rather than a wrong guess, so that misfires don't compound.

**Proactive automation (operator)**
- As the operator, I want a morning briefing at 7:30 AM (calendar, urgent email, project status, today's commitment, prayer times) delivered to Telegram, so that the day starts oriented without opening six apps.
- As the operator, I want inbox triage that labels/summarizes overnight email and surfaces only the ≤5 that need me, so that email checks drop to twice a day.
- As the operator, I want JARVIS to notice drift — a flagship project with no commits in 5 days, an unanswered important email at 48h — and nudge me, so that the "starts faster than ships" failure mode has a watchdog.

**Memory (operator)**
- As the operator, I want to say "remember that X" and have it durably stored and semantically retrievable later, so that JARVIS never re-asks what I've told it.
- As the operator, I want JARVIS to cite which memory it used when answering ("based on your note from June 12…"), so that stale memory is visible and correctable.
- As the operator, I want to view, edit, and delete any memory from Mission Control, so that memory stays mine.

**Trust & control (operator)**
- As the operator, I want every action classified (read / write-reversible / write-irreversible) with irreversible ones held at the approval gate (Telegram inline approve/reject + dashboard), so that JARVIS can be aggressive safely.
- As the operator, I want a real-time audit log of every agent action, tool call, token count, and cost, so that I can reconstruct anything JARVIS did.
- As the operator, I want a monthly cost cap that degrades gracefully (cheaper model → read-only → pause) instead of a surprise bill.
- As the operator, I want a big red pause switch that halts all automations instantly.

**Builder**
- As the builder, I want to add a new agent by writing one config/module (prompt, tools, permissions) without touching the orchestrator, so that extension is an evening, not a refactor.
- As the builder, I want eval sets for routing and memory that run in CI, so that regressions are caught before deploy.

**Stranger with the URL**
- As a visitor, I want to try commands against a sandboxed demo profile with fake data on the live URL, so that I experience the real orchestrator without touching Abid's life.

**Edge cases**
- As the operator, when an integration is down (Gmail token expired), I want the affected agent to report degraded status and the rest of the system to keep working.
- As the operator, when I reject an approval, I want the agent to log the rejection and stand down — never retry the same action autonomously.
- As the operator, when two automations conflict (both want to send a message), I want serialized execution with an idempotency check, so nothing sends twice.

## 6. Requirements

### P0 — Must-Have (v2 cannot ship without these)

**R1. LLM Orchestrator (replaces keyword router)**
Claude tool-calling router: intent → agent selection → parameterized dispatch → synthesized response. Streaming. Confidence threshold with clarifying-question fallback.
- [ ] Given "summarize what MapleHire needs this week," when submitted, then the router selects the correct agent, the response cites real project data, and the routing decision (+ confidence) is visible.
- [ ] Given an ambiguous command, when confidence < threshold, then JARVIS asks one clarifying question instead of dispatching.
- [ ] Routing eval set (≥100 labeled commands) runs in CI; accuracy ≥90%.

**R2. Agent runtime with typed tool layer**
Agent = system prompt + toolset + permission scope, defined declaratively. The 18-agent catalog from v1 carries over; 5 agents fully live: `comms` (email), `time` (calendar), `dev` (GitHub/projectctl), `ops` (automations/system), `intelligence` (research/synthesis).
- [ ] Adding a new agent requires only a new agent definition file — no orchestrator changes.
- [ ] Each tool declares its risk class (read / reversible / irreversible); the runtime enforces scope — an agent cannot call a tool outside its declared set.

**R3. Real integrations (OAuth): Gmail, Google Calendar, GitHub, Telegram**
Gmail read+draft (send = irreversible ⇒ gated). Calendar read+create. GitHub read (repos, commits, issues). Telegram as the primary push channel and remote command surface.
- [ ] Given a revoked/expired token, then the integration shows "degraded" in Mission Control and other agents keep working.
- [ ] Telegram: receives briefings, sends commands to the orchestrator, and renders approval requests with inline approve/reject buttons.

**R4. Memory system (Postgres + pgvector)**
Four layers per blueprint: profile facts, episodic (interaction summaries), semantic (embedded retrievable), working (session). Explicit write policy: what gets remembered, when, with provenance timestamps.
- [ ] "Remember that…" writes a fact retrievable by meaning (not keyword) in later sessions.
- [ ] Answers grounded in memory cite the source memory + date.
- [ ] Mission Control has a memory browser with edit/delete.

**R5. Approval gate + audit log + kill switch (hard invariants)**
Every irreversible action (send email, spend money, delete, post publicly) creates a pending approval; nothing executes without explicit human approval. Append-only audit of every action/tool call/cost. Global pause halts all schedulers and dispatch.
- [ ] Negative test in CI: an agent attempting an irreversible tool call without approval is blocked and logged — this test can never be removed or skipped.
- [ ] Rejected approval ⇒ agent stands down; no autonomous retry of the same action.
- [ ] Kill switch takes effect ≤5 seconds; state survives restart.

**R6. Automation engine (3 launch automations)**
Scheduler (cron) + event triggers with retries, idempotency keys, and dead-letter visibility. Launch set: **morning briefing** (7:30 AM → Telegram), **inbox triage** (3×/day), **end-of-day digest** (what shipped, what drifted, tomorrow's one thing).
- [ ] Each automation runs 14 consecutive days unattended; failures land in a dead-letter view with one-click retry, never silently vanish.

**R7. Cost governance**
Per-request token/cost tracking (already a v1 panel — make it real). Monthly cap with graceful degradation: cheaper model → read-only mode → pause + notify.
- [ ] Costs dashboard shows real spend per agent/automation/day; cap breach triggers degradation, not surprise billing.

**R8. Deployed, authenticated, live**
FastAPI backend + Mission Control UI deployed to a real URL. Single-user auth (passkey or OAuth). Secrets in a proper secret store. Public demo mode with sandboxed fake profile.
- [ ] A stranger can open the URL, use demo mode, and see real orchestration. Abid can log in and run his real life. **This is the "done" bar.**

### P1 — Nice-to-Have (fast follows)

- **Voice I/O**: push-to-talk in Mission Control + Telegram voice notes (Whisper STT, streaming TTS). JARVIS persona voice. *Not* an always-on wake word yet.
- **Notion + projectctl deep integration**: JARVIS reads/updates the Mission Control dashboard (`DASHBOARD.md`), project states, and shipping streak — becomes the coach's data source.
- **Watchdog automations**: project-drift detection (no commits on flagship in N days), unanswered-important-email detection, calendar-conflict detection.
- **Finance agent live**: transaction ingest (manual CSV or Plaid-equivalent), subscription audit, monthly snapshot. All money movement remains approval-gated (irreversible class).
- **Proactive research briefs**: `intelligence` agent runs scheduled deep-research on named topics (job market, competitors) and files cited briefs.
- **Multi-model routing**: cheap model for triage/classification, frontier for synthesis — driven by the cost governor.

### P2 — Future Considerations (design for, don't build)

- **Always-on wake word + ambient device** (Pi/Jetson satellite speaker-mic). Keep the API transport-agnostic so a voice satellite is just another client.
- **Smart-home/IoT actuation** — Abid's smart-building domain; design the risk-class system so `physical` slots in as a new irreversible class.
- **Multi-user tenancy / productization** — keep user_id on every table even though v2 has one user.
- **Agent-to-agent workflows** (agent A commissions agent B) — the dispatch layer should not assume human-originated requests only.
- **Local model fallback** for privacy-sensitive classes of data.

## 7. Technical Architecture (decision summary)

Per the blueprint's "Definitive Stack," updated:

| Layer | Choice | Note |
|---|---|---|
| Orchestrator + agents | Python, **Claude tool-calling** (`claude-fable-5` synth / cheaper tier for triage) | Structured outputs for routing |
| API | **FastAPI**, typed, authenticated | Replaces stdlib server |
| Memory/DB | **Postgres + pgvector** | 4-layer memory schema |
| Queue/scheduler | **Redis + worker** (or Postgres-backed queue to cut a dependency) | Retries, idempotency, DLQ |
| Push/remote | **Telegram bot** | Briefings, commands, approvals |
| UI | v1 Mission Control, upgraded to live data | Keep the [design system](../jarvis-blueprint.html): DM Sans / Playfair Display / DM Mono, lime `#d4ff3a` on `#0a0a0a` |
| Deploy | Single VPS or Fly/Railway + managed Postgres | One `docker compose up` locally |
| Observability | Structured logs + audit table + cost dashboard | Traces per request-chain |

Security non-negotiables (from blueprint): least-privilege OAuth scopes, secrets never
in repo, approval gate as code-level invariant (not prompt-level), append-only audit,
red-team prompt suite (prompt-injection via email content is the #1 threat — email
bodies are untrusted input and must never be executed as instructions).

## 8. Success Metrics

**Leading (first 30 days)**
- Routing accuracy ≥90% on eval set (CI-tracked).
- ≥3 automations at ≥95% on-time completion over 14 days.
- Daily active use ≥5 days/week (real commands, not tests).
- Memory retrieval hit-rate ≥80% on the memory eval set.
- Approval-gate violations: **0** (hard invariant, not a target).

**Lagging (60–90 days)**
- Morning routine time: ~20 min of app-checking → <5 min briefing review.
- Email opens: from constant to ≤2 deliberate sessions/day.
- Shipping streak on flagship projects improves (JARVIS watchdog credited in ≥3 evening check-ins).
- Monthly cost ≤ cap (target ≤ $75/mo LLM + infra ≈ blueprint estimate).
- Portfolio impact: JARVIS live URL cited in job applications/client pitches.

## 9. Open Questions

| # | Question | Owner | Blocking? |
|---|---|---|---|
| Q1 | Deploy target: VPS (full control, more ops) vs Fly/Railway (faster, less control)? | Abid (infra) | Blocks R8 only — decide by end of Phase 1 |
| Q2 | Queue: Redis worker vs Postgres-backed (one fewer service)? | Abid (eng) | Blocks R6 — decide during Phase 2 |
| Q3 | Gmail API vs IMAP+SMTP for the comms agent (OAuth app verification friction)? | Abid (eng) | Blocks R3 — spike in week 3, timebox 2 days |
| Q4 | Does demo mode need rate-limiting/abuse protection at launch, or link-only obscurity first? | Abid (security) | Non-blocking — before public promotion |
| Q5 | Telegram vs WhatsApp as push channel (WhatsApp = where life happens; Telegram = far better bot API)? | Abid (product) | Non-blocking — Telegram default, revisit P1 |
| Q6 | v1 repo: keep serving as static demo during v2 build, or redirect once v2 is live? | Abid (product) | Non-blocking |

## 10. Phasing & Timeline

Blueprint says 12 weeks; compressed to shippable increments — **each phase ends at a
deployed URL**, honoring the house rule (done = live, not local).

**Phase 1 — The Real Brain (weeks 1–3) → SHIP**
FastAPI core, LLM orchestrator, agent runtime, Postgres+pgvector memory, auth, deploy.
Mission Control talks to the real API. Demo mode live.
*Exit: live URL where routing + memory are real; agents may still answer from limited tools.*

**Phase 2 — Hands (weeks 4–6) → SHIP**
Gmail, Calendar, GitHub, Telegram OAuth integrations; approval gate wired end-to-end
(Telegram inline approvals); audit + cost tracking live; 5 P0 agents doing real work.
*Exit: "draft a reply to the recruiter email" works, gated, audited, from the live URL.*

**Phase 3 — Autonomy (weeks 7–9) → SHIP**
Automation engine + 3 launch automations; dead-letter view; kill switch; cost governor;
red-team pass on prompt injection.
*Exit: 14 unattended days of briefings/triage/digest begins; JARVIS is a daily driver.*

**Phase 4 — Presence (weeks 10–12, P1 scope)**
Voice I/O, watchdog automations, Notion/projectctl depth, finance agent, multi-model
routing. Cut freely if Phase 3 stabilization needs the time.

Dependencies: Google OAuth consent screen (start week 3 — verification lag), Telegram
bot creation (trivial), managed Postgres provisioning (Phase 1, week 1).

Hard deadline: none contractual — but the **shipping-streak rule applies: Phase 1 must
produce a deployed URL within 3 weeks**, or scope gets cut until it does.

## 11. Definition of Done (v2)

1. Live authenticated URL, used by Abid ≥5 days/week for 30 days.
2. 5 agents on real integrations; 18 routable.
3. 3 automations, 14 unattended days.
4. Zero approval-gate violations, complete audit trail, cost under cap.
5. A stranger can use demo mode and understand what JARVIS is in 60 seconds.
