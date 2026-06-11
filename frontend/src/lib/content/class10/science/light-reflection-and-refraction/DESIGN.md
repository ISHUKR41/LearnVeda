# DESIGN.md — Light: Reflection and Refraction Chapter
## EduQuest Class 10 Science — Design System Reference

> Inspired by getdesign.md design principles + skills.sh component patterns.
> This file documents all visual tokens, component patterns, and UX conventions
> used in the Light chapter. Every future page update must follow these rules.

---

## Color Palette (CSS Custom Properties)

| Token | Value | Usage |
|---|---|---|
| `--color-bg-deep` | `#050d1a` | Page background |
| `--color-bg-surface` | `rgba(15,23,42,0.8)` | Cards, panels |
| `--color-bg-glass` | `rgba(255,255,255,0.04)` | Glass morphism overlay |
| `--color-accent-primary` | `#818cf8` | Indigo — primary accent, active states |
| `--color-accent-amber` | `#fbbf24` | Amber — formulas, math, highlights |
| `--color-accent-green` | `#34d399` | Emerald — success, tips, correct answers |
| `--color-accent-cyan` | `#06b6d4` | Cyan — real-life examples, lenses |
| `--color-accent-red` | `#f87171` | Red — real images in ray diagrams |
| `--color-accent-purple` | `#a855f7` | Purple — key points, advanced concepts |
| `--color-text-primary` | `#e2e8f0` | Main body text |
| `--color-text-secondary` | `#94a3b8` | Subtitles, metadata |
| `--color-text-muted` | `#64748b` | Labels, placeholders |
| `--color-border` | `rgba(255,255,255,0.07)` | Card borders |

---

## Typography

```css
/* Headings */
font-family: "Inter", "Plus Jakarta Sans", system-ui, sans-serif;
h1: 2.25rem / 700 weight / letter-spacing -0.03em
h2: 1.75rem / 700 weight
h3: 1.25rem / 700 weight / color #c7d2fe (indigo-200)

/* Body text */
font-size: 0.9375rem (15px)
line-height: 1.75
color: #cbd5e1

/* Math/Code */
font-family: "JetBrains Mono", monospace
color: #fbbf24 (amber) for formulas
```

---

## Callout Card System

Use the `:::type icon Label|Text:::` syntax in topic content markdown.

### Available Types

| Type | Border | Background | Icon | Use When |
|---|---|---|---|---|
| `formula` | `#fbbf24` | amber/7% | 📐 | Key equations, formulas |
| `tip` | `#34d399` | green/6% | 💡 | Study tips, memory aids |
| `warning` | `#fb923c` | orange/7% | ⚠️ | Common mistakes, sign errors |
| `reallife` | `#06b6d4` | cyan/6% | 🌍 | Real-world applications |
| `definition` | `#818cf8` | indigo/7% | 📖 | Key term definitions |
| `keypoint` | `#a855f7` | purple/7% | 🔑 | Exam must-knows |

### Example Syntax
```markdown
:::formula 📐 Mirror Formula|1/v + 1/u = 1/f  where f = R/2:::
:::tip 💡 Sign Convention|Always measure distances from the pole (P) of the mirror.:::
:::reallife 🚗 Real-life Example|Convex mirrors used as rear-view mirrors give wider field of view.:::
:::warning ⚠️ Common Mistake|Do NOT measure angles from the mirror surface — always from the Normal!:::
:::keypoint 🔑 Exam Must-Know|∠i = ∠r applies to BOTH plane and spherical mirrors.:::
```

---

## Simulation Component Design Rules

### Canvas Simulation Guidelines (skills.sh — web-component-design)

1. **Background**: Always `#060d1a` — deep space navy
2. **Principal axis**: `rgba(255,255,255,0.12)` dashed line
3. **Glow effect**: Use `shadowBlur` on canvas context for ray glow
4. **Animated photon**: White dot (`ctx.arc` radius 4px) with coloured shadow
5. **Ray colours**:
   - Incident ray: white / user-selected colour
   - Reflected ray: same colour as incident
   - Refracted ray: `#fde047` (yellow)
   - Virtual extensions: same colour at 40% alpha + dashed
6. **Controls**: Buttons below canvas with 3px left-border hover effect
7. **Live readout**: Dark pill badges showing calculated values
8. **Loading state**: `⏳ Loading simulation...` centred in 200px container

### Simulation Card Wrapper
```tsx
/* In SmartSimulationRenderer expandedMode */
background: rgba(6, 9, 26, 0.8)
border: 1px solid rgba(129, 140, 248, 0.15)
borderRadius: 20px
padding: 28px
marginBottom: 28px
```

---

## Component Patterns (skills.sh — compound components)

### Study Tabs
- 6 tabs: Learn | Simulations (n) | Flash Cards | Mind Map | Practice (50) | Exam Prep
- Active tab: `border-bottom: 2px solid #818cf8`
- Badge: `background: rgba(129,140,248,0.2)` rounded pill

### Topic Sidebar
- Left panel: 280px fixed
- Progress ring: SVG circle with `stroke-dasharray` animation
- Active topic: `background: rgba(129,140,248,0.08)`
- "Focus →" link on hover: `color: #818cf8`

### Question Cards
- MCQ: 4 options with hover glow; correct = green; wrong = red
- HOTS: expandable with model answer reveal
- XP toast: amber `+10 XP ⭐` notification on correct answer

---

## Layout Grid

```
┌─────────────────────────────────────────────────────┐
│ Sticky header: Chapter title + Score bar            │
├─────────────┬───────────────────────────────────────┤
│  Sidebar    │  Main Content                         │
│  280px      │  flex-grow: 1                         │
│  (topics)   │  max-width: 860px (learn panel)       │
│             │  padding: 36px 48px                   │
└─────────────┴───────────────────────────────────────┘
```

---

## Animation Conventions

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| Tab switch | 200ms | ease | Content fade-in |
| Card hover | 200ms | ease | `translateY(-2px)` lift |
| Callout hover | 200ms | ease | `translateX(2px)` slide |
| XP toast | 300ms | spring | Bounce in from top |
| Progress ring | 500ms | ease | Stroke-dasharray change |
| Photon animation | RAF loop | linear | Canvas animation |

---

## Accessibility

- All interactive elements: `cursor: pointer`, focus-visible ring
- Canvas simulations: `role="img" aria-label="..."` on the canvas element
- Colour contrast: All text ≥ 4.5:1 on dark backgrounds
- Tab navigation: All buttons and links keyboard-reachable

---

## File Structure Convention

```
frontend/src/
  components/simulations/light/
    reflection/    # PlaneMirrorSim, ReflectionInteractiveSim, TwoMirrorsSim
    mirrors/       # ConcaveMirrorSim, MirrorObjectImageSim, SphericalMirrorTermsSim
    refraction/    # SnellsLawSim, GlassSlabSim, CriticalAngleSim
    lenses/        # ConvexLensSim, LensRayDiagramSim, PowerOfLensSim
    dispersion/    # PrismDispersionSim, PrismColorLabSim, RainbowFormationSim
    eye/           # HumanEyeSim
    SimulationEngine.tsx      # Physics utilities
    SimulationRegistry.tsx    # ID → Component mapping
  components/chapter/light/
    TopicDiagrams.tsx         # Static SVG diagrams (9 topics)
    TopicDiagrams.module.css  # Diagram styles
```

---

*Last updated: 2026-06-11 | EduQuest Design System v2.0*
