"use client";

import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  AGENT_TEMPLATES,
  DEMO_OWNERSHIP_HISTORY,
  type AgentConfig,
  type AgentStats,
  type OwnershipRecord,
} from "@/lib/agents/config";

// Generate full agent configs with demo stats
const demoAgents: AgentConfig[] = AGENT_TEMPLATES.map((t, i) => ({
  ...t,
  id: `agent-${i + 1}`,
  stats: {
    actionsExecuted: [847, 1243, 156][i],
    filesProtected: [24, 24, 12][i],
    lastActive: ["2 mins ago", "15 mins ago", "2 hours ago"][i],
    uptime: ["99.8%", "99.9%", "94.2%"][i],
  },
}));

function getAgentIcon(icon: string) {
  switch (icon) {
    case "shield":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "search":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      );
    case "send":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="m22 2-7 20-4-9-9-4z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
        </svg>
      );
  }
}

function getColorClasses(color: string) {
  switch (color) {
    case "brand":
      return {
        bg: "bg-brand-500/10",
        text: "text-brand-400",
        border: "border-brand-500/20",
        dot: "bg-brand-400",
      };
    case "purple":
      return {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/20",
        dot: "bg-purple-400",
      };
    case "emerald":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/20",
        dot: "bg-emerald-400",
      };
    default:
      return {
        bg: "bg-brand-500/10",
        text: "text-brand-400",
        border: "border-brand-500/20",
        dot: "bg-brand-400",
      };
  }
}

function getActionIcon(action: string) {
  switch (action) {
    case "upload":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
      );
    case "share":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
          <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
      );
    case "purchase":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      );
    case "transfer":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m22 2-7 20-4-9-9-4z" />
        </svg>
      );
    default:
      return null;
  }
}

function getActionColor(action: string) {
  switch (action) {
    case "upload":
      return "text-brand-400 bg-brand-500/10";
    case "share":
      return "text-purple-400 bg-purple-500/10";
    case "purchase":
      return "text-emerald-400 bg-emerald-500/10";
    case "transfer":
      return "text-amber-400 bg-amber-500/10";
    default:
      return "text-gray-400 bg-gray-500/10";
  }
}

