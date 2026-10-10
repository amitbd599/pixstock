import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
      allowedOrigins: ["themesoft69.com", "www.themesoft69.com"],
    },
  },
};

export default nextConfig;
