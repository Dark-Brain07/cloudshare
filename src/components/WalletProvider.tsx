"use client";

import React from "react";
import {
  AptosWalletAdapterProvider,
} from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

/**
 * Wraps the app with AptosWalletAdapterProvider.
 * Supports AIP-62 auto-detection — any compatible wallet
 * (Petra, Pontem, Martian, etc.) is discovered automatically.
 */
export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: Network.TESTNET,
        aptosApiKeys: {
          [Network.TESTNET]: process.env.NEXT_PUBLIC_SHELBY_API_KEY,
        },
      }}
      onError={(error) => {
        console.error("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
