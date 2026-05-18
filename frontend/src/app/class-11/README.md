# Class 11 Route

This folder owns the Class 11 stream-based landing page and its future route-specific UI assets.

- `page.tsx` keeps metadata and static route copy server-rendered.
- `Class11StreamSelector.tsx` owns only the interactive stream tabs and visible subject-card grid.
- `Class11.module.css` stores only Class 11 page styles.
- `[stream]/[subject]/page.tsx` renders stream-aware detail pages.

Science, Commerce, and Humanities behavior should stay explicit in this route family.
