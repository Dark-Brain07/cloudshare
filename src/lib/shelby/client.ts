import {
  ShelbyNodeClient,
  type ShelbyNodeClientConfig,
} from "@shelby-protocol/sdk/node";

/**
 * Server-side Shelby client for API routes.
 * Uses the Node.js environment SDK for file uploads/downloads.
 */

const config: ShelbyNodeClientConfig = {
  network: (process.env.NEXT_PUBLIC_SHELBY_NETWORK as any) || "shelbynet",
  apiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY || "",
};

let _client: ShelbyNodeClient | null = null;

export function getShelbyClient(): ShelbyNodeClient {
  if (!_client) {
    _client = new ShelbyNodeClient(config);
  }
  return _client;
}

export { config as shelbyConfig };
