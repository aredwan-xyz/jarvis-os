from dataclasses import dataclass


@dataclass(frozen=True)
class Agent:
    key: str
    name: str
    category: str
    mission: str
    tools: tuple[str, ...]


@dataclass(frozen=True)
class Workflow:
    key: str
    trigger: str
    name: str
    owner_agent: str
    requires_confirmation: bool


AGENTS: tuple[Agent, ...] = (
    Agent("business", "Business Agent", "business", "Revenue, pipeline, and client delivery.", ("HubSpot", "Stripe", "Notion")),
    Agent("wellness", "Wellness Agent", "life", "Physical, mental, and energy optimization.", ("Oura", "Apple Health", "Cronometer")),
    Agent("finance", "Finance Agent", "business", "Cash flow, taxes, and wealth building.", ("Stripe", "Plaid", "QBO")),
    Agent("time", "Time & Energy Agent", "life", "Calendar, deep work, and scheduling.", ("Google Calendar", "Calendly", "Toggl")),
    Agent("comms", "Comms Agent", "business", "Email, Slack, and client communications.", ("Gmail", "Slack", "Telegram")),
    Agent("research", "Research Agent", "intelligence", "Intelligence gathering and synthesis.", ("Web Search", "Exa", "Jina")),
    Agent("content", "Content Agent", "business", "Writing, publishing, and brand voice.", ("LinkedIn", "Buffer", "Typefully")),
    Agent("ops", "Ops Agent", "business", "Projects, files, and task management.", ("Linear", "Todoist", "GitHub")),
    Agent("learning", "Learning Agent", "intelligence", "Knowledge acquisition and skills.", ("Readwise", "Kindle", "Anki")),
    Agent("relationships", "Relationships Agent", "life", "Network, family, and community.", ("Contacts", "Notion", "Clay")),
    Agent("legal", "Legal & Immigration Agent", "life", "Compliance, deadlines, and documents.", ("Notion", "DocuSign", "Alerts")),
    Agent("spiritual", "Spiritual Agent", "life", "Islamic practice and values alignment.", ("Prayer Times API", "Quran API", "Notion")),
    Agent("home", "Home Agent", "life", "Environment, logistics, and household tasks.", ("Weather", "SMS", "Notion")),
    Agent("outreach", "Outreach Agent", "business", "Lead generation, outreach, and partnerships.", ("Clay", "Smartlead", "Apollo")),
    Agent("decision", "Decision Agent", "intelligence", "Analysis, tradeoffs, and clarity.", ("Memory", "LLM", "Notion")),
    Agent("dev", "Dev Agent", "business", "Code review, debugging, and DevOps.", ("GitHub", "Vercel", "Railway")),
    Agent("travel", "Travel Agent", "life", "Trips, bookings, and logistics.", ("Maps", "Flights", "Notion")),
    Agent("strategy", "Strategic Reflection Agent", "intelligence", "Vision, goals, and long-term thinking.", ("Memory", "Goals", "Notion")),
)


WORKFLOWS: tuple[Workflow, ...] = (
    Workflow("morning_briefing", "6:00 AM daily", "Morning Briefing", "time", False),
    Workflow("inbox_triage", "Every 30 minutes", "Inbox Triage", "comms", True),
    Workflow("lead_enrichment", "New lead", "Lead Enrichment", "outreach", False),
    Workflow("payment_tracking", "Invoice created", "Payment Tracking", "finance", True),
    Workflow("end_of_day_digest", "5:30 PM daily", "End-of-Day Digest", "strategy", False),
    Workflow("recovery_protocol", "Sleep logged", "Recovery Protocol", "wellness", True),
    Workflow("dev_watch", "GitHub push", "Dev Watch", "dev", False),
    Workflow("financial_snapshot", "1st of month", "Financial Snapshot", "finance", False),
)
