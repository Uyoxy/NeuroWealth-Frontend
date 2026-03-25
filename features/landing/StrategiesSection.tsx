import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const strategies = [
  {
    name: "Conservative",
    apy: "3–6%",
    risk: "Low",
    desc: "Stablecoin lending on Blend. Steady, predictable returns.",
    color: "text-blue-400",
    border: "border-blue-500/20",
  },
  {
    name: "Balanced",
    apy: "6–10%",
    risk: "Medium",
    desc: "Mix of lending and DEX liquidity provision for better yield.",
    color: "text-green-400",
    border: "border-green-500/20",
    featured: true,
  },
  {
    name: "Growth",
    apy: "10–15%",
    risk: "Higher",
    desc: "Aggressive multi-protocol deployment for maximum returns.",
    color: "text-orange-400",
    border: "border-orange-500/20",
  },
];

export function StrategiesSection() {
  return (
    <section id="strategies" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Choose your strategy</h2>
        <p className="mt-3 text-slate-400">
          Pick your risk appetite. The AI handles the rest.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {strategies.map((s) => (
          <Card
            key={s.name}
            glow={s.featured}
            className={`flex flex-col gap-4 border ${s.border} ${s.featured ? "scale-105" : ""}`}
          >
            {s.featured && (
              <span className="self-start rounded-full bg-green-500/20 px-3 py-0.5 text-xs font-medium text-green-400">
                Most popular
              </span>
            )}
            <div>
              <h3 className={`text-xl font-bold ${s.color}`}>{s.name}</h3>
              <p className="mt-1 text-3xl font-bold text-white">{s.apy}</p>
              <p className="text-xs text-slate-500">APY · {s.risk} risk</p>
            </div>
            <p className="flex-1 text-sm text-slate-400">{s.desc}</p>
            <Button variant={s.featured ? "primary" : "secondary"} className="w-full">
              Select {s.name}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
