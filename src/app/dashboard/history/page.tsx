import { TransactionHistory } from "@/components/transactions/TransactionHistory";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Suspense } from "react";

export const metadata = {
  title: "Transaction History",
  description: "Review your deposits, withdrawals, and rebalancing activity.",
};

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <TransactionHistory />
      </Suspense>
    </ProtectedRoute>
  );
}
