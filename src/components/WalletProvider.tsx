"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

interface WalletContextType {
  connected: boolean;
  account: { address: string } | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  network: string | null;
  walletName: string | null;
  showInstallPrompt: boolean;
  dismissInstallPrompt: () => void;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  account: null,
  connect: async () => {},
  disconnect: () => {},
  network: null,
  walletName: null,
  showInstallPrompt: false,
  dismissInstallPrompt: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

/** Detect which wallet provider is available */
function getWalletProvider(): { provider: any; name: string } | null {
  if (typeof window === "undefined") return null;

  // Petra injects as window.petra or window.aptos
  if ((window as any).petra) {
    return { provider: (window as any).petra, name: "Petra" };
  }
  if ((window as any).aptos) {
    return { provider: (window as any).aptos, name: "Aptos" };
  }
  // Pontem wallet
  if ((window as any).pontem) {
    return { provider: (window as any).pontem, name: "Pontem" };
  }
  // Martian wallet
  if ((window as any).martian) {
    return { provider: (window as any).martian, name: "Martian" };
  }

  return null;
}

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<{ address: string } | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Check if already connected on mount
  useEffect(() => {
    // Small delay to let wallet extensions inject into window
    const timer = setTimeout(async () => {
      try {
        const wallet = getWalletProvider();
        if (wallet) {
          const isConnected = await wallet.provider.isConnected?.();
          if (isConnected) {
            const acc = await wallet.provider.account();
            const address =
              acc?.address ||
              acc?.account?.address ||
              (typeof acc === "string" ? acc : "");
            if (address) {
              setAccount({ address });
              setConnected(true);
              setWalletName(wallet.name);
              try {
                const net = await wallet.provider.network();
                setNetwork(net?.name || net || "shelbynet");
              } catch {
                setNetwork("shelbynet");
              }
            }
          }
        }
      } catch {
        // Not connected — no-op
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const connect = useCallback(async () => {
    try {
      const wallet = getWalletProvider();

      if (!wallet) {
        // No wallet detected — show install prompt instead of window.open
        setShowInstallPrompt(true);
        return;
      }

      const response = await wallet.provider.connect();
      const address =
        response?.address ||
        response?.account?.address ||
        (typeof response === "string" ? response : "");

      if (!address) {
        throw new Error(
          "Connected but no address returned. Please try again."
        );
      }

      setAccount({ address });
      setConnected(true);
      setWalletName(wallet.name);

      try {
        const net = await wallet.provider.network();
        setNetwork(net?.name || net || "shelbynet");
      } catch {
        setNetwork("shelbynet");
      }
    } catch (err: any) {
      // User rejected the connection — not an error
      if (
        err?.code === 4001 ||
        err?.message?.includes("rejected") ||
        err?.message?.includes("cancelled")
      ) {
        return;
      }
      console.error("Wallet connection failed:", err);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      const wallet = getWalletProvider();
      if (wallet) {
        await wallet.provider.disconnect?.();
      }
    } catch {}
    setConnected(false);
    setAccount(null);
    setNetwork(null);
    setWalletName(null);
  }, []);

  const dismissInstallPrompt = useCallback(() => {
    setShowInstallPrompt(false);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connected,
        account,
        connect,
        disconnect,
        network,
        walletName,
        showInstallPrompt,
        dismissInstallPrompt,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
