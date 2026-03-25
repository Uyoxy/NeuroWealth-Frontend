import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: "🤖",
    title: "AI Agent",
    desc: "Autonomous 24/7 yield optimization across Stellar DeFi protocols.",
  },
  {
    icon: "💬",
    title: "Natural Language",
    desc: "Chat to deposit, withdraw, and check balances — no DeFi knowledge needed.",
  },
  {
    icon: "📈",
    title: "Auto-Rebalancing",
    desc: "The agent shifts funds to the best opportunities automatically, hourly.",
  },
  {
    icon: "🔐",
    title: "Non-Custodial",
    desc: "Your funds live in audited Soroban smart contracts. Always yours.",
  },
  {
    icon: "⚡",
    title: "Instant Withdrawals",
    desc: "No lock-ups, no penalties. Withdraw anytime in seconds.",
  },
  {
    icon: "🌍",
    title: "Global Access",
    desc: "No geographic restrictions, no bank account required.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Everything you need</h2>
        <p className="mt-3 text-slate-400">
          Simple on the surface, powerful underneath.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="flex flex-col gap-3">
            <span className="text-2xl">{f.icon}</span>
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="text-sm text-slate-400">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
