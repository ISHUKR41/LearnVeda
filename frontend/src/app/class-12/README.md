# Class 12 Route

This folder owns the Class 12 landing page and its future exam-focused route-specific UI assets.

- `page.tsx` keeps metadata and exam-focused overview copy server-rendered.
- `Class12StreamSelector.tsx` owns only the interactive stream tabs and visible subject-card grid.
- `Class12.module.css` stores only Class 12 page styles.
- `[stream]/[subject]/page.tsx` renders stream-aware detail pages.

Keep Class 12 exam preparation logic and presentation isolated from other classes.