export default function AgentsDashboard() {
  const { connected } = useWallet();
  const [activeView, setActiveView] = useState<"agents" | "history">("agents");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  return (
    <div className="animate-fade-in">
      {/* View Toggle */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-[var(--color-border)]">
          <button
            onClick={() => setActiveView("agents")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === "agents"
                ? "bg-brand-500/15 text-brand-400"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8V4H8" />
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M2 14h2" />
                <path d="M20 14h2" />
              </svg>
              Active Agents
            </span>
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeView === "history"
                ? "bg-brand-500/15 text-brand-400"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Ownership History
            </span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {demoAgents.filter((a) => a.status === "active").length} Active
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            {demoAgents.filter((a) => a.status === "paused").length} Paused
          </div>
        </div>
      </div>

      {/* Agents View */}
      {activeView === "agents" && (
        <div className="space-y-4">
          {demoAgents.map((agent, index) => {
            const colors = getColorClasses(agent.color);
            const isExpanded = expandedAgent === agent.id;

            return (
              <div
                key={agent.id}
                className="glass-card glow overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Agent Header */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer"
                  onClick={() =>
                    setExpandedAgent(isExpanded ? null : agent.id)
                  }
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0`}
                  >
                    {getAgentIcon(agent.icon)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {agent.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          agent.status === "active"
                            ? "bg-emerald-500/12 text-emerald-400"
                            : agent.status === "paused"
                            ? "bg-amber-500/12 text-amber-400"
                            : "bg-red-500/12 text-red-400"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            agent.status === "active"
                              ? "bg-emerald-400 animate-pulse"
                              : agent.status === "paused"
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                        />
                        {agent.status === "active"
                          ? "Running"
                          : agent.status === "paused"
                          ? "Paused"
                          : "Error"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                        {agent.type}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                      {agent.description}
                    </p>
                  </div>

                  {/* Stats Mini */}
                  <div className="hidden xl:flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">
                        {agent.stats.actionsExecuted}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        Actions
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">
                        {agent.stats.filesProtected}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        Files
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-emerald-400">
                        {agent.stats.uptime}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        Uptime
                      </p>
                    </div>
                  </div>

                  {/* Expand Arrow */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-[var(--color-text-muted)] transition-transform shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded Rules */}
                {isExpanded && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <div className="border-t border-[var(--color-border)] pt-4">
                      {/* Description */}
                      <p className="text-xs text-[var(--color-text-muted)] mb-4 leading-relaxed">
                        {agent.description}
                      </p>

                      {/* Stats Grid (visible on expand) */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                          <p className="text-lg font-bold text-[var(--color-text-primary)]">
                            {agent.stats.actionsExecuted}
                          </p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            Actions Executed
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                          <p className="text-lg font-bold text-[var(--color-text-primary)]">
                            {agent.stats.filesProtected}
                          </p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            Files Protected
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                          <p className="text-lg font-bold text-emerald-400">
                            {agent.stats.uptime}
                          </p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            Uptime
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-[var(--color-border)]">
                          <p className="text-lg font-bold text-[var(--color-text-primary)]">
                            {agent.stats.lastActive}
                          </p>
                          <p className="text-[10px] text-[var(--color-text-muted)]">
                            Last Active
                          </p>
                        </div>
                      </div>

                      {/* Rules Table */}
                      <h4 className="text-xs font-semibold text-[var(--color-text-primary)] mb-2 uppercase tracking-wider">
                        Automation Rules
                      </h4>
                      <div className="space-y-1.5">
                        {agent.rules.map((rule) => (
                          <div
                            key={rule.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.015] border border-[var(--color-border)]"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                rule.action === "grant"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : rule.action === "revoke"
                                  ? "bg-red-500/10 text-red-400"
                                  : rule.action === "verify"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : rule.action === "audit"
                                  ? "bg-purple-500/10 text-purple-400"
                                  : "bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                {rule.action === "revoke" ? (
                                  <><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" /></>
                                ) : rule.action === "verify" ? (
                                  <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></>
                                ) : rule.action === "audit" ? (
                                  <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>
                                ) : (
                                  <><path d="m22 2-7 20-4-9-9-4z" /></>
                                )}
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[var(--color-text-primary)]">
                                When <span className="font-medium text-brand-400">{rule.condition}</span>
                                {" → "}
                                <span className="font-medium">{rule.action}</span> on{" "}
                                <span className="font-mono text-[var(--color-text-muted)]">{rule.target}</span>
                              </p>
                            </div>
                            <button
                              className={`relative w-9 h-5 rounded-full transition-colors ${
                                rule.enabled
                                  ? "bg-brand-500"
                                  : "bg-white/10"
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                                  rule.enabled ? "left-[18px]" : "left-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ownership History View */}
      {activeView === "history" && (
        <div className="glass-card">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
              File Ownership Chain
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Verified on-chain ownership history tracked by Ownership Auditor
            </p>
          </div>

          {!connected ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4 text-brand-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold mb-1">
                Connect your wallet
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] text-center max-w-xs">
                Connect your wallet to view the complete ownership history of
                your files on the Shelby Network.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {DEMO_OWNERSHIP_HISTORY.map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* Action Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getActionColor(
                      record.action
                    )}`}
                  >
                    {getActionIcon(record.action)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {record.fileName}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      <span className="font-mono">{record.fromAddress}</span>
                      {" → "}
                      <span className="font-mono">{record.toAddress}</span>
                    </p>
                  </div>

                  {/* Action Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize ${getActionColor(
                      record.action
                    )}`}
                  >
                    {record.action}
                  </span>

                  {/* Verification */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {record.verified ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="12" />
                          <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Time & TX */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {record.timestamp}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--color-text-muted)] mt-0.5">
                      {record.txHash}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
