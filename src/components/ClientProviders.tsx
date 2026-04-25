"use client";
import { ReactNode } from "react";
import { Networks } from "@stellar/stellar-sdk";
import { AuthProvider } from "@/contexts";
import { WalletProvider } from "@/contexts";
import { I18nProvider } from "@/contexts/I18nContext";
import { SandboxProvider } from "@/contexts/SandboxContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ToastProvider } from "@/components/notifications/ToastProvider";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { CookieBanner, PrivacyModal } from "@/components/cookie";

function resolveStellarConfig() {
  const rawNetwork = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet").toLowerCase();
  const isMainnet = rawNetwork === "mainnet" || rawNetwork === "public";
  const network = isMainnet ? Networks.PUBLIC : Networks.TESTNET;
  const fallbackHorizonUrl = isMainnet
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

  return {
    network,
    horizonUrl: process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || fallbackHorizonUrl,
  };
}

export function ClientProviders({ children }: { children: ReactNode }) {
  const walletConfig = resolveStellarConfig();

  return (
    <SandboxProvider>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <WalletProvider
              network={walletConfig.network}
              horizonUrl={walletConfig.horizonUrl}
            >
              <ToastProvider>
                <CookieConsentProvider>
                  {children}
                  <CookieBanner />
                  <PrivacyModal />
                </CookieConsentProvider>
              </ToastProvider>
            </WalletProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </SandboxProvider>
  );
}
