const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "mission-control.html",
  "src/app.js",
  "src/landing.js",
  "src/styles.css",
  "jarvis-blueprint.html",
  "backend/jarvis_core/catalog.py",
  "README.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

// --- Agent catalog: must be 18 and identical across the JS UI and the Python core ---
const appSource = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const agentMatch = appSource.match(/const localAgents = \[([\s\S]*?)\];/);
if (!agentMatch) {
  console.error("Could not find the agent catalog (localAgents) in src/app.js");
  process.exit(1);
}
const jsKeys = [...agentMatch[1].matchAll(/\n {2}\["([a-z]+)"/g)].map((m) => m[1]);

const catalogSource = fs.readFileSync(path.join(root, "backend/jarvis_core/catalog.py"), "utf8");
const pyKeys = [...catalogSource.matchAll(/Agent\("([a-z]+)"/g)].map((m) => m[1]);

if (jsKeys.length !== 18) {
  console.error(`Expected 18 agents in src/app.js, found ${jsKeys.length}`);
  process.exit(1);
}
if (pyKeys.length !== 18) {
  console.error(`Expected 18 agents in backend/jarvis_core/catalog.py, found ${pyKeys.length}`);
  process.exit(1);
}

const jsSet = new Set(jsKeys);
const pySet = new Set(pyKeys);
const onlyJs = jsKeys.filter((k) => !pySet.has(k));
const onlyPy = pyKeys.filter((k) => !jsSet.has(k));
if (onlyJs.length || onlyPy.length) {
  console.error("Agent catalog drift between UI and core:");
  if (onlyJs.length) console.error(`  only in src/app.js: ${onlyJs.join(", ")}`);
  if (onlyPy.length) console.error(`  only in catalog.py: ${onlyPy.join(", ")}`);
  process.exit(1);
}

// --- Dashboard mount points live in mission-control.html ---
const dashboardSource = fs.readFileSync(path.join(root, "mission-control.html"), "utf8");
const requiredMounts = [
  "commandForm",
  "routeResult",
  "agentGrid",
  "workflowList",
  "approvalList",
  "memoryList",
  "auditList",
  "integrationList",
  "roadmapList"
];
const missingMounts = requiredMounts.filter((id) => !dashboardSource.includes(`id="${id}"`));
if (missingMounts.length > 0) {
  console.error(`Missing mount points in mission-control.html: ${missingMounts.join(", ")}`);
  process.exit(1);
}

// --- Dev command must launch the local API server ---
const packageSource = fs.readFileSync(path.join(root, "package.json"), "utf8");
if (!packageSource.includes("backend/server.py")) {
  console.error("Expected npm run dev to start the local JARVIS API server.");
  process.exit(1);
}

console.log("Validation passed: dashboard mounts, API server script, and an 18-agent catalog aligned across UI and core.");
