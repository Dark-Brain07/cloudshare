"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/WalletProvider";

export interface MarketplaceListing {
  id: string;
  name: string;
  description: string;
  price: string;
  priceApt: number;
  seller: string;
  type: string;
  downloads: number;
  previewBlurred: boolean;
  createdAt: string;
  status: "active" | "sold" | "completed";
}

const demoListings: MarketplaceListing[] = [
  {
    id: "m1",
    name: "Premium UI Design Kit",
    description:
      "Complete Figma design system with 200+ components, dark & light modes, and responsive layouts.",
    price: "5.0 APT",
    priceApt: 5.0,
    seller: "0xab12...ef34",
    type: "Design",
    downloads: 142,
    previewBlurred: true,
    createdAt: "2 days ago",
    status: "active",
  },
  {
    id: "m2",
    name: "Smart Contract Templates",
    description:
      "Production-ready Move smart contracts: token, NFT, governance, and staking modules.",
    price: "2.5 APT",
    priceApt: 2.5,
    seller: "0xcd56...gh78",
    type: "Code",
    downloads: 89,
    previewBlurred: true,
    createdAt: "5 days ago",
    status: "active",
  },
  {
    id: "m3",
    name: "Photography Collection",
    description:
      "60 high-resolution landscape photos, royalty-free for commercial use.",
    price: "8.0 APT",
    priceApt: 8.0,
    seller: "0xij90...kl12",
    type: "Image",
    downloads: 256,
    previewBlurred: true,
    createdAt: "1 week ago",
    status: "active",
  },
  {
    id: "m4",
    name: "DeFi Analytics Dashboard",
    description:
      "Next.js dashboard template with real-time charts, wallet integration, and portfolio tracking.",
    price: "12.0 APT",
    priceApt: 12.0,
    seller: "0xmn34...op56",
    type: "Code",
    downloads: 67,
    previewBlurred: true,
    createdAt: "3 days ago",
    status: "active",
  },
  {
    id: "m5",
    name: "3D Asset Pack",
    description:
      "50 low-poly 3D models optimized for web and game development.",
    price: "15.0 APT",
    priceApt: 15.0,
    seller: "0xqr78...st90",
    type: "3D",
    downloads: 34,
    previewBlurred: true,
    createdAt: "1 day ago",
    status: "active",
  },
  {
    id: "m6",
    name: "API Documentation Kit",
    description:
      "Professional API docs template with interactive examples and authentication guides.",
    price: "3.0 APT",
    priceApt: 3.0,
    seller: "0xuv12...wx34",
    type: "Document",
    downloads: 198,
    previewBlurred: true,
    createdAt: "4 days ago",
    status: "active",
  },
];

function getTypeColor(type: string) {
  switch (type) {
    case "Design":
      return "bg-purple-500/12 text-purple-400";
    case "Code":
      return "bg-emerald-500/12 text-emerald-400";
    case "Image":
      return "bg-blue-500/12 text-blue-400";
    case "3D":
      return "bg-amber-500/12 text-amber-400";
    case "Document":
      return "bg-rose-500/12 text-rose-400";
    default:
      return "bg-brand-500/12 text-brand-400";
  }
}

function getTypeGradient(type: string) {
  switch (type) {
    case "Design":
      return "from-purple-500/15 via-fuchsia-500/10 to-transparent";
    case "Code":
      return "from-emerald-500/15 via-teal-500/10 to-transparent";
    case "Image":
      return "from-blue-500/15 via-cyan-500/10 to-transparent";
    case "3D":
      return "from-amber-500/15 via-orange-500/10 to-transparent";
    case "Document":
      return "from-rose-500/15 via-pink-500/10 to-transparent";
    default:
      return "from-brand-500/15 via-blue-500/10 to-transparent";
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "Design":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v4M12 17v4M4.93 7.93l2.83 2.83M14.24 14.24l2.83 2.83M3 12h4M17 12h4M4.93 16.07l2.83-2.83M14.24 9.76l2.83-2.83" />
        </svg>
      );
    case "Code":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "Image":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      );
    case "3D":
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      );
  }
}

interface MarketplaceGridProps {
  onPurchase: (listing: MarketplaceListing) => void;
  onCreateListing: () => void;
}

export default function MarketplaceGrid({
  onPurchase,
  onCreateListing,
}: MarketplaceGridProps) {
  const { connected } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredListings = demoListings.filter((listing) => {
    const matchesSearch =
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || listing.type === filterType;
    return matchesSearch && matchesType;
  });

  const types = ["all"].concat(Array.from(new Set(demoListings.map((l) => l.type))));

  return (
    <div className="animate-fade-in">
      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search marketplace..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
            id="marketplace-search"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-[var(--color-border)]">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === type
                  ? "bg-brand-500/15 text-brand-400"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {type === "all" ? "All" : type}
            </button>
          ))}
        </div>

        <button
          onClick={onCreateListing}
          className="btn-primary ml-auto"
          id="create-listing-btn"
        >
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
          List File
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredListings.map((listing, index) => (
          <div
            key={listing.id}
            className="glass-card glow group overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {/* Preview Thumbnail (Encrypted/Blurred) */}
            <div
              className={`relative w-full h-44 flex items-center justify-center bg-gradient-to-br ${getTypeGradient(
                listing.type
              )}`}
            >
              {/* Blurred encrypted preview overlay */}
              <div className="absolute inset-0 backdrop-blur-[2px]" />
              <div className="relative z-10 text-[var(--color-text-muted)]">
                {getTypeIcon(listing.type)}
              </div>
              {/* Encrypted badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-amber-400"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-[10px] font-medium text-amber-400">
                  Encrypted
                </span>
              </div>
              {/* Hover reveal effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-brand-400 transition-colors line-clamp-1">
                  {listing.name}
                </h4>
                <span
                  className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${getTypeColor(
                    listing.type
                  )}`}
                >
                  {listing.type}
                </span>
              </div>

              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-4 leading-relaxed">
                {listing.description}
              </p>

              {/* Seller & Downloads */}
              <div className="flex items-center justify-between mb-4 text-xs text-[var(--color-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-brand-500/20 flex items-center justify-center">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-brand-400"
                    >
                      <circle cx="12" cy="8" r="5" />
                      <path d="M20 21a8 8 0 1 0-16 0" />
                    </svg>
                  </div>
                  <span className="font-mono">{listing.seller}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  {listing.downloads}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                <div>
                  <span className="text-lg font-bold text-gradient">
                    {listing.price}
                  </span>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                    via escrow · 2.5% fee
                  </p>
                </div>
                <button
                  onClick={() => onPurchase(listing)}
                  disabled={!connected}
                  className={`btn-primary text-xs px-4 py-2 ${
                    !connected ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {connected ? (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                      </svg>
                      Purchase
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
