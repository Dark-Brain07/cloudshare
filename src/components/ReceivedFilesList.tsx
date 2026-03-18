"use client";

import React from "react";

export interface ReceivedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  from: string;
  receivedAt: string;
  message?: string;
}

const demoReceivedFiles: ReceivedFile[] = [
  {
    id: "r1",
    name: "contract-audit-v3.pdf",
    size: "1.8 MB",
    type: "PDF",
    from: "0xab12...ef34",
    receivedAt: "3 hours ago",
    message: "Here's the latest audit report",
  },
  {
    id: "r2",
    name: "logo-final.svg",
    size: "42 KB",
    type: "Image",
    from: "0xcd56...gh78",
    receivedAt: "1 day ago",
  },
  {
    id: "r3",
    name: "api-integration-guide.md",
    size: "15 KB",
    type: "Document",
    from: "0xij90...kl12",
    receivedAt: "2 days ago",
    message: "Integration docs for our API",
  },
];

interface ReceivedFilesListProps {
  connected: boolean;
}

export default function ReceivedFilesList({
  connected,
}: ReceivedFilesListProps) {
  if (!connected) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-24">
        <div className="w-20 h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center mb-6 text-brand-400">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Connect your wallet</h3>
        <p className="text-sm text-[var(--color-text-muted)] text-center max-w-sm">
          Connect an Aptos-compatible wallet to view files that have been shared
          with your address on the Shelby Network.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="glass-card">
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Files Shared With You
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {demoReceivedFiles.length} file
            {demoReceivedFiles.length !== 1 ? "s" : ""} received
          </p>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {demoReceivedFiles.map((file, index) => (
            <div
              key={file.id}
              className="flex items-start gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* File Icon */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  file.type === "Image"
                    ? "bg-purple-500/10 text-purple-400"
                    : file.type === "PDF"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-brand-500/10 text-brand-400"
                }`}
              >
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

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[var(--color-text-muted)]">
                        From:
                      </span>
                      <span className="text-xs font-mono text-brand-400">
                        {file.from}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        · {file.receivedAt}
                      </span>
                    </div>
                    {file.message && (
                      <p className="text-xs text-[var(--color-text-secondary)] mt-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-[var(--color-border)] italic">
                        &quot;{file.message}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {file.size}
                    </span>
                    <button className="btn-primary text-xs px-3 py-1.5">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      Download
                    </button>
                    <button className="btn-secondary text-xs px-3 py-1.5">
                      <svg
                        width="14"
                        height="14"
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
                      Re-share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
