const localAgents = [
  ["business", "Business Agent", "business", "Revenue, pipeline, client delivery", "Monitors pipeline health, client delivery, proposals, follow-ups, KPIs, and weekly business reports.", ["HubSpot", "Stripe", "Notion"], ["Never send commercial terms without approval", "Escalate delivery risk within 24h"]],
  ["wellness", "Wellness Agent", "life", "Physical, mental, energy optimization", "Reads recovery data, notices trends, suggests workout intensity, hydration, fasting windows, and mood checks.", ["Oura", "Apple Health", "Cronometer"], ["Never override medical advice", "Protect sleep debt signals"]],
  ["finance", "Finance Agent", "business", "Cash flow, taxes, wealth building", "Tracks invoices, revenue, expenses, taxes, cashflow projections, and weekly P&L summaries.", ["Stripe", "Plaid", "QBO"], ["Require approval before payments", "Flag tax risk early"]],
  ["time", "Time & Energy Agent", "life", "Calendar, deep work, scheduling", "Protects deep work, schedules meetings intelligently, prepares briefs, and detects calendar overload.", ["Google Cal", "Calendly", "Toggl"], ["Confirm external calendar edits", "Respect prayer and health blocks"]],
  ["comms", "Comms Agent", "business", "Email, Slack, client messages", "Triages inboxes, drafts replies, summarizes threads, flags VIPs, and extracts action items.", ["Gmail", "Slack", "Telegram"], ["Draft first, send after approval", "Preserve voice and context"]],
  ["research", "Research Agent", "intelligence", "Market intelligence and synthesis", "Runs competitive research, monitors trends, summarizes documents, and prepares prospect briefs.", ["Web Search", "Exa", "Jina"], ["Prefer primary sources", "Separate fact from inference"]],
  ["content", "Content Agent", "business", "Writing, publishing, brand voice", "Creates posts from ideas, repurposes content, manages an editorial calendar, and tracks engagement.", ["LinkedIn", "Buffer", "Typefully"], ["Confirm publishing", "Maintain founder voice"]],
  ["ops", "Ops Agent", "business", "Projects, files, task management", "Maintains project boards, breaks goals into tasks, flags blockers, and runs operations reviews.", ["Linear", "Todoist", "GitHub"], ["Avoid destructive file actions", "Escalate blockers"]],
  ["learning", "Learning Agent", "intelligence", "Knowledge acquisition and skills", "Tracks reading, summarizes resources, sends spaced repetition prompts, and builds learning plans.", ["Readwise", "Kindle", "Anki"], ["Optimize for goals", "Keep summaries reusable"]],
  ["relationships", "Relationships Agent", "life", "Network, family, community", "Tracks important relationships, remembers milestones, and prompts thoughtful follow-ups.", ["Contacts", "Notion", "Clay"], ["Protect sensitive notes", "Avoid transactional tone"]],
  ["legal", "Legal & Immigration Agent", "life", "Compliance, deadlines, documents", "Tracks immigration milestones, contract renewals, CRS changes, and policy updates.", ["Notion", "DocuSign", "Alerts"], ["Do not provide legal finality", "Escalate deadlines"]],
  ["spiritual", "Spiritual Agent", "life", "Islamic practice and values", "Sends prayer reminders, tracks fasting, supports reflection, and aligns prompts with values.", ["Prayer API", "Quran API", "Notion"], ["Values before productivity", "Respect sacred time"]],
  ["home", "Home Agent", "life", "Environment and household logistics", "Manages grocery lists, household tasks, weather context, subscriptions, and maintenance reminders.", ["Weather", "SMS", "Notion"], ["Confirm purchases", "Keep logistics lightweight"]],
  ["outreach", "Outreach Agent", "business", "Lead gen and partnerships", "Runs lead enrichment, personalized first lines, campaign sequencing, and reply-rate reporting.", ["Clay", "Smartlead", "Apollo"], ["No spam patterns", "Respect deliverability limits"]],
  ["decision", "Decision Agent", "intelligence", "Tradeoffs and clarity", "Builds weighted decision models, challenges assumptions, and retrieves similar past decisions.", ["Memory", "LLM", "Notion"], ["Show assumptions", "Name irreversible risks"]],
  ["dev", "Dev Agent", "business", "Code review, debugging, DevOps", "Monitors builds, reviews PRs, summarizes failures, tracks debt, and scaffolds modules.", ["GitHub", "Vercel", "Railway"], ["Never deploy without approval", "Prefer tests before changes"]],
  ["travel", "Travel Agent", "life", "Trips, bookings, logistics", "Plans trips, watches prices, prepares briefings, and checks passport or visa constraints.", ["Maps", "Flights", "Notion"], ["Confirm bookings", "Check documents first"]],
  ["strategy", "Strategic Reflection Agent", "intelligence", "Vision, goals, long-term thinking", "Runs weekly and quarterly reviews, detects drift, and keeps actions aligned with the 10-year vision.", ["Memory", "Goals", "Notion"], ["Challenge drift", "Tie decisions to values"]]
];

