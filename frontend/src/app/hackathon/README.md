# Hackathon Portal Architecture & Directory

This directory contains the fully modular, professional, and production-ready **Hackathon Portal** for EduQuest.

## Directory Structure

```txt
frontend/src/app/hackathon/
 ├── README.md               ← This documentation file
 ├── page.tsx                ← Next.js Server Page shell with dynamic import & SEO metadata
 ├── HackathonClient.tsx     ← Highly interactive Client Component shell with forms and states
 └── Hackathon.module.css    ← Isolated CSS Module styling (glassmorphism & dark-mode harmonized)
```

## Core Implementation Pattern

1. **Server Shell (`page.tsx`)**:
   - Manages page metadata for optimal Search Engine Optimization (SEO) dominance in India.
   - Dynamically imports the interactive client component using `next/dynamic` with a modular loader skeleton to maintain speed and Core Web Vitals under high traffic.

2. **Client Shell (`HackathonClient.tsx`)**:
   - Manages search filters (Active, Upcoming, Completed).
   - Handles real-time project submissions with built-in validation (GitHub/Deployed URLs).
   - Showcases leaderboard standings, wager details (Level requirements & Stars entry fees), and an interactive rules accordion.
   - Synchronizes registration state with the browser's local storage to prevent data loss.

3. **Isolated Styling (`Hackathon.module.css`)**:
   - Implements tailored CSS variables supporting beautiful Dark/Light mode integration, glassmorphism, responsive grids, and subtle micro-interactions.
