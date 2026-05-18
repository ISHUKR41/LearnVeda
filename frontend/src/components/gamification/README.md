# Gamification Components

## What This Folder Is

This folder contains all **gamification UI components** for EduQuest. These components are what make the platform feel like a game — XP progress bars, streak counters, level badges, and celebration modals.

## Components in This Folder

| Component | Purpose |
|-----------|---------|
| `XPBar.tsx` | Animated XP progress bar — shows current level and % toward next level |
| `StreakCounter.tsx` | Daily streak display with flame icon, tier colours, and at-risk warning |
| `LevelBadge.tsx` | Compact pill badge with level number and tier-based gradient colour |

## How Gamification Works

```
Student answers question correctly
  → +XP awarded (client-side via addXp() action)
  → XPBar animates to new fill percentage
  → If level threshold crossed → LevelUpModal triggered
  → If today's first correct answer → streak increments
```

## Tier System (LevelBadge)

| Level Range | Tier | Colour |
|-------------|------|--------|
| 1–9 | Novice | Grey |
| 10–24 | Apprentice | Blue |
| 25–49 | Skilled | Green |
| 50–74 | Expert | Purple |
| 75–99 | Master | Orange |
| 100 | Legend | Gold |

## Usage Examples

```tsx
import XPBar from "@/components/gamification/XPBar";
import StreakCounter from "@/components/gamification/StreakCounter";
import LevelBadge from "@/components/gamification/LevelBadge";

// In a dashboard card:
<XPBar showLabels compact />
<StreakCounter compact />
<LevelBadge size="sm" />

// On the profile page:
<XPBar showLabels />
<StreakCounter showLongest showAtRisk />
<LevelBadge size="lg" />
```

## Comment Standards

Every component file MUST include:
- File-level header comment block (FILE, LOCATION, PURPOSE, USED BY, DEPENDENCIES)
- JSDoc on the exported component function explaining all props
- Inline comments on tier logic, animation triggers, and any non-obvious code
