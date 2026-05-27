/**
 * FILE: generate-favicons.mjs
 * LOCATION: frontend/scripts/generate-favicons.mjs
 * PURPOSE: Automated utility to generate 11 highly professional, themed,
 *          and custom SVG favicon assets for each route type in the EduQuest platform.
 * USED BY: Build process / manual execution
 * DEPENDENCIES: node fs module
 * LAST UPDATED: 2026-05-26
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FAVICON_DIR = path.join(__dirname, '../public/favicons');

// Ensure favicons directory exists
if (!fs.existsSync(FAVICON_DIR)) {
  fs.mkdirSync(FAVICON_DIR, { recursive: true });
}

const FAVICONS = {
  // 1. Home Favicon
  'home.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4F46E5" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <path d="M16 6L6 14v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V14L16 6zm0 4.5l6.5 5.2v8.8h-13v-8.8L16 10.5z" fill="url(#homeGrad)" />
  <circle cx="16" cy="18" r="3" fill="#38BDF8" />
</svg>`,

  // 2. Dashboard Favicon
  'dashboard.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <rect x="7" y="15" width="4" height="10" rx="1" fill="url(#dashGrad)" />
  <rect x="14" y="9" width="4" height="16" rx="1" fill="#60A5FA" />
  <rect x="21" y="18" width="4" height="7" rx="1" fill="url(#dashGrad)" />
  <path d="M6 25h20" stroke="#30363D" stroke-width="2" stroke-linecap="round" />
</svg>`,

  // 3. Battle Favicon
  'battle.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="battleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <!-- Crossed Swords -->
  <path d="M7 25l8-8m0 0l7-7 3 3-7 7m-3-3l-3 3" stroke="url(#battleGrad)" stroke-width="2.5" stroke-linecap="round" />
  <path d="M25 25l-8-8m0 0l-7-7-3 3 7 7m3-3l3 3" stroke="url(#battleGrad)" stroke-width="2.5" stroke-linecap="round" />
  <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
</svg>`,

  // 4. Wallet / Stars Favicon
  'wallet.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <path d="M16 6l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L16 20.3 10.4 23.2l1.1-6.2-4.5-4.4 6.2-.9L16 6z" fill="url(#starGrad)" />
  <circle cx="16" cy="15" r="3" fill="#FFE082" opacity="0.8" />
</svg>`,

  // 5. Profile Favicon
  'profile.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="profGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EC4899" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <circle cx="16" cy="12" r="5" fill="url(#profGrad)" />
  <path d="M7 25c0-4.5 4-7 9-7s9 2.5 9 7" fill="url(#profGrad)" />
</svg>`,

  // 6. Community Favicon
  'community.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="commGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <!-- Speech bubbles -->
  <path d="M12 9c-3.9 0-7 2.5-7 5.5 0 1.8 1.1 3.4 2.8 4.3l-.8 2.2 2.7-1.3c.7.2 1.5.3 2.3.3 3.9 0 7-2.5 7-5.5S15.9 9 12 9z" fill="url(#commGrad)" />
  <path d="M20 13c-3.3 0-6 2.1-6 4.7.7 0 1.5-.1 2.2-.3l2.3 1.1-.7-1.9c1.4-.8 2.2-2.1 2.2-3.6 0-2.6-2.7-4.7-6-4.7z" fill="#34D399" opacity="0.8" />
</svg>`,

  // 7. Leaderboard Favicon
  'leaderboard.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <path d="M9 10h14v7c0 3.9-3.1 7-7 7s-7-3.1-7-7v-7zm7 14v4m-5 0h10" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
  <path d="M6 10c-1 0-2 1-2 3v2c0 2 1 3 2 3h3v-8H6zm20 0c1 0 2 1 2 3v2c0 2-1 3-2 3h-3v-8h3z" fill="url(#goldGrad)" />
</svg>`,

  // 8. Events Favicon
  'events.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="eventGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#6D28D9" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <rect x="7" y="9" width="18" height="15" rx="2" stroke="url(#eventGrad)" stroke-width="2" fill="none" />
  <path d="M7 14h18M11 6v3M21 6v3" stroke="url(#eventGrad)" stroke-width="2" stroke-linecap="round" />
  <circle cx="12" cy="18" r="1.5" fill="#C084FC" />
  <circle cx="16" cy="18" r="1.5" fill="#C084FC" />
  <circle cx="20" cy="18" r="1.5" fill="#C084FC" />
</svg>`,

  // 9. Settings Favicon
  'settings.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6B7280" />
      <stop offset="100%" stop-color="#374151" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <circle cx="16" cy="16" r="4" stroke="#9CA3AF" stroke-width="2.5" fill="none" />
  <path d="M16 6v3m0 14v3M6 16h3m14 0h3M9 9l2.1 2.1m9.8 9.8l2.1 2.1m-14 0l2.1-2.1m9.8-9.8l2.1-2.1" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" />
</svg>`,

  // 10. School / CBSE Class Pages Favicon
  'school.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="schoolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <path d="M16 6L5 12l11 6 11-6-11-6z" fill="url(#schoolGrad)" />
  <path d="M9 15v5.5c0 1.5 3.1 3 7 3s7-1.5 7-3V15" stroke="url(#schoolGrad)" stroke-width="2" stroke-linecap="round" fill="none" />
  <path d="M24 13.5V21l1.5.5V14" stroke="#38BDF8" stroke-width="1.5" fill="none" />
</svg>`,

  // 11. Engineering / Coding Favicon
  'engineering.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="engGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0D1117" />
  <path d="M11 10L5 16l6 6M21 10l6 6-6 6M18 7l-4 18" stroke="url(#engGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>`
};

console.log(`[Favicon Generator] Generating themed SVG favicons in ${FAVICON_DIR}...`);

Object.entries(FAVICONS).forEach(([filename, svgContent]) => {
  const filepath = path.join(FAVICON_DIR, filename);
  fs.writeFileSync(filepath, svgContent.trim());
  console.log(`  ✔ Generated: ${filename}`);
});

console.log('[Favicon Generator] Successfully generated all 11 dynamic SVG favicons.');
