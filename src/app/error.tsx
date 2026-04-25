"use client";

import { AlertTriangle } from "lucide-react";
import { ErrorPage } from "@/components/ui/ErrorPage";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      statusCode={500}
      title="We ran into an unexpected issue"
      description="The page could not finish loading. Your account and funds remain safe. Try again now or return home."
      icon={<AlertTriangle size={32} />}
      primaryAction={{ label: "Back to home", href: "/" }}
      secondaryAction={{ label: "Try again", onClick: reset }}
    />
  );
}
