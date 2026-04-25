import assert from "node:assert/strict";
import test from "node:test";

import { ApiRequestError, apiRequest } from "@/lib/api-client";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("apiRequest returns typed data from success envelope", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({
      success: true,
      data: {
        quote: "ok",
      },
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  const result = await apiRequest<{ quote: string }>("/api/test", {
    method: "POST",
    body: { input: true },
    baseUrl: "https://example.com",
  });

  assert.equal(result.quote, "ok");
});

test("apiRequest maps envelope errors to ApiRequestError", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid payload",
        details: {
          amount: ["Amount is required"],
        },
      },
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });

  await assert.rejects(
    () => apiRequest("/api/test"),
    (error: unknown) => {
      assert.ok(error instanceof ApiRequestError);
      assert.equal(error.code, "VALIDATION_ERROR");
      assert.equal(error.status, 400);
      assert.deepEqual(error.details, {
        amount: ["Amount is required"],
      });
      return true;
    },
  );
});

test("apiRequest rejects invalid JSON payloads", async () => {
  globalThis.fetch = async () =>
    new Response("<html>error</html>", {
      status: 502,
      headers: {
        "Content-Type": "text/html",
      },
    });

  await assert.rejects(
    () => apiRequest("/api/test"),
    (error: unknown) => {
      assert.ok(error instanceof ApiRequestError);
      assert.equal(error.code, "INVALID_JSON");
      assert.equal(error.status, 502);
      return true;
    },
  );
});
