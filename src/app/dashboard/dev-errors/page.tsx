import Link from "next/link";
import { notFound } from "next/navigation";

const DEV_ERRORS_ENABLED = process.env.NODE_ENV !== "production";

export default function DashboardDevErrorsPage() {
  if (!DEV_ERRORS_ENABLED) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-text-primary">
          Dashboard error boundary dev routes
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          These routes intentionally trigger errors so we can verify route-level and client-boundary recovery.
        </p>
      </header>
      <ul className="list-disc pl-5 text-sm text-text-primary space-y-2">
        <li>
          <Link className="text-primary hover:underline" href="/dashboard/dev-errors/route-error">
            Trigger route-level error
          </Link>
        </li>
        <li>
          <Link className="text-primary hover:underline" href="/dashboard/dev-errors/boundary-error">
            Trigger client ErrorBoundary fallback
          </Link>
        </li>
      </ul>
    </main>
  );
}
