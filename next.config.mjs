/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@shelby-protocol/sdk'],
  },
};

export default nextConfig;
