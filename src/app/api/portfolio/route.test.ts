import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "./route";
import { NextRequest } from "next/server";

function makeRequest(scenario?: string): NextRequest {
  const url = scenario
    ? `http://localhost:3000/api/portfolio?scenario=${scenario}`
    : "http://localhost:3000/api/portfolio";
  return new NextRequest(url);
}

test("GET /api/portfolio returns 200 with valid scenario", async () => {
  const req = makeRequest("live");
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.ok(body.data);
});

test("GET /api/portfolio returns 200 with no scenario", async () => {
  const req = makeRequest();
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
});

test("GET /api/portfolio returns 400 for invalid scenario", async () => {
  const req = makeRequest("invalid-scenario");
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("GET /api/portfolio sandbox scenarios return demo data", async () => {
  const scenarios = ["empty", "loading", "partial-failure", "timeout"];

  for (const scenario of scenarios) {
    const req = makeRequest(scenario);
    const res = await GET(req);
    const body = await res.json();

    assert.equal(res.status, 200, `Scenario ${scenario} should return 200`);
    assert.equal(body.success, true, `Scenario ${scenario} should be successful`);
  }
});
