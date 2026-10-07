import assert from "node:assert/strict";
import { test } from "node:test";
import { configuredPort, devPort, previewPort, devUrl } from "./local-ports.mjs";

test("ports default independently and allow per-app overrides", () => {
  assert.equal(devPort({}), 5173);
  assert.equal(previewPort({}), 4173);
  assert.equal(devPort({ PORT: "6200" }), 6200);
  assert.equal(previewPort({ PORT: "6200" }), 6200);
  assert.equal(devPort({ DEV_PORT: "6201", PORT: "6200" }), 6200);
  assert.equal(previewPort({ PREVIEW_PORT: "6202", PORT: "6200" }), 6202);
});

test("ports reject malformed or unavailable numeric ranges", () => {
  for (const value of ["NaN", "12.5", "0", "-1", "65536", "5300junk"]) {
    assert.throws(() => configuredPort(value, 5173), RangeError);
  }
  assert.equal(configuredPort("", 5173), 5173);
  assert.equal(configuredPort("  ", 5173), 5173);
  assert.equal(configuredPort("65535", 5173), 65535);
});

test("QA URL respects the reported URL override and configured development port", () => {
  assert.equal(
    devUrl({ DEV_URL: "http://127.0.0.1:5174/", DEV_PORT: "5300" }),
    "http://127.0.0.1:5174/",
  );
  assert.equal(devUrl({ DEV_PORT: "5300" }), "http://127.0.0.1:5300/");
  assert.equal(devUrl({ PORT: "5400" }), "http://127.0.0.1:5400/");
});
