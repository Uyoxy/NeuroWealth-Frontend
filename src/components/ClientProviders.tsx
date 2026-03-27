"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts";
import { WalletProvider } from "@/contexts";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WalletProvider>{children}</WalletProvider>
    </AuthProvider>
  );
}
