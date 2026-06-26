const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "src/app.js",
  "src/styles.css",
  "jarvis-blueprint.html",
  "README.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length > 0) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const appSource = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const agentMatch = appSource.match(/const localAgents = \[([\s\S]*?)\];/);
if (!agentMatch) {
  console.error("Could not find the agent catalog in src/app.js");
  process.exit(1);
}

const agentCount = (agentMatch[1].match(/\n  \[/g) || []).length;
if (agentCount !== 18) {
  console.error(`Expected 18 agents, found ${agentCount}`);
  process.exit(1);
}

const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
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
const missingMounts = requiredMounts.filter((id) => !indexSource.includes(`id="${id}"`));
if (missingMounts.length > 0) {
  console.error(`Missing mount points: ${missingMounts.join(", ")}`);
  process.exit(1);
}

const packageSource = fs.readFileSync(path.join(root, "package.json"), "utf8");
if (!packageSource.includes("backend/server.py")) {
  console.error("Expected npm run dev to start the local JARVIS API server.");
  process.exit(1);
}

console.log("Validation passed: Mission Control app, API server script, and 18-agent catalog are aligned.");
