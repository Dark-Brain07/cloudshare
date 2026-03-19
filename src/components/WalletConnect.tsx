"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/WalletProvider";

export default function WalletConnect() {
  const { connect, disconnect, account, connected } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const address = account?.address || "";

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (connected && account) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="btn-secondary group"
          id="wallet-connected-btn"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs">
            {truncateAddress(address)}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 glass-card p-3 animate-fade-in z-50">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-[var(--color-text-muted)]">
                Connected with
              </p>
              <p className="text-sm font-medium text-[var(--color-text-primary)] mt-0.5">
                Petra Wallet
              </p>
              <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1 break-all">
                {address}
              </p>
            </div>
            <div className="border-t border-[var(--color-border)] pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(address);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-white/5 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy Address
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="btn-secondary"
      id="connect-wallet"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      </svg>
      Connect Wallet
    </button>
  );
}
