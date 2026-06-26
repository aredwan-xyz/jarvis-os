from dataclasses import asdict, dataclass
from datetime import datetime, timezone

from .catalog import AGENTS


@dataclass(frozen=True)
class RouteDecision:
    agent_key: str
    agent_name: str
    urgency: int
    action_type: str
    requires_confirmation: bool
    confidence: float
    retrieved_memories: tuple[str, ...]
    next_steps: tuple[str, ...]
    rationale: str

    def to_dict(self) -> dict[str, object]:
        payload = asdict(self)
        payload["created_at"] = datetime.now(timezone.utc).isoformat()
        return payload


ROUTING_KEYWORDS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("finance", ("invoice", "cash", "tax", "stripe", "expense", "payment")),
    ("comms", ("email", "reply", "inbox", "slack", "message")),
    ("time", ("calendar", "meeting", "schedule", "deep work", "reschedule")),
    ("wellness", ("sleep", "hrv", "workout", "recovery", "health")),
    ("business", ("client", "pipeline", "deal", "proposal", "revenue")),
    ("dev", ("github", "build", "deploy", "bug", "pull request", "code")),
    ("spiritual", ("prayer", "ramadan", "fasting", "quran", "jumu")),
    ("outreach", ("lead", "campaign", "smartlead", "clay", "apollo")),
    ("research", ("research", "summarize", "competitor", "market", "trend")),
    ("strategy", ("weekly review", "goal", "vision", "strategy", "reflection")),
)

CONFIRMATION_KEYWORDS = ("send", "delete", "publish", "pay", "reschedule", "archive", "modify", "update")
URGENT_KEYWORDS = ("urgent", "today", "deadline", "overdue", "broken", "failed", "risk", "blocked")
ACTION_KEYWORDS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("execute", ("send", "publish", "pay", "reschedule", "archive", "update", "create")),
    ("analyze", ("analyze", "review", "compare", "think", "decide", "investigate")),
    ("summarize", ("summarize", "brief", "digest", "recap")),
    ("monitor", ("watch", "monitor", "track", "alert", "notify")),
)

MEMORY_HINTS: dict[str, tuple[str, ...]] = {
    "finance": ("cashflow_targets", "tax_rules", "client_payment_history"),
    "comms": ("writing_voice", "vip_contacts", "recent_thread_summaries"),
    "time": ("energy_profile", "deep_work_windows", "calendar_constraints"),
    "wellness": ("sleep_baseline", "recovery_protocol", "training_preferences"),
    "business": ("revenue_targets", "pipeline_health", "client_delivery_sops"),
    "dev": ("active_repos", "deployment_history", "technical_debt_log"),
    "spiritual": ("prayer_preferences", "ramadan_plan", "values_framework"),
    "outreach": ("ideal_customer_profile", "campaign_metrics", "lead_sources"),
    "research": ("preferred_sources", "competitor_watchlist", "market_theses"),
    "strategy": ("one_year_goals", "quarterly_priorities", "weekly_reviews"),
    "decision": ("decision_journal", "personal_values", "risk_tolerance"),
}


def route_intent(message: str) -> RouteDecision:
    normalized = message.lower()
    agents_by_key = {agent.key: agent for agent in AGENTS}

    selected_agent = "decision"
    matched_keyword = ""
    for agent_key, keywords in ROUTING_KEYWORDS:
        matched_keyword = next((keyword for keyword in keywords if keyword in normalized), "")
        if matched_keyword:
            selected_agent = agent_key
            break

    if selected_agent not in agents_by_key:
        selected_agent = "decision"

    action_type = "answer"
    for candidate_type, keywords in ACTION_KEYWORDS:
        if any(keyword in normalized for keyword in keywords):
            action_type = candidate_type
            break

    urgency = 4 if any(keyword in normalized for keyword in URGENT_KEYWORDS) else 2
    requires_confirmation = any(keyword in normalized for keyword in CONFIRMATION_KEYWORDS)
    confidence = 0.86 if matched_keyword else 0.58
    agent = agents_by_key[selected_agent]
    retrieved_memories = MEMORY_HINTS.get(selected_agent, MEMORY_HINTS["decision"])
    next_steps = (
        f"Load {agent.name} playbook",
        "Retrieve relevant memory records",
        "Draft action plan with safety gate",
        "Write route decision to audit log",
    )

    rationale = (
        f"Matched keyword '{matched_keyword}' to {agent.name}"
        if selected_agent != "decision"
        else "No specific domain matched; routed to decision support"
    )

    return RouteDecision(
        agent_key=selected_agent,
        agent_name=agent.name,
        urgency=urgency,
        action_type=action_type,
        requires_confirmation=requires_confirmation,
        confidence=confidence,
        retrieved_memories=retrieved_memories,
        next_steps=next_steps,
        rationale=rationale,
    )
