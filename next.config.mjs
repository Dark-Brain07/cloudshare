/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'got': false,
      '@telegram-apps/bridge': false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'got': false,
      '@telegram-apps/bridge': false,
    };
    // Ignore critical dependency warnings
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };
    return config;
  },
};

export default nextConfig;
