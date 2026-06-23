"use client";

import { Suspense, useEffect, useState } from "react";
import {
  BarChart2,
  Wallet,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import PortfolioLoading from "./loading";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSandbox } from "@/contexts/SandboxContext";
import { TableSkeleton } from "@/components/ui/Skeleton";

export const dynamic = "force-dynamic";

const MOCK_HOLDINGS = [
  { symbol: "XLM", name: "Stellar Lumens", balance: "4,250.00", value: "$573.75", change: "+2.4%", up: true, alloc: 38 },
  { symbol: "USDC", name: "USD Coin", balance: "620.00", value: "$620.00", change: "0.0%", up: true, alloc: 42 },
  { symbol: "EURT", name: "Euro Token", balance: "240.50", value: "$261.34", change: "-0.3%", up: false, alloc: 18 },
  { symbol: "BTC", name: "Bitcoin", balance: "0.0042", value: "$241.08", change: "+1.1%", up: true, alloc: 2 },
];

const MOCK_STATS = [
  { label: "Total Balance", value: "$1,696.17", sub: "+3.2% this month" },
  { label: "Unrealised P&L", value: "+$52.40", sub: "since last rebalance" },
  { label: "Yield Earned", value: "$18.24", sub: "last 30 days" },
];

function PortfolioPopulated() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-text-primary">Portfolio</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Detailed breakdown of your holdings and yield performance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MOCK_STATS.map((s) => (
          <div key={s.label} className="card">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wide">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{s.value}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Balance Over Time</h2>
        <div className="flex items-center justify-center h-48 rounded-lg bg-surface-elevated">
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <BarChart2 className="h-8 w-8 opacity-40" aria-hidden="true" />
            <span className="text-xs">Chart component — Issue 5</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Portfolio holdings">
            <thead>
              <tr className="border-b border-surface-border text-left">
                {["Asset", "Balance", "Value", "24h", "Allocation"].map((h) => (
                  <th key={h} className={`pb-3 text-xs font-semibold text-text-muted uppercase tracking-wide${h !== "Asset" ? " text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {MOCK_HOLDINGS.map((h) => (
                <tr key={h.symbol} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-sky-500/15 flex items-center justify-center text-sky-400 text-xs font-bold">{h.symbol[0]}</div>
                      <div>
                        <p className="font-medium text-text-primary">{h.symbol}</p>
                        <p className="text-xs text-text-muted">{h.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right text-text-secondary">{h.balance}</td>
                  <td className="py-3 text-right font-medium text-text-primary">{h.value}</td>
                  <td className={`py-3 text-right text-xs font-semibold ${h.up ? "text-emerald-400" : "text-red-400"}`}>{h.change}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                        <div className="h-full rounded-full bg-sky-500" style={{ width: `${h.alloc}%` }} />
                      </div>
                      <span className="text-xs text-text-muted w-8 text-right">{h.alloc}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PortfolioContent() {
  const { getCurrentScenario, isSandboxMode } = useSandbox();
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState<string | null>(null);
  const scenario = getCurrentScenario("portfolio");

  useEffect(() => {
    setSimError(null);
    if (scenario === "loading") {
      setSimLoading(true);
      const t = setTimeout(() => setSimLoading(false), 3000);
      return () => clearTimeout(t);
    } else if (scenario === "timeout") {
      setSimLoading(true);
      const t = setTimeout(() => {
        setSimLoading(false);
        setSimError("Request timed out. Check your connection and try again.");
      }, 5000);
      return () => clearTimeout(t);
    } else {
      setSimLoading(false);
    }
  }, [scenario]);

  return (
    <div className={`px-6 pt-8${scenario === "empty" ? " min-h-[60vh] flex flex-col" : ""}`}>
      {isSandboxMode && (
        <div className="mb-4">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Sandbox: {scenario}
          </span>
        </div>
      )}

      {simLoading && <PortfolioLoading />}

      {!simLoading && simError && (
        <div className="card flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary mb-1">Failed to load portfolio</h2>
            <p className="max-w-[420px] text-sm text-text-secondary">{simError}</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-elevated text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      )}

      {!simLoading && !simError && scenario === "empty" && (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Wallet className="h-8 w-8" aria-hidden="true" />}
            heading="No portfolio data yet"
            body="Connect your Stellar wallet and make your first deposit to see your holdings, performance charts, and yield breakdown here."
            ctaLabel="Connect wallet"
            ctaHref="/dashboard"
          />
        </div>
      )}

      {!simLoading && !simError && scenario === "partial-failure" && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Portfolio</h1>
            <p className="mt-1 text-sm text-text-secondary">Detailed breakdown of your holdings and yield performance.</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-300">Some portfolio data could not be loaded. Showing partial results — try refreshing.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card">
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide">{MOCK_STATS[0].label}</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">{MOCK_STATS[0].value}</p>
              <p className="mt-0.5 text-xs text-text-secondary">{MOCK_STATS[0].sub}</p>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="card opacity-40 animate-pulse">
                <div className="h-3 w-24 rounded bg-surface-elevated mb-3" />
                <div className="h-7 w-32 rounded bg-surface-elevated mb-2" />
                <div className="h-3 w-20 rounded bg-surface-elevated" />
              </div>
            ))}
          </div>
          <div className="card">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Holdings</h2>
            <TableSkeleton rows={3} cols={5} />
          </div>
        </div>
      )}

      {!simLoading && !simError && scenario === "success" && <PortfolioPopulated />}
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="px-6 pt-8"><PortfolioLoading /></div>}>
      <PortfolioContent />
    </Suspense>
  );
}
