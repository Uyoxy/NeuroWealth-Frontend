"use client";

/**
 * ProtectedRoute
 *
 * Client-side guard for routes that need a signed-in user.
 * Uses `useAuth` (which reads from the same SESSION_STORAGE_KEY as
 * middleware's cookie) so there is exactly one place that knows what
 * "logged in" means for the browser side.
 *
 * Middleware handles the server-side redirect; this component handles
 * the client-side flash while hydration is in progress.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts";
import { SIGN_IN_PATH } from "@/lib/auth-constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Override the redirect target (defaults to SIGN_IN_PATH) */
  redirectTo?: string;
  /** Shown while the auth state is being hydrated from storage */
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  redirectTo = SIGN_IN_PATH,
  fallback = null,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`,
      );
    }
  }, [loading, user, router, redirectTo]);

  // Still hydrating — render fallback (or nothing) to avoid flash
  if (loading) return <>{fallback}</>;

  // Not authenticated — redirect is in-flight, render nothing
  if (!user) return null;

  return <>{children}</>;
}
