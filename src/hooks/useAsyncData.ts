/**
 * useAsyncData
 *
 * Drop-in hook for any async data fetch that needs loading / error / data states.
 * Prevents the "infinite skeleton" bug by always transitioning out of loading —
 * whether the fetch succeeds or fails.
 *
 * Usage:
 *   const { data, loading, error, retry } = useAsyncData(fetchPortfolio, [userId]);
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  DependencyList,
} from "react";

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  loading: boolean;
  error: Error | null;
  /** Re-run the fetch manually (e.g. from a Retry button) */
  retry: () => void;
}

/**
 * @param fetcher  An async function that returns the data. Wrap in useCallback
 *                 if it closes over variables that change.
 * @param deps     Re-fetch whenever these values change (like useEffect deps).
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
): AsyncState<T> {
  const [state, setState] = useState<Omit<AsyncState<T>, "retry">>({
    data: null,
    status: "idle",
    loading: false,
    error: null,
  });

  // Use a ref to track whether the component is still mounted
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Increment this to force a re-fetch via retry()
  const [attempt, setAttempt] = useState(0);

  const run = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      status: "loading",
      loading: true,
      error: null,
    }));
    try {
      const data = await fetcher();
      if (!mountedRef.current) return;
      setState({ data, status: "success", loading: false, error: null });
    } catch (err) {
      if (!mountedRef.current) return;
      const error = err instanceof Error ? err : new Error(String(err));
      // KEY FIX: always set loading: false so skeletons never stay forever
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
  }, [run]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
