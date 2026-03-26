export default function DashboardLoading() {
  return (
    <div
      id="main-content"
      className="min-h-screen bg-dark-900 p-6"
      aria-label="Loading dashboard"
      aria-busy="true"
    >
      {/* Header skeleton */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-white/5" />

        {/* Stats row skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/5 bg-dark-800/50 p-6">
              <div className="mb-3 h-3 w-24 animate-pulse rounded bg-white/5" />
              <div className="h-7 w-32 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>

        {/* Chart area skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-dark-800/50 p-6">
            <div className="mb-4 h-4 w-32 animate-pulse rounded bg-white/5" />
            <div className="h-64 animate-pulse rounded-xl bg-white/5" />
          </div>
          <div className="rounded-2xl border border-white/5 bg-dark-800/50 p-6">
            <div className="mb-4 h-4 w-28 animate-pulse rounded bg-white/5" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-white/5" />
                  <div className="h-3 flex-1 animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-10 animate-pulse rounded bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
