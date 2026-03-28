"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts";
import { WalletProvider } from "@/contexts";
import { I18nProvider } from "@/contexts/I18nContext";
import { SandboxProvider } from "@/contexts/SandboxContext";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SandboxProvider>
      <I18nProvider>
        <AuthProvider>
          <WalletProvider>{children}</WalletProvider>
        </AuthProvider>
      </I18nProvider>
    </SandboxProvider>
  );
}
