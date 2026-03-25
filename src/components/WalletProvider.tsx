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
  isConnecting: boolean;
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
  isConnecting: false,
});

export function useWallet() {
  return useContext(WalletContext);
}

/** Detect which wallet provider is available */
function getWalletProvider(): { provider: any; name: string } | null {
  if (typeof window === "undefined") return null;

  // Check all known Aptos wallet injections
  const w = window as any;

  // Petra wallet — older versions use window.petra, newer use window.aptos
  if (w.petra) return { provider: w.petra, name: "Petra" };
  if (w.aptos) return { provider: w.aptos, name: "Aptos Wallet" };
  if (w.pontem) return { provider: w.pontem, name: "Pontem" };
  if (w.martian) return { provider: w.martian, name: "Martian" };
  if (w.fewcha) return { provider: w.fewcha, name: "Fewcha" };
  if (w.rise) return { provider: w.rise, name: "Rise" };

  return null;
}

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<{ address: string } | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Extract address from whatever the wallet returns
  const extractAddress = (response: any): string => {
    if (!response) return "";
    if (typeof response === "string") return response;
    if (response.address) return String(response.address);
    if (response.account?.address) return String(response.account.address);
    if (response.publicKey) return String(response.publicKey);
    return "";
  };

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      // Retry a few times since wallet extensions may inject late
      for (let attempt = 0; attempt < 3; attempt++) {
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
        try {
          const wallet = getWalletProvider();
          if (!wallet) continue;

          // Some wallets use isConnected(), others use isConnected as a property
          let isConn = false;
          if (typeof wallet.provider.isConnected === "function") {
            isConn = await wallet.provider.isConnected();
          } else if (wallet.provider.isConnected) {
            isConn = true;
          }

          if (isConn) {
            const acc = await wallet.provider.account();
            const address = extractAddress(acc);
            if (address) {
              setAccount({ address });
              setConnected(true);
              setWalletName(wallet.name);
              try {
                const net = await wallet.provider.network();
                setNetwork(typeof net === "string" ? net : net?.name || "shelbynet");
              } catch {
                setNetwork("shelbynet");
              }
              return; // Already connected, stop retrying
            }
          }
        } catch {
          // Extension not ready yet, retry
        }
      }
    };
    checkConnection();
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);

    try {
      // Give wallet extension a moment to inject if page just loaded
      let wallet = getWalletProvider();

      // If not found on first try, wait and retry once
      if (!wallet) {
        await new Promise((r) => setTimeout(r, 500));
        wallet = getWalletProvider();
      }

      if (!wallet) {
        // Definitely no wallet extension
        setShowInstallPrompt(true);
        setIsConnecting(false);
        return;
      }

      // Call the wallet's connect method — this should trigger the extension popup
      const response = await wallet.provider.connect();
      const address = extractAddress(response);

      if (!address) {
        // Some wallets return void from connect() and you need to call account() separately
        try {
          const acc = await wallet.provider.account();
          const addr = extractAddress(acc);
          if (addr) {
            setAccount({ address: addr });
            setConnected(true);
            setWalletName(wallet.name);
          } else {
            throw new Error("No address returned from wallet");
          }
        } catch (accErr) {
          console.error("Failed to get account after connect:", accErr);
          setIsConnecting(false);
          return;
        }
      } else {
        setAccount({ address });
        setConnected(true);
        setWalletName(wallet.name);
      }

      // Get network info
      try {
        const net = await wallet.provider.network();
        setNetwork(typeof net === "string" ? net : net?.name || "shelbynet");
      } catch {
        setNetwork("shelbynet");
      }
    } catch (err: any) {
      // User rejected — not a real error
      if (
        err?.code === 4001 ||
        err?.message?.toLowerCase?.()?.includes("reject") ||
        err?.message?.toLowerCase?.()?.includes("cancel") ||
        err?.message?.toLowerCase?.()?.includes("denied")
      ) {
        // User cancelled, do nothing
      } else {
        console.error("Wallet connection error:", err);
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      const wallet = getWalletProvider();
      if (wallet?.provider?.disconnect) {
        await wallet.provider.disconnect();
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
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