const workflows = [
  ["6:00 AM", "Morning Briefing", "time", "Reads sleep, calendar, inbox, weather, prayer times, and pipeline signals.", "Telegram brief", "ready"],
  ["Every 30 min", "Inbox Triage", "comms", "Classifies new emails, drafts replies, flags VIPs, and summarizes newsletters.", "Gmail labels", "approval"],
  ["New lead", "Lead Enrichment", "outreach", "Researches the lead, scores fit, and assigns the correct campaign sequence.", "CRM update", "ready"],
  ["Invoice created", "Payment Tracking", "finance", "Creates reminders and stages follow-up drafts at day 3, 7, and 14.", "Draft emails", "approval"],
  ["5:30 PM", "End-of-Day Digest", "strategy", "Summarizes completions, slipped work, tomorrow conflicts, and reflection prompts.", "Telegram digest", "ready"],
  ["Sleep logged", "Recovery Protocol", "wellness", "Adjusts schedule suggestions when sleep or HRV crosses a threshold.", "Calendar plan", "approval"],
  ["GitHub push", "Dev Watch", "dev", "Monitors build status, queues review, and reports failures with context.", "Dev alert", "ready"],
  ["1st monthly", "Financial Snapshot", "finance", "Reconciles revenue, expenses, tax provisions, and 90-day cashflow.", "Finance dashboard", "ready"]
];

const roadmap = [
  ["Now", "Demo Kernel", "Interactive dashboard, route API, approval inbox, audit trail, memory search, and operational demo data."],
  ["Next", "FastAPI Core", "Replace the standard-library API with authenticated FastAPI endpoints, typed schemas, and persistent audit events."],
  ["Phase 2", "Memory Infrastructure", "Add Postgres/pgvector, memory write policies, semantic retrieval, and daily summarization jobs."],
  ["Phase 3", "Real Integrations", "Connect Gmail, Calendar, Notion, Stripe, GitHub, Telegram, and OAuth health checks."],
  ["Phase 4", "Automation Engine", "Add Redis queue, n8n workflow dispatch, retries, rate limits, and dead-letter monitoring."],
  ["Phase 5", "Production Hardening", "Add auth, secrets management, deployment, cost caps, observability, and red-team safety tests."]
];

const signals = [
  ["Revenue", "Northstar Labs proposal has gone quiet for 6 days. Best next action: concise value recap and CTA."],
  ["Energy", "Recovery is below baseline. Protect morning deep work and move optional syncs after lunch."],
  ["Calendar", "Tomorrow has 4 context switches before noon. Consolidating two calls creates a 110-minute focus block."],
  ["Learning", "The same sales objection appeared in 3 calls. Add it to the proposal FAQ and outreach scripts."]
];

const scenarios = [
  "Summarize yesterday's inbox and draft replies for urgent client messages.",
  "Review my week against goals and tell me where I am drifting.",
  "Reschedule optional meetings if sleep is below 6.5 hours.",
  "Research this new lead and decide whether they match our ICP.",
  "Watch the GitHub build and alert me if deployment fails today."
];

let approvals = [];
let auditEvents = [];
let integrations = [];
let costs = null;

