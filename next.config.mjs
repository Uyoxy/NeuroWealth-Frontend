const { validateEnv } = require("./lib/env");
validateEnv();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  staticPageGenerationTimeout: 0,
  // Compress responses with gzip for smaller transfer sizes
  compress: true,
  // Optimize images and allow external sources if needed
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  // Reduce bundle size by removing console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Enable experimental optimisation for package imports
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

module.exports = nextConfig;