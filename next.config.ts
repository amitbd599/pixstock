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
  },
  experimental: {
    proxyClientMaxBodySize: "20mb", // proxy.ts er buffer limit
    serverActions: {
      bodySizeLimit: "20mb", // server action er limit
    },
  },
};

export default nextConfig;
