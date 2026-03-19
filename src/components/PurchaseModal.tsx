"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import type { MarketplaceListing } from "./MarketplaceGrid";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketplaceListing | null;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  listing,
}: PurchaseModalProps) {
  const { connected } = useWallet();
  const [purchasing, setPurchasing] = useState(false);
  const [step, setStep] = useState<
    "confirm" | "processing" | "success"
  >("confirm");

  const platformFee = listing
    ? (listing.priceApt * 0.025).toFixed(3)
    : "0";
  const totalCost = listing
    ? listing.priceApt.toFixed(2)
    : "0";

  const handlePurchase = async () => {
    if (!connected || !listing) return;
    setPurchasing(true);
    setStep("processing");
    try {
      // TODO: Call escrow::purchase_file on-chain
      console.log("Purchasing listing:", listing.id);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep("success");
    } catch (err) {
      console.error("Purchase failed:", err);
      setStep("confirm");
    } finally {
      setPurchasing(false);
    }
  };

  const resetAndClose = () => {
    setStep("confirm");
    onClose();
  };

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={resetAndClose}
      />
      <div className="relative w-full max-w-md mx-4 glass-card p-6 animate-fade-in">
        {step === "success" ? (
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
              Purchase Complete!
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-1">
              Payment is held in escrow
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Once you verify the file, confirm delivery to release payment to
              the seller.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={resetAndClose} className="btn-secondary">
                Close
              </button>
              <button className="btn-primary">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download File
              </button>
            </div>
          </div>
        ) : step === "processing" ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4 text-brand-400">
              <svg
                className="animate-spin w-8 h-8"
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
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              Processing Transaction...
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Confirm the transaction in your wallet
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Confirm Purchase
              </h2>
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

            {/* Item */}
            <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] mb-5">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {listing.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                By {listing.seller} · {listing.downloads} downloads
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">
                  File Price
                </span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {listing.price}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">
                  Platform Fee (2.5%)
                </span>
                <span className="text-[var(--color-text-secondary)]">
                  Included
                </span>
              </div>
              <div className="border-t border-[var(--color-border)] pt-3 flex justify-between">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  Total
                </span>
                <span className="text-lg font-bold text-gradient">
                  {listing.price}
                </span>
              </div>
            </div>

            {/* Escrow Notice */}
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 mb-5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-400 shrink-0 mt-0.5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <p className="text-xs text-emerald-400/80">
                Your payment is protected by escrow. Funds are only released
                after you confirm file delivery.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={resetAndClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="btn-primary flex-1"
                id="confirm-purchase"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                Pay {listing.price}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
