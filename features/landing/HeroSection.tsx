import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />
      </div>

      <div className="relative max-w-3xl">
        <span className="mb-4 inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-medium text-green-400">
          Powered by Stellar + AI
        </span>
        <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
          Your money, working{" "}
          <span className="text-green-400">24/7</span> on autopilot
        </h1>
        <p className="mt-6 text-lg text-slate-400">
          NeuroWealth is an autonomous AI agent that finds and deploys your USDC
          into the highest-yielding opportunities on Stellar DeFi — automatically.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button className="px-8 py-3 text-base">Get Started</Button>
          <Button variant="ghost" className="px-8 py-3 text-base">
            Learn more ↓
          </Button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
          {[
            { label: "Avg. APY", value: "8.4%" },
            { label: "Finality", value: "~5s" },
            { label: "Tx Fee", value: "<$0.01" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-green-400">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
