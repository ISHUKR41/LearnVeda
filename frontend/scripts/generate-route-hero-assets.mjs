/**
 * FILE: generate-route-hero-assets.mjs
 * LOCATION: scripts/generate-route-hero-assets.mjs
 * PURPOSE: Creates project-owned bitmap hero images for top-level route pages.
 *          The generated assets are deterministic, local, and optimized enough
 *          for Next.js `Image` while avoiding external image/CDN dependency.
 * USED BY: npm run assets:route-heroes
 * LAST UPDATED: 2026-05-19
 *
 * DESIGN NOTE:
 *   These are not decorative placeholders. Each image uses a class-specific
 *   educational workspace composition: notebook panels, formula tiles, stream
 *   cards, exam analytics, and clean product UI surfaces. They give the route
 *   heroes real visual context without shipping a heavy stock-photo dependency.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUTPUT_DIRECTORY = path.join(process.cwd(), "public", "images");

const ASSETS = [
  {
    filename: "class-9-hero.png",
    alt: "Class 9 foundation learning dashboard with subject cards and notebook visuals",
    theme: {
      bg: "#0B1120",
      panel: "#EAF3FF",
      panelAlt: "#FFFFFF",
      accent: "#2563EB",
      accentTwo: "#14B8A6",
      accentThree: "#F59E0B",
      ink: "#0F172A",
      text: "CLASS 9",
      subtext: "Foundation plan",
      marks: ["Math", "Science", "NCERT"],
    },
  },
  {
    filename: "class-10-hero.png",
    alt: "Class 10 board exam preparation workspace with revision cards and performance graph",
    theme: {
      bg: "#111827",
      panel: "#FFF7ED",
      panelAlt: "#FFFFFF",
      accent: "#D97706",
      accentTwo: "#2563EB",
      accentThree: "#10B981",
      ink: "#1F2937",
      text: "CLASS 10",
      subtext: "Board revision",
      marks: ["PYQ", "Mocks", "Scores"],
    },
  },
  {
    filename: "class-11-hero.png",
    alt: "Class 11 stream selection workspace with Science Commerce and Arts study cards",
    theme: {
      bg: "#0F172A",
      panel: "#ECFDF5",
      panelAlt: "#FFFFFF",
      accent: "#059669",
      accentTwo: "#7C3AED",
      accentThree: "#0EA5E9",
      ink: "#064E3B",
      text: "CLASS 11",
      subtext: "Stream depth",
      marks: ["Science", "Commerce", "Arts"],
    },
  },
  {
    filename: "class-12-hero.png",
    alt: "Class 12 board and entrance preparation workspace with exam analytics",
    theme: {
      bg: "#111827",
      panel: "#FFFBEB",
      panelAlt: "#FFFFFF",
      accent: "#B45309",
      accentTwo: "#DC2626",
      accentThree: "#2563EB",
      ink: "#1C1917",
      text: "CLASS 12",
      subtext: "Board + entrance",
      marks: ["JEE", "NEET", "CUET"],
    },
  },
];

function roundedRect({ x, y, width, height, radius, fill, stroke = "none", opacity = 1 }) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" opacity="${opacity}" />`;
}

function text({ x, y, value, size, fill, weight = 700, family = "Inter, Arial, sans-serif", opacity = 1 }) {
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" opacity="${opacity}">${value}</text>`;
}

function buildHeroSvg(asset) {
  const { theme } = asset;
  const cardX = 650;

  return `
    <svg width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${theme.bg}" />
          <stop offset="0.55" stop-color="#172554" />
          <stop offset="1" stop-color="#020617" />
        </linearGradient>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${theme.panelAlt}" />
          <stop offset="1" stop-color="${theme.panel}" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="28" stdDeviation="26" flood-color="#020617" flood-opacity="0.28"/>
        </filter>
        <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.08"/>
        </pattern>
      </defs>

      <rect width="1600" height="900" fill="url(#bg)" />
      <rect width="1600" height="900" fill="url(#grid)" />
      <circle cx="1270" cy="190" r="260" fill="${theme.accent}" opacity="0.18" />
      <circle cx="1420" cy="680" r="210" fill="${theme.accentTwo}" opacity="0.13" />

      ${roundedRect({ x: cardX, y: 130, width: 700, height: 560, radius: 34, fill: "url(#panel)", opacity: 0.98 })}
      <g filter="url(#softShadow)">
        ${roundedRect({ x: cardX + 40, y: 170, width: 620, height: 92, radius: 24, fill: "#FFFFFF" })}
        ${text({ x: cardX + 78, y: 220, value: theme.text, size: 28, fill: theme.ink, weight: 900 })}
        ${text({ x: cardX + 78, y: 248, value: theme.subtext, size: 18, fill: "#64748B", weight: 600 })}
        ${roundedRect({ x: cardX + 470, y: 188, width: 138, height: 40, radius: 20, fill: theme.accent, opacity: 0.12 })}
        ${text({ x: cardX + 500, y: 214, value: "Live data", size: 15, fill: theme.accent, weight: 800 })}

        ${roundedRect({ x: cardX + 50, y: 300, width: 180, height: 160, radius: 24, fill: "#FFFFFF" })}
        ${roundedRect({ x: cardX + 260, y: 300, width: 180, height: 160, radius: 24, fill: "#FFFFFF" })}
        ${roundedRect({ x: cardX + 470, y: 300, width: 180, height: 160, radius: 24, fill: "#FFFFFF" })}

        ${roundedRect({ x: cardX + 82, y: 335, width: 56, height: 56, radius: 18, fill: theme.accent, opacity: 0.13 })}
        ${roundedRect({ x: cardX + 292, y: 335, width: 56, height: 56, radius: 18, fill: theme.accentTwo, opacity: 0.14 })}
        ${roundedRect({ x: cardX + 502, y: 335, width: 56, height: 56, radius: 18, fill: theme.accentThree, opacity: 0.16 })}
        ${text({ x: cardX + 82, y: 425, value: theme.marks[0], size: 24, fill: theme.ink, weight: 800 })}
        ${text({ x: cardX + 292, y: 425, value: theme.marks[1], size: 24, fill: theme.ink, weight: 800 })}
        ${text({ x: cardX + 502, y: 425, value: theme.marks[2], size: 24, fill: theme.ink, weight: 800 })}

        ${roundedRect({ x: cardX + 50, y: 505, width: 600, height: 128, radius: 28, fill: "#FFFFFF" })}
        <path d="M ${cardX + 90} 590 C ${cardX + 180} 530, ${cardX + 270} 610, ${cardX + 360} 548 S ${cardX + 520} 528, ${cardX + 610} 570" fill="none" stroke="${theme.accent}" stroke-width="12" stroke-linecap="round"/>
        <path d="M ${cardX + 90} 604 C ${cardX + 190} 560, ${cardX + 285} 618, ${cardX + 400} 580 S ${cardX + 535} 585, ${cardX + 610} 540" fill="none" stroke="${theme.accentTwo}" stroke-width="8" stroke-linecap="round" opacity="0.74"/>
      </g>

      <g opacity="0.88">
        ${roundedRect({ x: 1180, y: 125, width: 96, height: 96, radius: 28, fill: "#FFFFFF", opacity: 0.92 })}
        <path d="M1208 177h40M1228 157v40" stroke="${theme.accent}" stroke-width="10" stroke-linecap="round"/>
        ${roundedRect({ x: 1298, y: 705, width: 118, height: 118, radius: 34, fill: "#FFFFFF", opacity: 0.9 })}
        <path d="M1334 768l24 24 32-56" fill="none" stroke="${theme.accentTwo}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `;
}

async function writeAsset(asset) {
  const output = path.join(OUTPUT_DIRECTORY, asset.filename);
  const svg = buildHeroSvg(asset);

  await sharp(Buffer.from(svg))
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: false,
    })
    .toFile(output);

  return output;
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });

for (const asset of ASSETS) {
  const output = await writeAsset(asset);
  console.log(`Generated ${path.relative(process.cwd(), output)}`);
}
