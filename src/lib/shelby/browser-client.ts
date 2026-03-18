import {
  ShelbyClient,
  type ShelbyClientConfig,
} from "@shelby-protocol/sdk/browser";

/**
 * Browser-side Shelby client for direct frontend interactions.
 * Uses the Browser environment SDK.
 */

const config: ShelbyClientConfig = {
  network: (process.env.NEXT_PUBLIC_SHELBY_NETWORK as any) || "shelbynet",
  apiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY || "",
};

let _browserClient: ShelbyClient | null = null;

export function getShelbyBrowserClient(): ShelbyClient {
  if (!_browserClient) {
    _browserClient = new ShelbyClient(config);
  }
  return _browserClient;
}

export { config as shelbyBrowserConfig };