const api = {
  async get(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Request failed: ${path}`);
    return response.json();
  },
  async post(path, body) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`Request failed: ${path}`);
    return response.json();
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function agentRecord(agent) {
  return {
    key: agent[0],
    name: agent[1],
    category: agent[2],
    subtitle: agent[3],
    description: agent[4],
    tools: agent[5],
    rules: agent[6]
  };
}

function renderSignals() {
  const root = document.querySelector("#intelligenceFeed");
  root.innerHTML = signals.map(([label, copy]) => `
    <article class="signal-item">
      <span>${label}</span>
      <p>${copy}</p>
    </article>
  `).join("");
}

function renderAgents(filter = "all") {
  const root = document.querySelector("#agentGrid");
  const visibleAgents = localAgents.map(agentRecord).filter((agent) => filter === "all" || agent.category === filter);

  root.innerHTML = visibleAgents.map((agent) => `
    <article class="agent-card" data-agent="${agent.key}" data-category="${agent.category}">
      <div class="agent-top">
        <div>
          <strong>${agent.name}</strong>
          <span>${agent.subtitle}</span>
        </div>
        <span class="category-tag">${agent.category}</span>
      </div>
      <p>${agent.description}</p>
      <div class="agent-tools">${agent.tools.map((tool) => `<span>${tool}</span>`).join("")}</div>
      <button class="link-button" type="button" data-open-agent="${agent.key}">Open playbook</button>
    </article>
  `).join("");
}

function renderWorkflows(activeIndex = -1) {
  const root = document.querySelector("#workflowList");
  root.innerHTML = workflows.map(([time, name, owner, description, output, state], index) => `
    <article class="workflow-item ${index === activeIndex ? "active-run" : ""}">
      <div class="workflow-time">${time}</div>
      <div>
        <div class="workflow-name">${name}</div>
        <div class="workflow-owner">${owner}</div>
      </div>
      <p class="workflow-desc">${description}</p>
      <div>
        <span class="state-pill ${state}">${state}</span>
        <div class="workflow-output">${output}</div>
      </div>
    </article>
  `).join("");
}

function renderApprovals() {
  const root = document.querySelector("#approvalList");
  root.innerHTML = approvals.map((item) => `
    <article class="approval-item" data-approval="${item.id}">
      <div>
        <span class="risk ${item.risk}">${item.risk}</span>
        <strong>${item.action}</strong>
        <p>${item.reason}</p>
        <small>${item.agent} -> ${item.destination}</small>
      </div>
      <div class="approval-actions">
        <button class="button compact approve" type="button" data-decision="approved" data-id="${item.id}">Approve</button>
        <button class="button compact" type="button" data-decision="rejected" data-id="${item.id}">Reject</button>
      </div>
    </article>
  `).join("");
}

function renderAudit() {
  const root = document.querySelector("#auditList");
  root.innerHTML = auditEvents.map((item) => `
    <article class="audit-item">
      <time>${item.time}</time>
      <div>
        <strong>${item.agent}</strong>
        <p>${item.event}</p>
        <small>${item.result}</small>
      </div>
    </article>
  `).join("");
}

function renderIntegrations() {
  const root = document.querySelector("#integrationList");
  root.innerHTML = integrations.map((item) => `
    <article class="integration-item">
      <div>
        <strong>${item.name}</strong>
        <span>${item.latency_ms ? `${item.latency_ms}ms` : "setup required"}</span>
      </div>
      <span class="connector-status">${item.status}</span>
    </article>
  `).join("");
}

function renderCosts() {
  const root = document.querySelector("#costPanel");
  if (!costs) return;
  const remaining = Math.max(0, Math.round((1 - costs.spent_today / costs.daily_budget) * 100));
  root.innerHTML = `
    <div class="budget-ring" style="--value:${remaining}%">
      <strong>${remaining}%</strong>
      <span>remaining</span>
    </div>
    <div class="model-mix">
      ${costs.model_mix.map((item) => `
        <div>
          <span>${item.label}</span>
          <strong>${item.share}%</strong>
          <small>${item.model}</small>
        </div>
      `).join("")}
    </div>
  `;
}

async function renderMemory(query = "") {
  const root = document.querySelector("#memoryList");
  const memories = await api.get(`/api/memory/search?q=${encodeURIComponent(query)}`);
  root.innerHTML = memories.map((memory) => `
    <article class="memory-item">
      <span>${memory.type}</span>
      <strong>${memory.title}</strong>
      <p>${memory.summary}</p>
      <div class="agent-tools">${memory.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </article>
  `).join("");
}

function renderRoadmap() {
  const root = document.querySelector("#roadmapList");
  root.innerHTML = roadmap.map(([phase, name, description], index) => `
    <article class="roadmap-item ${index === 0 ? "current" : ""}">
      <div class="roadmap-phase">${phase}</div>
      <div>
        <strong>${name}</strong>
        <p>${description}</p>
      </div>
    </article>
  `).join("");
}

function showRoute(decision) {
  const root = document.querySelector("#routeResult");
  root.innerHTML = `
    <div class="route-grid">
      <span>Agent</span><strong>${decision.agent_name}</strong>
      <span>Urgency</span><strong>${decision.urgency}/5</strong>
      <span>Action</span><strong>${decision.action_type}</strong>
      <span>Gate</span><strong>${decision.requires_confirmation ? "approval required" : "safe to stage"}</strong>
      <span>Confidence</span><strong>${Math.round(decision.confidence * 100)}%</strong>
    </div>
    <p>${decision.rationale}</p>
    <div class="agent-tools">${decision.retrieved_memories.map((memory) => `<span>${memory}</span>`).join("")}</div>
  `;
}

function openDrawer(agentKey) {
  const agent = localAgents.map(agentRecord).find((item) => item.key === agentKey);
  if (!agent) return;

  document.querySelector("#drawerContent").innerHTML = `
    <span class="eyebrow">${agent.category} agent</span>
    <h2 id="drawerTitle">${agent.name}</h2>
    <p>${agent.description}</p>
    <h3>Tool Access</h3>
    <div class="agent-tools">${agent.tools.map((tool) => `<span>${tool}</span>`).join("")}</div>
    <h3>Operating Rules</h3>
    <ul class="rule-list">${agent.rules.map((rule) => `<li>${rule}</li>`).join("")}</ul>
    <h3>Success Metrics</h3>
    <ul class="rule-list">
      <li>Time saved per week</li>
      <li>Correct escalations</li>
      <li>Actions completed without rework</li>
    </ul>
  `;
  document.querySelector("#agentDrawer").classList.add("open");
  document.querySelector("#agentDrawer").setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  document.querySelector("#agentDrawer").classList.remove("open");
  document.querySelector("#agentDrawer").setAttribute("aria-hidden", "true");
}

function wireInteractions() {
  document.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderAgents(button.dataset.filter);
    });
  });

  document.querySelector("#agentGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-agent]");
    if (button) openDrawer(button.dataset.openAgent);
  });

  document.querySelector("#closeDrawer").addEventListener("click", closeDrawer);
  document.querySelector("#agentDrawer").addEventListener("click", (event) => {
    if (event.target.id === "agentDrawer") closeDrawer();
  });

  document.querySelector("#simulateRun").addEventListener("click", () => {
    const index = Math.floor(Math.random() * workflows.length);
    renderWorkflows(index);
    auditEvents = [{
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      agent: `${workflows[index][2]} agent`,
      event: `${workflows[index][1]} simulated`,
      result: workflows[index][4]
    }, ...auditEvents].slice(0, 6);
    renderAudit();
  });

  document.querySelector("#commandForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.querySelector("#commandInput").value;
    const safeMessage = escapeHtml(message);
    try {
      const decision = await api.post("/api/route", { message: safeMessage });
      showRoute(decision);
      auditEvents = [{
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        agent: decision.agent_name,
        event: "Command routed",
        result: decision.rationale
      }, ...auditEvents].slice(0, 6);
      renderAudit();
    } catch (error) {
      document.querySelector("#routeResult").innerHTML = `<p>Route API unavailable. Start with <code>npm run dev</code>.</p>`;
    }
  });

  document.querySelector("#loadScenario").addEventListener("click", () => {
    const next = scenarios[Math.floor(Math.random() * scenarios.length)];
    document.querySelector("#commandInput").value = next;
  });

  document.querySelector("#memoryForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await renderMemory(document.querySelector("#memoryQuery").value);
  });

  document.querySelector("#approvalList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-decision]");
    if (!button) return;
    const item = approvals.find((approval) => approval.id === button.dataset.id);
    approvals = approvals.filter((approval) => approval.id !== button.dataset.id);
    auditEvents = [{
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      agent: item.agent,
      event: `Approval ${button.dataset.decision}`,
      result: item.action
    }, ...auditEvents].slice(0, 6);
    renderApprovals();
    renderAudit();
  });

  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links.map((link) => document.querySelector(`#${link.dataset.section}`));
  window.addEventListener("scroll", () => {
    const current = sections.reduce((active, section) => (
      section.getBoundingClientRect().top < 160 ? section : active
    ), null);
    if (!current) return;
    links.forEach((link) => link.classList.toggle("active", link.dataset.section === current.id));
  }, { passive: true });
}

async function boot() {
  renderSignals();
  renderAgents();
  renderWorkflows();
  renderRoadmap();
  wireInteractions();

  try {
    await api.get("/api/health");
    document.querySelector("#apiStatus").textContent = "online";
    document.querySelector("#apiStatus").classList.add("online");
    [approvals, auditEvents, integrations, costs] = await Promise.all([
      api.get("/api/approvals"),
      api.get("/api/audit"),
      api.get("/api/integrations"),
      api.get("/api/costs")
    ]);
    renderApprovals();
    renderAudit();
    renderIntegrations();
    renderCosts();
    await renderMemory(document.querySelector("#memoryQuery").value);
  } catch (error) {
    document.querySelector("#apiStatus").textContent = "offline";
    document.querySelector("#routeResult").innerHTML = "<p>Local API is offline. Run <code>npm run dev</code> for the full experience.</p>";
  }
}

boot();
