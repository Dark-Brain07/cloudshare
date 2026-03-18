"use client";

import React from "react";

// Simulated demo data for the dashboard
export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  blobName: string;
  status: "stored" | "sharing" | "listed";
}

export const demoFiles: FileItem[] = [
  {
    id: "1",
    name: "project-architecture.pdf",
    size: "2.4 MB",
    type: "PDF",
    uploadedAt: "2 hours ago",
    blobName: "0x1234.../documents/project-architecture.pdf",
    status: "stored",
  },
  {
    id: "2",
    name: "dashboard-mockup.png",
    size: "845 KB",
    type: "Image",
    uploadedAt: "5 hours ago",
    blobName: "0x1234.../images/dashboard-mockup.png",
    status: "sharing",
  },
  {
    id: "3",
    name: "smart-contract-v2.move",
    size: "12 KB",
    type: "Code",
    uploadedAt: "1 day ago",
    blobName: "0x1234.../contracts/smart-contract-v2.move",
    status: "listed",
  },
  {
    id: "4",
    name: "team-photo.jpg",
    size: "3.1 MB",
    type: "Image",
    uploadedAt: "2 days ago",
    blobName: "0x1234.../images/team-photo.jpg",
    status: "stored",
  },
  {
    id: "5",
    name: "whitepaper-draft.docx",
    size: "567 KB",
    type: "Document",
    uploadedAt: "3 days ago",
    blobName: "0x1234.../documents/whitepaper-draft.docx",
    status: "stored",
  },
];

export const demoStats = {
  totalFiles: 24,
  storageUsed: "128 MB",
  sharedFiles: 7,
  listedOnMarket: 3,
};

function getFileIcon(type: string) {
  switch (type) {
    case "Image":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      );
    case "PDF":
    case "Document":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 13H8" /><path d="M16 17H8" /><path d="M16 13h-2" />
        </svg>
      );
    case "Code":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      );
  }
}

function getStatusBadge(status: FileItem["status"]) {
  switch (status) {
    case "stored":
      return <span className="badge-success">Stored</span>;
    case "sharing":
      return <span className="badge-brand">Shared</span>;
    case "listed":
      return <span className="badge-warning">On Market</span>;
  }
}

interface FileListProps {
  files: FileItem[];
  onShare?: (fileName: string, fileId: string) => void;
}

export default function FileList({ files, onShare }: FileListProps) {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center px-5 py-3 text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
        <div className="flex-1">File</div>
        <div className="w-24 text-center">Size</div>
        <div className="w-28 text-center">Status</div>
        <div className="w-28 text-right">Uploaded</div>
        <div className="w-10" />
      </div>

      {/* Rows */}
      {files.map((file, index) => (
        <div
          key={file.id}
          className="file-row animate-fade-in"
          style={{ animationDelay: `${index * 60}ms` }}
          id={`file-row-${file.id}`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                file.type === "Image"
                  ? "bg-purple-500/10 text-purple-400"
                  : file.type === "Code"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-brand-500/10 text-brand-400"
              }`}
            >
              {getFileIcon(file.type)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {file.name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] font-mono truncate">
                {file.blobName}
              </p>
            </div>
          </div>
          <div className="w-24 text-center text-sm text-[var(--color-text-secondary)]">
            {file.size}
          </div>
          <div className="w-28 text-center">{getStatusBadge(file.status)}</div>
          <div className="w-28 text-right text-sm text-[var(--color-text-muted)]">
            {file.uploadedAt}
          </div>
          <div className="w-20 flex justify-end gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(file.name, file.id);
              }}
              className="p-1.5 rounded-lg hover:bg-brand-500/10 text-[var(--color-text-muted)] hover:text-brand-400 transition-colors"
              title="Share file"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--color-text-muted)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
