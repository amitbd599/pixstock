/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  compress: true,
  // ইমেজ আগেই Sharp দিয়ে WebP + resize করা, তাই VPS-এ দ্বিতীয়বার optimize করা হয় না
  images: { unoptimized: true },
  experimental: {
    serverActions: { bodySizeLimit: "30mb" },
    serverComponentsExternalPackages: ["sharp", "mongoose"],
  },
};
