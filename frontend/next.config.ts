import type { NextConfig } from "next";
import path from "path";

const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  poweredByHeader: false,
  compress: true,

  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "@clerk/nextjs": path.resolve("./src/lib/clerk-shim/client.tsx"),
      "@clerk/nextjs/server": path.resolve("./src/lib/clerk-shim/server.ts"),
    },
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@clerk/nextjs": path.resolve("./src/lib/clerk-shim/client.tsx"),
      "@clerk/nextjs/server": path.resolve("./src/lib/clerk-shim/server.ts"),
    };
    return config;
  },

  allowedDevOrigins: replitDevDomain
    ? [replitDevDomain, `*.${replitDevDomain}`]
    : [],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 604800,
  },

  async headers() {
    const rules = [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];

    if (process.env.NODE_ENV === "production") {
      rules.push({
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      });
      rules.push({
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      });
    }

    return rules;
  },
};

export default nextConfig;
