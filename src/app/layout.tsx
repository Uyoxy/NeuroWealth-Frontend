import type { Metadata } from "next";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DiagnosticsPanel } from "@/components/diagnostics/DiagnosticsPanel";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://neurowealth.app"),
  title: {
    default: "NeuroWealth — AI-Powered Yield on Stellar",
    template: "%s | NeuroWealth",
  },
  description:
    "NeuroWealth is an autonomous AI agent that deploys your USDC into the highest-yielding DeFi opportunities on Stellar — automatically, 24/7. No DeFi knowledge required.",
  keywords: [
    "DeFi",
    "Stellar",
    "yield farming",
    "AI agent",
    "USDC",
    "automated investing",
    "Soroban",
    "blockchain",
    "passive income",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NeuroWealth",
    title: "NeuroWealth — AI-Powered Yield on Stellar",
    description:
      "Autonomous AI yield optimization on Stellar DeFi. Deposit USDC, earn automatically.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NeuroWealth — AI-Powered Yield on Stellar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroWealth — AI-Powered Yield on Stellar",
    description:
      "Autonomous AI yield optimization on Stellar DeFi. Deposit USDC, earn automatically.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased font-sans bg-dark-900 text-slate-200">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-sky-500 focus:text-white focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <ErrorBoundary>
            {children}
            <DiagnosticsPanel />
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
