# Project Shelby

Project Shelby is a decentralized cloud application (dApp) that integrates the [Shelby Protocol](https://docs.shelby.xyz/protocol) with the [agency-agents](https://github.com/msitarzewski/agency-agents) framework. 

## Core Infrastructure

- **Protocol**: Shelby Protocol (Aptos-based decentralized storage)
- **Network**: Shelby Early Access
- **Storage**: Shelby Cloud
- **Agent Framework**: `agency-agents`

## Features

1. **Shelby Cloud Integration**: Secure file upload system where users can store images and documents directly on Shelby Cloud.
2. **Wallet-to-Wallet Sharing**: Send access "keys" or pointers for specific files from one Aptos wallet address to another.
3. **Receiver Access**: Login system using Shelby-compatible wallets. The receiver can view, download, or re-share files sent to them.
4. **Decentralized Marketplace (Sell Files)**: "Sell" function where users can list their files for a specific price, utilizing Aptos smart contracts for escrow.
5. **Agency-Agent Logic**: "File Custodian Agents" based on the `agency-agents` framework that automate file permissions and verify ownership history on the Shelby Network.
6. **Encrypted Preview**: Generate low-res encrypted thumbnails for images before full access is purchased.
7. **Version Control**: Track changes to uploaded files using Shelby's protocol logs.
8. **Dashboard**: A comprehensive UI showing "My Cloud," "Received Files," and "Marketplace Listings."

## Project Structure

```text
/
├── agents/             # Configuration and prompts for File Custodian Agents
├── contracts/          # Aptos Move smart contracts for marketplace/escrow
├── src/
│   ├── app/            # Next.js App Router (Dashboard, My Cloud, Marketplace)
│   ├── components/     # Reusable UI components
│   ├── lib/
│   │   ├── shelby/     # Shelby SDK integration (@shelby-protocol/sdk)
│   │   └── aptos/      # Web3 wallet connections (@aptos-labs/ts-sdk)
│   └── server/         # Backend API routes for agent execution
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (you will need your Shelby RPC endpoints and Aptos network settings).
3. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment on Antigravity

Project Shelby is designed to run seamlessly on the Antigravity platform:

1. **Environment Setup**: Ensure your Antigravity environment has Node.js and the appropriate wallet extensions if needed for browser testing.
2. **Agent Initialization**: The `agents/` directory contains the logic for the "File Custodian Agents". Use the Antigravity agent CLI or runner to execute these agents locally, or they will be triggered via Next.js API routes in the Cloud.
3. **Smart Contracts Deployment**: Use the Aptos CLI within Antigravity to deploy the `contracts/` to the Aptos testnet/mainnet. Ensure you have funded your test wallet.
4. **Web App Delivery**: The Next.js frontend can be deployed using standard Vercel configurations or built to a static export if required by your decentralized hosting provider. Antigravity can preview the Next.js app via `npm run dev`.
