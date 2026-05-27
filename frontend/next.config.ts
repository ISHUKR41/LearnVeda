/*
 * FILE: next.config.ts
 * LOCATION: next.config.ts
 * PURPOSE: Next.js configuration for EduQuest production platform.
 *          Covers: security headers, image optimization (local + Unsplash CDN),
 *          compression, Turbopack root, and Replit dev-proxy allowlist.
 * USED BY: Next.js build and dev server (automatic)
 * LAST UPDATED: 2026-05-25
 */

import type { NextConfig } from "next";

/* Replit exposes the proxied dev domain as an env var. We use it to add the
 * domain to allowedDevOrigins so the preview iframe can load pages correctly. */
const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  /* ── Security ───────────────────────────────────────────── */
  poweredByHeader: false,   // Don't advertise Next.js version in HTTP headers
  compress: true,            // Enable Brotli/Gzip on all responses

  /* ── Turbopack dev-server root ─── */
  turbopack: {
    root: process.cwd(),
  },

  /* ── Replit preview iframe compatibility ─────────────────── */
  allowedDevOrigins: replitDevDomain
    ? [replitDevDomain, `*.${replitDevDomain}`]
    : [],

  /* ── Next.js Image optimisation domains ─────────────────────
   * We whitelist both local filesystem images (always allowed)
   * and Unsplash CDN images used as professional hero backgrounds.
   * Using `remotePatterns` (the v13+ replacement for `domains`).
   * ──────────────────────────────────────────────────────────── */
  images: {
    remotePatterns: [
      /* Unsplash production CDN — used for subject hero images */
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      /* Unsplash resize API (plus.unsplash.com) */
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      /* Unsplash image source CDN shortlink */
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
    ],
    /* Serve modern AVIF + WebP formats; fallback to the original format.
     * AVIF is ~50% smaller than WebP at the same visual quality. */
    formats: ["image/avif", "image/webp"],

    /* Responsive breakpoints used by the Next/Image <img> srcSet */
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],

    /* Minimum cache TTL for optimised images (1 week in seconds) */
    minimumCacheTTL: 604800,
  },

  /* ── HTTP security headers applied to every route ─────────── */
  async headers() {
    const rules = [
      {
        source: "/(.*)",
        headers: [
          /* Tell browsers to pre-resolve DNS for external assets */
          { key: "X-DNS-Prefetch-Control", value: "on" },
          /* Prevent clickjacking while still allowing Replit preview iframe */
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          /* Block MIME-type sniffing attacks */
          { key: "X-Content-Type-Options", value: "nosniff" },
          /* Safe referrer policy — sends origin only for cross-origin requests */
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          /* Deny camera/mic/geolocation access to embedded iframes */
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];

    if (process.env.NODE_ENV === "production") {
      /* Cache aggressively for all Next.js static assets (JS, CSS chunks, fonts) */
      rules.push({
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      });

      /* Cache public folder assets (SVGs, PNGs, favicons) for 1 week */
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
