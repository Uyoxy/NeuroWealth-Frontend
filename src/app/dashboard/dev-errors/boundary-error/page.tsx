import { notFound } from "next/navigation";
import TriggerBoundaryError from "./TriggerBoundaryError";

const DEV_ERRORS_ENABLED = process.env.NODE_ENV !== "production";

export default function DashboardBoundaryErrorPage() {
  if (!DEV_ERRORS_ENABLED) {
    notFound();
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold text-text-primary">
        Client boundary error trigger
      </h1>
      <p className="text-sm text-text-secondary">
        Click the button below to throw an intentional render error inside the global ErrorBoundary.
      </p>
      <TriggerBoundaryError />
    </main>
  );
}
