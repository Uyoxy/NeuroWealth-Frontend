"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

export function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    setLoading(true);
    setError(null);
    try {
      // Dynamically import to avoid SSR issues
      const freighter = await import("@stellar/freighter-api");
      const connected = await freighter.isConnected();
      if (!connected) {
        setError("Freighter wallet not found. Please install it.");
        return;
      }
      const { address: addr } = await freighter.getAddress();
      setAddress(addr);
    } catch (e) {
      setError("Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  }

  function truncate(addr: string) {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  }

  if (address) {
    return (
      <Button variant="secondary" onClick={() => setAddress(null)}>
        {truncate(address)}
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={connect} disabled={loading}>
        {loading ? "Connecting..." : "Connect Wallet"}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
