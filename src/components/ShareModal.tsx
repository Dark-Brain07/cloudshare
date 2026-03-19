"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/WalletProvider";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  fileId?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  fileName,
  fileId,
}: ShareModalProps) {
  const { connected, account } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [message, setMessage] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    if (!recipientAddress || !connected) return;
    setSharing(true);

    try {
      // TODO: In production, this will:
      // 1. Create a share-metadata blob on Shelby with the file pointer
      // 2. Sign the share transaction with the connected wallet
      // 3. Store the share record on-chain or as a Shelby blob
      console.log("Sharing file:", {
        fileId,
        from: account?.address,
        to: recipientAddress,
        message,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShared(true);
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setSharing(false);
    }
  };

  const resetAndClose = () => {
    setRecipientAddress("");
    setMessage("");
    setShared(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={resetAndClose}
      />

      <div className="relative w-full max-w-md mx-4 glass-card p-6 animate-fade-in">
        {shared ? (
          /* Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              File Shared!
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-1">
              <span className="font-medium text-[var(--color-text-secondary)]">
                {fileName}
              </span>{" "}
              has been shared with
            </p>
            <p className="text-xs font-mono text-brand-400 break-all px-4">
              {recipientAddress}
            </p>
            <button onClick={resetAndClose} className="btn-primary mt-6">
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  Share File
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                  Send file access to another wallet
                </p>
              </div>
              <button
                onClick={resetAndClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* File Being Shared */}
            {fileName && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] mb-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {fileName}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Will be shared via Shelby Network
                  </p>
                </div>
              </div>
            )}

            {/* Recipient Address */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
                Recipient Wallet Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] font-mono focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
                id="recipient-address"
              />
            </div>

            {/* Optional Message */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note for the recipient..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all resize-none"
                id="share-message"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={resetAndClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={
                  !recipientAddress || !connected || sharing
                }
                className={`btn-primary flex-1 ${
                  !recipientAddress || !connected || sharing
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                id="confirm-share"
              >
                {sharing ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        className="opacity-75"
                      />
                    </svg>
                    Sharing...
                  </>
                ) : !connected ? (
                  "Connect Wallet First"
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line
                        x1="8.59"
                        x2="15.42"
                        y1="13.51"
                        y2="17.49"
                      />
                      <line
                        x1="15.41"
                        x2="8.59"
                        y1="6.51"
                        y2="10.49"
                      />
                    </svg>
                    Share
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
