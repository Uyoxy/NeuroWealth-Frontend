import { notFound } from "next/navigation";

const DEV_ERRORS_ENABLED = process.env.NODE_ENV !== "production";

export default function DashboardRouteErrorPage() {
  if (!DEV_ERRORS_ENABLED) {
    notFound();
  }

  throw new Error("Intentional dashboard route error for boundary testing");
}
