"use client";

import React, { type ReactNode } from "react";
import {
  AptosWalletAdapterProvider,
  useWallet as useAptosWallet,
} from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";

// Re-export useWallet so existing imports keep working
export function useWallet() {
  const wallet = useAptosWallet();
  return {
    connected: wallet.connected,
    account: wallet.account ? { address: wallet.account.address?.toString() || "" } : null,
    connect: wallet.connect,
    disconnect: wallet.disconnect,
    network: wallet.network?.name || null,
    walletName: wallet.wallet?.name || null,
    wallet: wallet.wallet,
    wallets: wallet.wallets,
  };
}

const wallets = [new PetraWallet()];

export default function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
