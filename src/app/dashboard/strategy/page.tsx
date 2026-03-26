import { StrategySelector } from "@/components/strategies/StrategySelector";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Suspense } from "react";

export const metadata = {
  title: "Strategy",
  description: "Choose a Conservative, Balanced, or Growth yield strategy for your portfolio.",
};

export default function StrategyPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <StrategySelector />
      </Suspense>
    </ProtectedRoute>
  );
}
