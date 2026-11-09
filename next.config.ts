import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  images: {
    remotePatterns: [
      new URL(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/**`,
      ),
    ],
  },
  // Dev server boleh diakses lewat tunnel ngrok, contoh untuk membuka link email
  // atau halaman status dari HP saat menguji webhook Midtrans di lokal.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
