"use client";

import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateListingModal({
  isOpen,
  onClose,
}: CreateListingModalProps) {
  const { connected } = useWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [fileType, setFileType] = useState("Code");
  const [creating, setCreating] = useState(false);

  const fileTypes = ["Code", "Design", "Image", "Document", "3D", "Other"];

  const handleCreate = async () => {
    if (!name || !price || !connected) return;
    setCreating(true);
    try {
      // TODO: Call the escrow::list_file Move entry function
      console.log("Creating listing:", { name, description, price, fileType });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      resetAndClose();
    } catch (err) {
      console.error("Failed to create listing:", err);
    } finally {
      setCreating(false);
    }
  };

  const resetAndClose = () => {
    setName("");
    setDescription("");
    setPrice("");
    setFileType("Code");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={resetAndClose}
      />
      <div className="relative w-full max-w-lg mx-4 glass-card p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              List on Marketplace
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
              Sell files via escrow on the Shelby Network
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

        {/* Escrow Info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/15 mb-5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-400 shrink-0"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
          <p className="text-xs text-amber-400/80">
            Payments are held in escrow. Funds release after buyer confirms
            delivery. 2.5% platform fee applies.
          </p>
        </div>

        {/* File Name */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
            File Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Premium UI Kit v2"
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
            id="listing-name"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what buyers will receive..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all resize-none"
            id="listing-description"
          />
        </div>

        {/* Type and Price Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
              Type
            </label>
            <div className="relative">
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all appearance-none cursor-pointer"
                id="listing-type"
              >
                {fileTypes.map((t) => (
                  <option key={t} value={t} className="bg-[var(--color-surface)]">
                    {t}
                  </option>
                ))}
              </select>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
              Price (APT)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.1"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
              id="listing-price"
            />
          </div>
        </div>

        {/* Preview Info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)] mb-5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-brand-400 shrink-0"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-xs text-[var(--color-text-muted)]">
            An encrypted, blurred preview thumbnail will be generated
            automatically. Buyers see the full file only after purchase.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={resetAndClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name || !price || !connected || creating}
            className={`btn-primary flex-1 ${
              !name || !price || !connected || creating
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            id="confirm-listing"
          >
            {creating ? (
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
                Creating...
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
                  <line x1="12" x2="12" y1="5" y2="19" />
                  <line x1="5" x2="19" y1="12" y2="12" />
                </svg>
                Create Listing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
