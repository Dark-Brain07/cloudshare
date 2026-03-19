"use client";

import React, { useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import FileList, { demoFiles, demoStats } from "@/components/FileList";
import UploadModal from "@/components/UploadModal";
import WalletConnect from "@/components/WalletConnect";
import ShareModal from "@/components/ShareModal";
import ReceivedFilesList from "@/components/ReceivedFilesList";
import MarketplaceGrid from "@/components/MarketplaceGrid";
import CreateListingModal from "@/components/CreateListingModal";
import PurchaseModal from "@/components/PurchaseModal";
import AgentsDashboard from "@/components/AgentsDashboard";
import type { MarketplaceListing } from "@/components/MarketplaceGrid";

export default function Dashboard() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState("share-cloud");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareFile, setShareFile] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [createListingOpen, setCreateListingOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseListing, setPurchaseListing] =
    useState<MarketplaceListing | null>(null);

  const handleUpload = async (files: File[]) => {
    console.log("Uploading files to Shelby Network:", files);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleShareFile = (fileName: string, fileId: string) => {
    setShareFile({ name: fileName, id: fileId });
    setShareOpen(true);
  };

  const handlePurchase = (listing: MarketplaceListing) => {
    setPurchaseListing(listing);
    setPurchaseOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content — responsive margin */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-white/5 text-[var(--color-text-muted)]"
              id="mobile-menu-button"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-text-primary)]">
                {activeTab === "share-cloud" && "Share Cloud"}
                {activeTab === "received" && "Received Files"}
                {activeTab === "marketplace" && "Marketplace"}
                {activeTab === "agents" && "Custodian Agents"}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5 hidden sm:block">
                {activeTab === "share-cloud" &&
                  "Manage your files on the Shelby Network"}
                {activeTab === "received" &&
                  "Files shared with you by other wallets"}
                {activeTab === "marketplace" &&
                  "Buy and sell files with escrow protection"}
                {activeTab === "agents" && "Automated file permission agents"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setUploadOpen(true)}
              className="btn-primary text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5"
              id="upload-button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              <span className="hidden sm:inline">Upload</span>
            </button>
            <WalletConnect />
          </div>
        </header>

        {/* Content Area — responsive padding */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Share Cloud Tab */}
          {activeTab === "share-cloud" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <StatsCard
                  label="Total Files"
                  value={demoStats.totalFiles}
                  accent="brand"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    </svg>
                  }
                />
                <StatsCard
                  label="Storage Used"
                  value={demoStats.storageUsed}
                  accent="purple"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                      <path d="M3 12A9 3 0 0 0 21 12" />
                    </svg>
                  }
                />
                <StatsCard
                  label="Shared Files"
                  value={demoStats.sharedFiles}
                  accent="emerald"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                    </svg>
                  }
                />
                <StatsCard
                  label="On Marketplace"
                  value={demoStats.listedOnMarket}
                  accent="amber"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <path d="M2 7h20" />
                    </svg>
                  }
                />
              </div>

              <div className="glass-card">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--color-border)]">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Your Files
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary text-xs px-3 py-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                      </svg>
                      Filter
                    </button>
                  </div>
                </div>
                <FileList files={demoFiles} onShare={handleShareFile} />
              </div>
            </div>
          )}

          {/* Received Files Tab */}
          {activeTab === "received" && (
            <ReceivedFilesList connected={connected} />
          )}

          {/* Marketplace Tab */}
          {activeTab === "marketplace" && (
            <MarketplaceGrid
              onPurchase={handlePurchase}
              onCreateListing={() => setCreateListingOpen(true)}
            />
          )}

          {/* Agents Tab */}
          {activeTab === "agents" && <AgentsDashboard />}
        </div>
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
      <ShareModal
        isOpen={shareOpen}
        onClose={() => {
          setShareOpen(false);
          setShareFile(null);
        }}
        fileName={shareFile?.name}
        fileId={shareFile?.id}
      />
      <CreateListingModal
        isOpen={createListingOpen}
        onClose={() => setCreateListingOpen(false)}
      />
      <PurchaseModal
        isOpen={purchaseOpen}
        onClose={() => {
          setPurchaseOpen(false);
          setPurchaseListing(null);
        }}
        listing={purchaseListing}
      />
    </div>
  );
}
