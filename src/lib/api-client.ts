import type { ApiErrorResponse, ApiResponse } from "@/lib/api-response";

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  baseUrl?: string;
  body?: BodyInit | Record<string, unknown> | null;
  timeoutMs?: number;
}

export class ApiRequestError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, string | string[]>;

  constructor(
    message: string,
    options: {
      code: string;
      status: number;
      details?: Record<string, string | string[]>;
    },
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}

function isApiErrorResponse(payload: unknown): payload is ApiErrorResponse {
  if (typeof payload !== "object" || payload == null) {
    return false;
  }

  const candidate = payload as Partial<ApiErrorResponse>;
  return (
    candidate.success === false &&
    typeof candidate.error?.code === "string" &&
    typeof candidate.error?.message === "string"
  );
}

function isAbortLikeError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function resolveRequestUrl(pathOrUrl: string, baseUrl?: string): string {
  if (!baseUrl) {
    return pathOrUrl;
  }

  return new URL(pathOrUrl, baseUrl).toString();
}

function mergeSignalWithTimeout(
  signal: AbortSignal | null,
  timeoutMs: number,
): {
  signal: AbortSignal;
  cancel: () => void;
  wasTimedOut: () => boolean;
} {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let timedOut = false;

  const onExternalAbort = () => controller.abort(signal?.reason);

  if (signal) {
    if (signal.aborted) {
      controller.abort(signal.reason);
    } else {
      signal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort(new Error("Request timed out"));
    }, timeoutMs);
  }

  return {
    signal: controller.signal,
    wasTimedOut: () => timedOut,
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      signal?.removeEventListener("abort", onExternalAbort);
    },
  };
}

function toJsonBody(body: ApiRequestOptions["body"]): BodyInit | null | undefined {
  if (
    body == null ||
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  ) {
    return body as BodyInit | null | undefined;
  }

  return JSON.stringify(body);
}

export async function apiRequest<T>(
  pathOrUrl: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    baseUrl,
    timeoutMs = 10000,
    body,
    headers,
    signal,
    ...rest
  } = options;

  const resolvedUrl = resolveRequestUrl(pathOrUrl, baseUrl);
  const timeout = mergeSignalWithTimeout(signal ?? null, timeoutMs);

  const nextHeaders = new Headers(headers);
  const nextBody = toJsonBody(body);

  if (
    nextBody &&
    typeof nextBody === "string" &&
    !nextHeaders.has("Content-Type")
  ) {
    nextHeaders.set("Content-Type", "application/json");
  }

  if (!nextHeaders.has("Accept")) {
    nextHeaders.set("Accept", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(resolvedUrl, {
      ...rest,
      headers: nextHeaders,
      body: nextBody,
      signal: timeout.signal,
    });
  } catch (error) {
    timeout.cancel();

    if (isAbortLikeError(error) && timeout.wasTimedOut()) {
      throw new ApiRequestError("Request timed out. Please try again.", {
        code: "REQUEST_TIMEOUT",
        status: 408,
      });
    }

    throw new ApiRequestError("Unable to reach the service right now.", {
      code: "NETWORK_ERROR",
      status: 503,
    });
  }

  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    timeout.cancel();
    throw new ApiRequestError("Service returned an unreadable response.", {
      code: "INVALID_JSON",
      status: response.status || 500,
    });
  }

  timeout.cancel();

  if (isApiErrorResponse(payload)) {
    throw new ApiRequestError(payload.error.message, {
      code: payload.error.code,
      status: response.status || 500,
      details: payload.error.details,
    });
  }

  if (!payload || payload.success !== true || !("data" in payload)) {
    throw new ApiRequestError("Service returned an unexpected payload.", {
      code: "INVALID_ENVELOPE",
      status: response.status || 500,
    });
  }

  return payload.data;
}
