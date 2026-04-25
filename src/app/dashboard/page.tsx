import { Suspense } from "react";
import { PortfolioDashboard } from "@/components/dashboard/PortfolioDashboard";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — NeuroWealth" };

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<DashboardSkeleton />}>
        <PortfolioDashboard />
      </Suspense>
    </ProtectedRoute>
  );
}
