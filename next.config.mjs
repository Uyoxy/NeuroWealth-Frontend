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

// Bundle analyzer (dev-only, enabled via ANALYZE=true)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);

