"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface WalletContextType {
  connected: boolean;
  account: { address: string } | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  network: string | null;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  account: null,
  connect: async () => {},
  disconnect: () => {},
  network: null,
});

export function useWallet() {
  return useContext(WalletContext);
}

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<{ address: string } | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== "undefined" && (window as any).aptos) {
          const response = await (window as any).aptos.isConnected();
          if (response) {
            const acc = await (window as any).aptos.account();
            setAccount({ address: acc.address });
            setConnected(true);
            try {
              const net = await (window as any).aptos.network();
              setNetwork(net);
            } catch {
              setNetwork("shelbynet");
            }
          }
        }
      } catch {
        // Not connected
      }
    };
    checkConnection();
  }, []);

  const connect = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && (window as any).aptos) {
        const response = await (window as any).aptos.connect();
        setAccount({ address: response.address });
        setConnected(true);
        try {
          const net = await (window as any).aptos.network();
          setNetwork(net);
        } catch {
          setNetwork("shelbynet");
        }
      } else if (typeof window !== "undefined" && (window as any).petra) {
        const response = await (window as any).petra.connect();
        setAccount({ address: response.address });
        setConnected(true);
        setNetwork("shelbynet");
      } else {
        window.open("https://petra.app/", "_blank");
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      if (typeof window !== "undefined" && (window as any).aptos) {
        (window as any).aptos.disconnect();
      }
    } catch {}
    setConnected(false);
    setAccount(null);
    setNetwork(null);
  }, []);

  return (
    <WalletContext.Provider value={{ connected, account, connect, disconnect, network }}>
      {children}
    </WalletContext.Provider>
  );
}
