import type { NextConfig } from "next";

function getAllowedOrigins(): string[] {
  const origins = ["localhost:3000"];
  const url = process.env.NEXTAUTH_URL;
  if (url) {
    try { origins.push(new URL(url).host); } catch { /* invalid URL, skip */ }
  }
  return origins;
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: getAllowedOrigins(),
    },
  },
};

export default nextConfig;
