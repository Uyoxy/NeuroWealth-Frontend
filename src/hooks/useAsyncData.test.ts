import assert from "node:assert/strict";
import test from "node:test";

import { ApiRequestError } from "@/lib/api-client";
import { formatAsyncErrorMessage } from "@/hooks/useAsyncData";

test("formatAsyncErrorMessage returns actionable copy for REQUEST_TIMEOUT", () => {
  const error = new ApiRequestError("Request timed out. Please try again.", {
    code: "REQUEST_TIMEOUT",
    status: 408,
  });

  const message = formatAsyncErrorMessage(error);
  assert.match(message ?? "", /took too long/i);
});

test("formatAsyncErrorMessage returns actionable copy for NETWORK_ERROR", () => {
  const error = new ApiRequestError("Unable to reach the service right now.", {
    code: "NETWORK_ERROR",
    status: 503,
  });

  const message = formatAsyncErrorMessage(error);
  assert.match(message ?? "", /unable to reach/i);
});

test("formatAsyncErrorMessage returns null for AbortError", () => {
  const error = new DOMException("The operation was aborted.", "AbortError");
  assert.equal(formatAsyncErrorMessage(error), null);
});
