// Agent type definitions and configurations for File Custodian Agents
// Inspired by agency-agents patterns for modularity and composability

export type AgentStatus = "active" | "paused" | "error";
export type AgentAction = "grant" | "revoke" | "verify" | "audit" | "transfer";

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  type: "permission" | "audit" | "transfer" | "composite";
  icon: string;
  color: string;
  status: AgentStatus;
  rules: AgentRule[];
  stats: AgentStats;
  createdAt: string;
}

export interface AgentRule {
  id: string;
  condition: string;
  action: AgentAction;
  target: string;
  enabled: boolean;
}

export interface AgentStats {
  actionsExecuted: number;
  filesProtected: number;
  lastActive: string;
  uptime: string;
}

export interface OwnershipRecord {
  id: string;
  fileId: string;
  fileName: string;
  fromAddress: string;
  toAddress: string;
  action: "upload" | "share" | "purchase" | "transfer";
  timestamp: string;
  txHash: string;
  verified: boolean;
}

// Built-in agent templates
export const AGENT_TEMPLATES: Omit<AgentConfig, "id" | "stats">[] = [
  {
    name: "Access Guardian",
    description:
      "Monitors and enforces file access permissions. Automatically revokes access for expired shares and blocks unauthorized download attempts.",
    type: "permission",
    icon: "shield",
    color: "brand",
    status: "active",
    rules: [
      {
        id: "r1",
        condition: "Share expires",
        action: "revoke",
        target: "Recipient wallet",
        enabled: true,
      },
      {
        id: "r2",
        condition: "Unauthorized access attempt",
        action: "revoke",
        target: "Requesting wallet",
        enabled: true,
      },
      {
        id: "r3",
        condition: "New share created",
        action: "audit",
        target: "Transaction log",
        enabled: true,
      },
    ],
    createdAt: "2 days ago",
  },
  {
    name: "Ownership Auditor",
    description:
      "Tracks complete ownership history of files on-chain. Verifies provenance, detects duplicate uploads, and maintains an immutable audit trail.",
    type: "audit",
    icon: "search",
    color: "purple",
    status: "active",
    rules: [
      {
        id: "r4",
        condition: "File uploaded",
        action: "verify",
        target: "Content hash registry",
        enabled: true,
      },
      {
        id: "r5",
        condition: "Ownership transferred",
        action: "audit",
        target: "Chain history",
        enabled: true,
      },
      {
        id: "r6",
        condition: "Duplicate detected",
        action: "audit",
        target: "Original uploader",
        enabled: false,
      },
    ],
    createdAt: "5 days ago",
  },
  {
    name: "Transfer Agent",
    description:
      "Handles automated file transfers between wallets. Supports scheduled transfers, batch operations, and conditional transfers based on on-chain events.",
    type: "transfer",
    icon: "send",
    color: "emerald",
    status: "paused",
    rules: [
      {
        id: "r7",
        condition: "Escrow confirmed",
        action: "transfer",
        target: "Buyer wallet",
        enabled: true,
      },
      {
        id: "r8",
        condition: "Scheduled time reached",
        action: "transfer",
        target: "Designated wallet",
        enabled: false,
      },
    ],
    createdAt: "1 day ago",
  },
];

// Demo ownership history
export const DEMO_OWNERSHIP_HISTORY: OwnershipRecord[] = [
  {
    id: "oh1",
    fileId: "1",
    fileName: "project-architecture.pdf",
    fromAddress: "0x0000...0000",
    toAddress: "0x1555...53f4",
    action: "upload",
    timestamp: "2 hours ago",
    txHash: "0xabc1...def1",
    verified: true,
  },
  {
    id: "oh2",
    fileId: "2",
    fileName: "dashboard-mockup.png",
    fromAddress: "0x1555...53f4",
    toAddress: "0xab12...ef34",
    action: "share",
    timestamp: "5 hours ago",
    txHash: "0xabc2...def2",
    verified: true,
  },
  {
    id: "oh3",
    fileId: "3",
    fileName: "smart-contract-v2.move",
    fromAddress: "0x1555...53f4",
    toAddress: "0xcd56...gh78",
    action: "purchase",
    timestamp: "1 day ago",
    txHash: "0xabc3...def3",
    verified: true,
  },
  {
    id: "oh4",
    fileId: "4",
    fileName: "team-photo.jpg",
    fromAddress: "0x1555...53f4",
    toAddress: "0xij90...kl12",
    action: "transfer",
    timestamp: "2 days ago",
    txHash: "0xabc4...def4",
    verified: false,
  },
];
