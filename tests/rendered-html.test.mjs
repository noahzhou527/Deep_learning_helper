import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the neural network review page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Neural Notes/);
  assert.match(html, /Self-Attention/);
  assert.match(html, /FNN/);
  assert.match(html, /CNN/);
  assert.match(html, /RNN/);
  assert.match(html, /Transformer/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("server-renders every merged learning route", async () => {
  const routes = [
    ["/learn", /AI 架构实验室/],
    ["/transformer-map", /Encoder/],
    ["/gan", /Generator/],
    ["/gpt", /Next-token/],
    ["/bert", /Masked Language Model/],
    ["/reinforcement-learning", /Bellman/],
  ];

  for (const [path, expected] of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected, path);
  }
});
