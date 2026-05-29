import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "./route";
import { NextRequest } from "next/server";

function makeRequest(params?: Record<string, string>): NextRequest {
  const url = new URL("http://localhost:3000/api/transaction-history");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return new NextRequest(url.toString());
}

test("GET /api/transaction-history returns 200 with default params", async () => {
  const req = makeRequest();
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
  assert.ok(body.data);
});

test("GET /api/transaction-history returns 200 with valid kind filter", async () => {
  const kinds = ["all", "deposit", "withdrawal", "rebalance"];

  for (const kind of kinds) {
    const req = makeRequest({ kind });
    const res = await GET(req);
    const body = await res.json();

    assert.equal(res.status, 200, `Kind ${kind} should return 200`);
    assert.equal(body.success, true);
  }
});

test("GET /api/transaction-history returns 200 with valid status filter", async () => {
  const statuses = ["all", "pending", "confirmed", "failed"];

  for (const status of statuses) {
    const req = makeRequest({ status });
    const res = await GET(req);
    const body = await res.json();

    assert.equal(res.status, 200, `Status ${status} should return 200`);
    assert.equal(body.success, true);
  }
});

test("GET /api/transaction-history returns 200 with pagination", async () => {
  const req = makeRequest({ page: "1", pageSize: "10" });
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
});

test("GET /api/transaction-history returns 400 for invalid kind", async () => {
  const req = makeRequest({ kind: "invalid" });
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("GET /api/transaction-history returns 400 for invalid status", async () => {
  const req = makeRequest({ status: "invalid" });
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error.code, "VALIDATION_ERROR");
});

test("GET /api/transaction-history returns 400 for invalid page", async () => {
  const req = makeRequest({ page: "0" });
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.equal(body.success, false);
});

test("GET /api/transaction-history returns 400 for pageSize > 50", async () => {
  const req = makeRequest({ pageSize: "100" });
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 400);
  assert.equal(body.success, false);
});

test("GET /api/transaction-history returns 200 with date range", async () => {
  const req = makeRequest({
    dateFrom: "2026-01-01",
    dateTo: "2026-12-31",
  });
  const res = await GET(req);
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body.success, true);
});
