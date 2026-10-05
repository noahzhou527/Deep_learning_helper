// Requires the existing agent-browser CLI and a running preview.
// Set AGENT_BROWSER_BIN to its executable if it is not on PATH.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

const binary = process.env.AGENT_BROWSER_BIN ?? "agent-browser";
const origin = process.env.PREVIEW_URL ?? "http://localhost:5174";
const routes = ["/", "/learn", "/gan", "/gpt", "/bert", "/reinforcement-learning", "/review", "/transformer-map"];
const failures = [];
let checks = 0;
// Inherit startup output so a Windows browser daemon cannot keep a captured
// stdout pipe open and block spawnSync after the launcher exits.
assert.equal(spawnSync(binary, ["--session", "contrast-audit", "open", origin], { stdio: "inherit", timeout: 30_000 }).status, 0);

function run(...args) {
  const result = spawnSync(binary, ["--session", "contrast-audit", ...args, "--json"], { encoding: "utf8", maxBuffer: 4 * 1024 * 1024, timeout: 30_000 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const response = JSON.parse(result.stdout);
  assert.equal(response.success, true, response.error);
  return response.data;
}
const evaluate = (expression) => run("eval", expression).result;

function audit(label, selector) {
  const report = run("a11y", "--tags", "wcag2aa", ...(selector ? ["--selector", selector] : []));
  checks++;
  for (const violation of report.violations ?? []) {
    if (violation.id === "color-contrast") failures.push({ label, nodes: violation.nodes });
  }
}

function clickEvery(selector, scope, label) {
  const count = evaluate(`document.querySelectorAll(${JSON.stringify(selector)}).length`);
  for (let index = 0; index < count; index++) {
    evaluate(`document.querySelectorAll(${JSON.stringify(selector)})[${index}].click()`);
    audit(`${label} ${selector}[${index}]`, scope);
  }
}

for (const width of [1440, 390]) {
  run("set", "viewport", String(width), "1000");
  for (const mode of ["light", "dark"]) {
    run("set", "media", mode, "reduced-motion");
    for (const route of routes) {
      const label = `${width}px ${mode} ${route}`;
      run("open", origin + route);
      audit(label);
      const sections = evaluate('Array.from(document.querySelectorAll("main > section")).map((e,i)=>e.id ? "#"+e.id : "main > section:nth-of-type("+(i+1)+")")');
      for (const section of sections) audit(`${label} ${section}`, section);
      if (route === "/transformer-map") {
        for (const [selector, scope] of [[".journey-step", "#architecture"], [".blueprint-tabs button", "#full-architecture"], [".token-chip", "#try"], [".head-tab", ".heads-section"], [".dataset-segment", "#training"]]) clickEvery(selector, scope, label);
      } else if (route === "/review") {
        for (let query = 0; query < 4; query++) {
          evaluate(`document.querySelectorAll(".token-tabs button")[${query}].click()`);
          clickEvery(".step-tabs button", "#attention", `${label} query ${query}`);
        }
      } else {
        clickEvery(".pipeline-steps button", "#pipeline", label);
        if (evaluate('document.querySelectorAll("details").length')) {
          evaluate('document.querySelectorAll("details").forEach(e=>e.open=true)');
          audit(`${label} expanded answers`, ".faq-section");
        }
      }
    }
    console.log(`Checked ${width}px ${mode}: ${failures.length} contrast failures so far.`);
  }
}
mkdirSync("outputs", { recursive: true });
writeFileSync("outputs/contrast-audit.json", JSON.stringify({ checks, failures }, null, 2));
console.log(`${checks} page, section and interaction checks; ${failures.length} contrast failures. See outputs/contrast-audit.json.`);
assert.equal(failures.length, 0, "Text contrast violations remain.");
