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
      {
        protocol: "https",
        hostname: "pub-da1107b234e446fbb3f157a3f448db0c.r2.dev",
      },
    ],
  },
  experimental: {
    proxyClientMaxBodySize: "200mb", // proxy.ts er buffer limit
    serverActions: {
      bodySizeLimit: "200mb", // server action er limit
    },
  },
};

export default nextConfig;
