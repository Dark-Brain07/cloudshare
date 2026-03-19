/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@shelby-protocol/sdk'],
  },
  transpilePackages: [
    '@aptos-labs/wallet-adapter-react',
    '@aptos-labs/wallet-adapter-core',
    '@aptos-labs/ts-sdk',
  ],
  webpack: (config, { isServer }) => {
    // Fix missing modules in Aptos wallet packages
    config.resolve.fallback = {
      ...config.resolve.fallback,
      got: false,
      '@telegram-apps/bridge': false,
    };

    // Ignore optional dependencies that aren't needed
    config.resolve.alias = {
      ...config.resolve.alias,
      'got': false,
      '@telegram-apps/bridge': false,
    };

    return config;
  },
};

export default nextConfig;
