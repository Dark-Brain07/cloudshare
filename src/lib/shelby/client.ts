/**
 * Server-side Shelby client for API routes.
 * Stub implementation — replace with actual @shelby-protocol/sdk when available.
 */

interface ShelbyNodeClientConfig {
  network: string;
  apiKey: string;
}

class ShelbyNodeClient {
  private config: ShelbyNodeClientConfig;

  constructor(config: ShelbyNodeClientConfig) {
    this.config = config;
  }

  async uploadFile(file: Buffer, name: string) {
    console.log(`[Shelby] Uploading ${name} to ${this.config.network}`);
    return { blobRef: `shelby://${Date.now()}/${name}`, size: file.length };
  }

  async downloadFile(blobRef: string) {
    console.log(`[Shelby] Downloading ${blobRef}`);
    return Buffer.from("");
  }

  async listFiles(ownerAddress: string) {
    console.log(`[Shelby] Listing files for ${ownerAddress}`);
    return [];
  }
}

const config: ShelbyNodeClientConfig = {
  network: process.env.NEXT_PUBLIC_SHELBY_NETWORK || "shelbynet",
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
export type { ShelbyNodeClientConfig };
