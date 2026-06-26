APPROVALS = [
    {
        "id": "apv-1042",
        "agent": "Comms Agent",
        "risk": "medium",
        "action": "Send client follow-up to Northstar Labs",
        "reason": "Deal has been idle for 6 days and proposal review was due yesterday.",
        "destination": "Gmail",
    },
    {
        "id": "apv-1043",
        "agent": "Time & Energy Agent",
        "risk": "high",
        "action": "Move optional sync out of protected deep-work block",
        "reason": "Sleep score is below baseline and the morning block has revenue work scheduled.",
        "destination": "Google Calendar",
    },
    {
        "id": "apv-1044",
        "agent": "Finance Agent",
        "risk": "medium",
        "action": "Create payment reminder draft for overdue invoice",
        "reason": "Invoice is 7 days overdue and cashflow forecast depends on collection this week.",
        "destination": "Gmail + Notion",
    },
]


MEMORIES = [
    {
        "id": "mem-201",
        "type": "semantic",
        "title": "Deep work preference",
        "summary": "Peak focus usually lands before noon; protect mornings for sales, delivery, and strategy.",
        "tags": ["calendar", "energy", "time"],
    },
    {
        "id": "mem-202",
        "type": "episodic",
        "title": "Payment follow-up pattern",
        "summary": "Gentle day-3 reminders work well; firmer day-7 follow-ups recover most late invoices.",
        "tags": ["finance", "comms", "cashflow"],
    },
    {
        "id": "mem-203",
        "type": "procedural",
        "title": "Proposal follow-up SOP",
        "summary": "After sending a proposal, follow up with value recap, decision timeline, and one clear CTA.",
        "tags": ["business", "sales", "proposal"],
    },
    {
        "id": "mem-204",
        "type": "semantic",
        "title": "Values hierarchy",
        "summary": "Health and Islamic obligations are non-negotiable before high-leverage business activities.",
        "tags": ["values", "spiritual", "wellness"],
    },
]


AUDIT_EVENTS = [
    {
        "time": "08:02",
        "agent": "Business Agent",
        "event": "Pipeline review completed",
        "result": "2 deals flagged, 1 follow-up drafted",
    },
    {
        "time": "08:15",
        "agent": "Wellness Agent",
        "event": "Recovery signal evaluated",
        "result": "Suggested lighter workout and calendar protection",
    },
    {
        "time": "09:30",
        "agent": "Comms Agent",
        "event": "Inbox triage run",
        "result": "18 archived, 4 action items, 2 drafts staged",
    },
]


INTEGRATIONS = [
    {"name": "Gmail", "status": "connected", "latency_ms": 184},
    {"name": "Google Calendar", "status": "connected", "latency_ms": 211},
    {"name": "Notion", "status": "connected", "latency_ms": 156},
    {"name": "Stripe", "status": "connected", "latency_ms": 248},
    {"name": "GitHub", "status": "watching", "latency_ms": 198},
    {"name": "Oura", "status": "needs OAuth", "latency_ms": None},
]


COSTS = {
    "daily_budget": 4.00,
    "spent_today": 1.18,
    "model_mix": [
        {"label": "Routing", "model": "Haiku-class", "share": 72},
        {"label": "Execution", "model": "Sonnet-class", "share": 24},
        {"label": "Strategy", "model": "Opus-class", "share": 4},
    ],
}


def search_memories(query: str) -> list[dict[str, object]]:
    normalized = query.lower().strip()
    if not normalized:
        return MEMORIES

    matches = []
    for memory in MEMORIES:
        haystack = " ".join([
            memory["title"],
            memory["summary"],
            " ".join(memory["tags"]),
            memory["type"],
        ]).lower()
        if any(term in haystack for term in normalized.split()):
            matches.append(memory)
    return matches
