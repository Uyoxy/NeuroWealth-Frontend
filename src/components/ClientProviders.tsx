"use client";

import dynamic from "next/dynamic";

// Prevent WalletProvider (and its wallet-kit dep) from running on the server.
// wallet-kit accesses `window` at import time → crashes SSR prerender.
const WalletProvider = dynamic(
  () => import("@/contexts").then((m) => m.WalletProvider),
  { ssr: false },
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
