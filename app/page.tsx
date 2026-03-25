import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/features/landing/HeroSection";
import { FeaturesSection } from "@/features/landing/FeaturesSection";
import { HowItWorksSection } from "@/features/landing/HowItWorksSection";
import { StrategiesSection } from "@/features/landing/StrategiesSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StrategiesSection />
      </main>
      <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} NeuroWealth · Built on Stellar
      </footer>
    </>
  );
}
