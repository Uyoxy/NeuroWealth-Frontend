const steps = [
  {
    n: "01",
    title: "Deposit USDC",
    desc: "Connect your Freighter wallet and deposit USDC into the NeuroWealth vault.",
  },
  {
    n: "02",
    title: "AI deploys funds",
    desc: "The agent detects your deposit and immediately deploys to the best protocol.",
  },
  {
    n: "03",
    title: "Yield accumulates",
    desc: "Earnings compound 24/7. The agent rebalances hourly if better rates appear.",
  },
  {
    n: "04",
    title: "Withdraw anytime",
    desc: "Request a withdrawal — funds arrive in your wallet within seconds.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white/[0.02] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white">How it works</h2>
          <p className="mt-3 text-slate-400">Four steps to passive yield.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative flex flex-col gap-4">
              {/* connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-8 top-8 hidden h-px w-full bg-gradient-to-r from-green-500/40 to-transparent md:block" />
              )}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-lg font-bold text-green-400">
                {s.n}
              </div>
              <h3 className="font-semibold text-white">{s.title}</h3>
              <p className="text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
