const examples = [
  "Review my overdue Stripe invoices and draft follow-ups for anything at risk today.",
  "Reschedule optional meetings if sleep is below 6.5 hours.",
  "Summarize yesterday's inbox and flag client messages that need replies.",
  "Watch the GitHub deployment and alert me if the build fails today.",
  "Research this new lead and decide whether they match our ideal customer profile."
];

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

function renderRoute(decision) {
  const root = document.querySelector("#landingRouteResult");
  root.innerHTML = `
    <span class="eyebrow">Route Decision</span>
    <h3>${decision.agent_name}</h3>
    <div class="route-grid">
      <span>Urgency</span><strong>${decision.urgency}/5</strong>
      <span>Action</span><strong>${decision.action_type}</strong>
      <span>Approval</span><strong>${decision.requires_confirmation ? "Required" : "Not required"}</strong>
      <span>Confidence</span><strong>${Math.round(decision.confidence * 100)}%</strong>
    </div>
    <p>${decision.rationale}</p>
    <div class="route-tags">
      ${decision.retrieved_memories.map((memory) => `<span class="route-chip ok">${memory}</span>`).join("")}
    </div>
  `;
}

async function routeCommand(event) {
  event.preventDefault();
  const message = escapeHtml(document.querySelector("#landingCommand").value);
  const result = document.querySelector("#landingRouteResult");
  result.innerHTML = `<span class="eyebrow">Routing</span><h3>JARVIS is classifying the command...</h3>`;

  try {
    renderRoute(await api.post("/api/route", { message }));
  } catch (error) {
    result.innerHTML = `
      <span class="eyebrow">Offline Demo</span>
      <h3>Start the local server with <code>npm run dev</code> to activate routing.</h3>
    `;
  }
}

function updateRoi() {
  const hours = Number(document.querySelector("#hoursSaved").value);
  const hourly = Number(document.querySelector("#hourlyValue").value);
  const deals = Number(document.querySelector("#dealsInfluenced").value);
  const weekly = hours * hourly;
  const monthly = Math.round((weekly * 4.33) + (deals * 450));

  document.querySelector("#hoursSavedValue").textContent = hours;
  document.querySelector("#hourlyValueValue").textContent = `$${hourly}`;
  document.querySelector("#dealsInfluencedValue").textContent = deals;
  document.querySelector("#weeklyValue").textContent = `$${weekly.toLocaleString()}/wk`;
  document.querySelector("#monthlyValue").textContent = `$${monthly.toLocaleString()}/month in time and pipeline leverage.`;
}

function setupDialog() {
  const dialog = document.querySelector("#demoDialog");
  document.querySelectorAll(".open-demo").forEach((button) => {
    button.addEventListener("click", () => dialog.showModal());
  });

  document.querySelector("#submitLead").addEventListener("click", (event) => {
    const name = document.querySelector("#leadName").value.trim();
    const workflow = document.querySelector("#leadWorkflow").value.trim();
    const email = document.querySelector("#leadEmail").value.trim();
    if (!name || !workflow || !email) return;
    event.preventDefault();
    localStorage.setItem("jarvis-demo-request", JSON.stringify({ name, workflow, email, savedAt: new Date().toISOString() }));
    document.querySelector("#leadStatus").textContent = "Demo request saved locally. Open Mission Control when you are ready.";
  });
}

function setupHeroCanvas() {
  const canvas = document.querySelector("#heroScene");
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let pointerX = 0.68;
  let pointerY = 0.42;
  const nodes = Array.from({ length: 54 }, (_, index) => ({
    x: (index * 97 % 100) / 100,
    y: (index * 53 % 100) / 100,
    r: 1.5 + (index % 4),
    speed: 0.18 + (index % 7) * 0.018
  }));

  function resize() {
    width = canvas.clientWidth * window.devicePixelRatio;
    height = canvas.clientHeight * window.devicePixelRatio;
    canvas.width = width;
    canvas.height = height;
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#08090b";
    context.fillRect(0, 0, width, height);

    const coreX = width * pointerX;
    const coreY = height * pointerY;
    const radius = Math.min(width, height) * 0.28;
    const glow = context.createRadialGradient(coreX, coreY, 0, coreX, coreY, radius);
    glow.addColorStop(0, "rgba(215,255,67,0.18)");
    glow.addColorStop(0.42, "rgba(78,215,197,0.09)");
    glow.addColorStop(1, "rgba(8,9,11,0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(coreX, coreY, radius, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(255,255,255,0.08)";
    context.lineWidth = 1 * window.devicePixelRatio;
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      const x = width * node.x + Math.sin(time * 0.0002 * node.speed + i) * 18;
      const y = height * node.y + Math.cos(time * 0.00023 * node.speed + i) * 18;
      const distance = Math.hypot(x - coreX, y - coreY);
      if (distance < radius * 1.35) {
        context.globalAlpha = Math.max(0.08, 1 - distance / (radius * 1.35));
        context.beginPath();
        context.moveTo(coreX, coreY);
        context.lineTo(x, y);
        context.stroke();
      }
      context.globalAlpha = 1;
      context.fillStyle = i % 5 === 0 ? "#d7ff43" : i % 3 === 0 ? "#4ed7c5" : "#7dadff";
      context.beginPath();
      context.arc(x, y, node.r * window.devicePixelRatio, 0, Math.PI * 2);
      context.fill();
    }

    context.strokeStyle = "rgba(215,255,67,0.42)";
    context.lineWidth = 1.2 * window.devicePixelRatio;
    for (let ring = 0; ring < 3; ring += 1) {
      context.beginPath();
      context.arc(coreX, coreY, radius * (0.28 + ring * 0.18), time * 0.0004 + ring, Math.PI * 1.45 + time * 0.0004 + ring);
      context.stroke();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointerX = Math.min(0.86, Math.max(0.52, event.clientX / window.innerWidth));
    pointerY = Math.min(0.7, Math.max(0.24, event.clientY / window.innerHeight));
  });
  resize();
  requestAnimationFrame(draw);
}

async function boot() {
  setupHeroCanvas();
  setupDialog();
  updateRoi();
  document.querySelector("#landingCommandForm").addEventListener("submit", routeCommand);
  document.querySelector("#randomCommand").addEventListener("click", () => {
    document.querySelector("#landingCommand").value = examples[Math.floor(Math.random() * examples.length)];
  });
  document.querySelectorAll("#roiForm input").forEach((input) => input.addEventListener("input", updateRoi));
  document.querySelector("#menuToggle").addEventListener("click", () => document.querySelector("#siteNav").classList.toggle("open"));

  try {
    await api.get("/api/health");
    document.querySelector("#landingApiStatus").textContent = "online";
    document.querySelector("#landingApiStatus").classList.add("online");
  } catch (error) {
    document.querySelector("#landingApiStatus").textContent = "offline";
  }
}

boot();
