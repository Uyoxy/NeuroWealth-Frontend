"use client";

import { useState } from "react";

export default function TriggerBoundaryError() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Intentional client render error for ErrorBoundary testing");
  }

  return (
    <button
      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-dark-900"
      onClick={() => setShouldThrow(true)}
      type="button"
    >
      Trigger client error
    </button>
  );
}
