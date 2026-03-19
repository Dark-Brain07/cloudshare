/**
 * Browser-side Shelby client for frontend interactions.
 * Stub implementation — replace with actual @shelby-protocol/sdk when available.
 */

interface ShelbyClientConfig {
  network: string;
  apiKey: string;
}

class ShelbyClient {
  private config: ShelbyClientConfig;

  constructor(config: ShelbyClientConfig) {
    this.config = config;
  }

  async uploadFile(file: File) {
    console.log(`[Shelby Browser] Uploading ${file.name} to ${this.config.network}`);
    return { blobRef: `shelby://${Date.now()}/${file.name}`, size: file.size };
  }

  async getFileUrl(blobRef: string) {
    console.log(`[Shelby Browser] Getting URL for ${blobRef}`);
    return `https://api.shelbynet.shelby.xyz/v1/files/${blobRef}`;
  }
}

const config: ShelbyClientConfig = {
  network: process.env.NEXT_PUBLIC_SHELBY_NETWORK || "shelbynet",
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
export type { ShelbyClientConfig };
