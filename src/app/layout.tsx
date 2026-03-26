import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts";
import { ClientProviders } from "@/components/ClientProviders";

export const metadata: Metadata = {
  metadataBase: new URL("https://neurowealth.app"),
  title: {
    default: "NeuroWealth — AI-Powered Yield on Stellar",
    template: "%s | NeuroWealth",
  },
  description:
    "NeuroWealth is an autonomous AI agent that deploys your USDC into the highest-yielding DeFi opportunities on Stellar — automatically, 24/7. No DeFi knowledge required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        {/* WalletProvider is loaded client-side only (ssr:false) to prevent
            @creit.tech/stellar-wallets-kit from accessing `window` at SSR time */}
        <ClientProviders>
          <AuthProvider>{children}</AuthProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
