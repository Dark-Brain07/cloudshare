"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/WalletProvider";

const WALLETS = [
  {
    name: "Petra",
    url: "https://petra.app/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#E84142" />
        <path
          d="M12 6L7 18h3l2-5 2 5h3L12 6z"
          fill="white"
        />
      </svg>
    ),
    description: "The official Aptos wallet",
  },
  {
    name: "Pontem",
    url: "https://pontem.network/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#7C3AED" />
        <path
          d="M12 4l8 8-8 8-8-8 8-8z"
          fill="white"
          fillOpacity="0.9"
        />
      </svg>
    ),
    description: "Multi-chain wallet for Aptos",
  },
  {
    name: "Martian",
    url: "https://martianwallet.xyz/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#2DD4BF" />
        <circle cx="12" cy="12" r="5" fill="white" />
      </svg>
    ),
    description: "Aptos & Sui wallet",
  },
];

function WalletInstallModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="glass-card w-full max-w-md p-6 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Connect a Wallet
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--color-text-muted)]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-muted)] mb-5">
            No wallet extension detected. Install an Aptos-compatible wallet to
            start using Share Cloud.
          </p>

          <div className="space-y-2">
            {WALLETS.map((wallet) => (
              <a
                key={wallet.name}
                href={wallet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[var(--color-border)] hover:bg-white/[0.04] hover:border-brand-500/30 transition-all duration-200 group"
              >
                {wallet.icon}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-brand-400 transition-colors">
                    {wallet.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {wallet.description}
                  </p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--color-text-muted)] group-hover:text-brand-400 transition-colors"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
              </a>
            ))}
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mt-4 text-center">
            After installing, refresh this page to connect.
          </p>
        </div>
      </div>
    </>
  );
}

export default function WalletConnect() {
  const {
    connect,
    disconnect,
    account,
    connected,
    walletName,
    showInstallPrompt,
    dismissInstallPrompt,
  } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const address = account?.address || "";

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    if (addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
                {walletName || "Wallet"}
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
    <>
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

      <WalletInstallModal
        isOpen={showInstallPrompt}
        onClose={dismissInstallPrompt}
      />
    </>
  );
}
