/**
 * useAsyncData
 *
 * Drop-in hook for any async data fetch that needs loading / error / data states.
 * Prevents the "infinite skeleton" bug by always transitioning out of loading —
 * whether the fetch succeeds or fails.
 *
 * Passes an AbortSignal to the fetcher so in-flight requests are cancelled on
 * unmount or when dependencies change. Wire the signal into apiRequest({ signal }).
 *
 * Usage:
 *   const { data, loading, error, errorMessage, retry } = useAsyncData(
 *     (signal) => apiRequest<Portfolio>("/api/portfolio", { signal }),
 *     [userId],
 *   );
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  DependencyList,
} from "react";
import { ApiRequestError } from "@/lib/api-client";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  loading: boolean;
  error: Error | null;
  /** User-facing message derived from error (null for aborted requests). */
  errorMessage: string | null;
  /** Re-run the fetch manually (e.g. from a Retry button) */
  retry: () => void;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/**
 * Maps fetch errors to actionable UI copy. Returns null for aborted requests
 * so callers can skip rendering an error banner.
 */
export function formatAsyncErrorMessage(error: Error | null): string | null {
  if (!error) return null;

  if (error instanceof ApiRequestError) {
    switch (error.code) {
      case "REQUEST_TIMEOUT":
        return "The request took too long. Check your connection and try again.";
      case "NETWORK_ERROR":
        return "Unable to reach the service right now. Please try again shortly.";
      default:
        return error.message;
    }
  }

  if (isAbortError(error)) {
    return null;
  }

  return error.message;
}

/**
 * @param fetcher  Async function receiving an AbortSignal. Pass the signal to
 *                 apiRequest or fetch so requests cancel on unmount/deps change.
 * @param deps     Re-fetch whenever these values change (like useEffect deps).
 */
export function useAsyncData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList = [],
): AsyncState<T> {
  const [state, setState] = useState<Omit<AsyncState<T>, "retry" | "errorMessage">>({
    data: null,
    status: "idle",
    loading: false,
    error: null,
  });

  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const [attempt, setAttempt] = useState(0);

  const run = useCallback(async () => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({
      ...prev,
      status: "loading",
      loading: true,
      error: null,
    }));

    try {
      const data = await fetcher(controller.signal);
      if (controller.signal.aborted || !mountedRef.current) return;
      setState({ data, status: "success", loading: false, error: null });
    } catch (err) {
      if (controller.signal.aborted || !mountedRef.current) return;
      const error = err instanceof Error ? err : new Error(String(err));
      setState((prev) => ({
        ...prev,
        data: prev.data,
        status: "error",
        loading: false,
        error,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, attempt, ...deps]);

  useEffect(() => {
    run();
    return () => {
      abortRef.current?.abort();
    };
  }, [run]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    ...state,
    errorMessage: formatAsyncErrorMessage(state.error),
    retry,
  };
}
