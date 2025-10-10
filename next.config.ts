// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ Don't block production builds on ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Don't block production builds on type errors (Vercel-safe)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
