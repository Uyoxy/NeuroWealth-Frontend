"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./portfolio-dashboard.module.css";
import {
  PortfolioPayload,
  PortfolioScenario,
  parseScenario,
} from "@/lib/portfolio";
import {
  formatApy,
  formatCurrency,
  formatSignedCurrency,
  formatSyncLabel,
} from "@/lib/formatters";
import { ApiRequestError, apiRequest } from "@/lib/api-client";
import { useSandbox, ScenarioType } from "@/contexts/SandboxContext";
import { SummarySection, SummaryCard } from "./SummarySection";
import { AllocationSection } from "./AllocationSection";
import { ActivitySection } from "./ActivitySection";

type ThemeMode = "light" | "dark";

function getTheme(searchParams: Pick<URLSearchParams, "get">): ThemeMode {
  return searchParams.get("theme") === "dark" ? "dark" : "light";
}

function getScenario(
  searchParams: Pick<URLSearchParams, "get">,
  sandboxScenario?: PortfolioScenario,
): PortfolioScenario {
  const urlScenario = searchParams.get("scenario");
  if (sandboxScenario && process.env.NODE_ENV === "development") {
    return sandboxScenario;
  }
  return parseScenario(urlScenario);
}

function mapScenarioTypeToPortfolio(scenario: ScenarioType): PortfolioScenario {
  return scenario === "success" ? "live" : scenario;
}

function getValueTone(value: number): "positive" | "negative" | "neutral" {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function renderSourceLabel(source: PortfolioPayload["source"]) {
  if (source === "api") return "Live backend";
  if (source === "fallback") return "Fallback demo";
  return "Preview data";
}

export function PortfolioDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCurrentScenario, isSandboxMode } = useSandbox();
  const [portfolio, setPortfolio] = useState<PortfolioPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const theme = getTheme(searchParams);
  const scenario = getScenario(
    searchParams,
    mapScenarioTypeToPortfolio(getCurrentScenario("portfolio")),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadPortfolio() {
      setLoading(true);
      setError(null);

      try {
        const payload = await apiRequest<PortfolioPayload>(
          `/api/portfolio?scenario=${scenario}`,
          { cache: "no-store", signal: controller.signal, timeoutMs: 12000 },
        );
        setPortfolio(payload);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        const message =
          loadError instanceof ApiRequestError || loadError instanceof Error
            ? loadError.message
            : "Unable to load portfolio widgets.";
        setError(message);
        setPortfolio(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadPortfolio();
    return () => controller.abort();
  }, [scenario]);

  function updateParam(key: "scenario" | "theme", value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set(key, value);
    startTransition(() => {
      router.replace(`/dashboard?${nextParams.toString()}`, { scroll: false });
    });
  }

  function resetToLivePreview() {
    updateParam("scenario", "live");
  }

  const summaryCards: SummaryCard[] = portfolio
    ? [
        {
          label: "Total balance",
          value: formatCurrency(portfolio.summary.totalBalance),
          helper: "Across active positions and protected reserve holdings.",
          tone: "default",
          mono: true,
        },
        {
          label: "Total yield",
          value: formatSignedCurrency(portfolio.summary.totalYield),
          helper: "Net earnings since your first deployed deposit.",
          tone: getValueTone(portfolio.summary.totalYield),
          mono: true,
        },
        {
          label: "APY",
          value: formatApy(portfolio.summary.apy),
          helper: "Weighted live rate across the current strategy mix.",
          tone: getValueTone(portfolio.summary.apy),
          mono: true,
        },
        {
          label: "Strategy",
          value: portfolio.summary.strategyLabel,
          helper: portfolio.summary.strategyDescription,
          tone: "default",
        },
      ]
    : [];

  return (
    <div className={styles.page}>
      <section className={styles.shell} data-theme={theme}>
        <div className={styles.content}>
          {/* ── Top bar ── */}
          <div className={styles.topbar}>
            <div>
              <span className={styles.eyebrow}>
                <span className={styles.eyebrowDot} />
                Portfolio widgets
              </span>
              <h2 className={styles.heading}>NeuroWealth overview</h2>
              <p className={styles.subheading}>
                Total balance, yield, APY, strategy, allocation, and recent activity in a single
                review surface with measurable light and dark theme parity.
              </p>
            </div>

            <div className={styles.controls}>
              <div className={styles.controlCard}>
                <p className={styles.controlLabel}>Theme preview</p>
                <div className={styles.segmentGroup}>
                  {(["light", "dark"] as const).map((option) => (
                    <button
                      className={[
                        styles.segmentButton,
                        theme === option ? styles.segmentButtonActive : "",
                      ].join(" ")}
                      key={option}
                      onClick={() => updateParam("theme", option)}
                      type="button"
                    >
                      {option === "light" ? "Light mode" : "Dark mode"}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.controlCard}>
                <p className={styles.controlLabel}>Scenario preview</p>
                <div className={styles.segmentGroup}>
                  {(
                    [
                      { label: "Live widgets", value: "live" },
                      { label: "Empty states", value: "empty" },
                    ] as const
                  ).map((option) => (
                    <button
                      className={[
                        styles.segmentButton,
                        scenario === option.value ? styles.segmentButtonActive : "",
                      ].join(" ")}
                      key={option.value}
                      onClick={() => updateParam("scenario", option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Status banner ── */}
          <div className={styles.banner}>
            <div className={styles.bannerText}>
              <span className={styles.bannerTitle}>
                {portfolio?.notice ?? "Loading portfolio widget state..."}
              </span>
              <span className={styles.bannerMeta}>
                {portfolio ? formatSyncLabel(portfolio.updatedAt) : "Syncing portfolio data"}
              </span>
            </div>
            <div className={styles.bannerChips}>
              {isSandboxMode && (
                <span className={styles.chip} style={{ backgroundColor: "#10b981", color: "white" }}>
                  Sandbox: {scenario}
                </span>
              )}
              <span className={styles.chip}>Theme: {theme}</span>
              <span className={styles.chip}>
                Source: {portfolio ? renderSourceLabel(portfolio.source) : "Loading"}
              </span>
            </div>
          </div>

          {/* ── Summary metrics ── */}
          <SummarySection loading={loading} cards={summaryCards} />

          {/* ── Allocation + Activity ── */}
          <div className={styles.contentGrid}>
            <AllocationSection
              loading={loading}
              error={error}
              allocation={portfolio?.allocation ?? []}
              onRetry={resetToLivePreview}
            />
            <ActivitySection
              loading={loading}
              error={error}
              activity={portfolio?.activity ?? []}
              onRetry={resetToLivePreview}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
