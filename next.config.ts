import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!backendUrl) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`
      },
      {
        source: "/backend-health",
        destination: `${backendUrl}/health`
      }
    ];
  }
};

export default nextConfig;
