import { Skeleton, StatCardSkeleton, AllocationWidgetSkeleton } from "@/components/ui/Skeleton";

export default function PortfolioLoading() {
  return (
    <div className="space-y-6 animate-fade-in" aria-busy="true" aria-label="Loading portfolio">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
      </div>
      {/* Chart placeholder */}
      <div className="card">
        <Skeleton height={14} width="36%" style={{ marginBottom: 20 }} />
        <Skeleton height={192} width="100%" radius={8} />
      </div>
      {/* Allocation */}
      <AllocationWidgetSkeleton />
    </div>
  );
}
