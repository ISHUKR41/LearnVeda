# Styles

This folder contains shared styling infrastructure.

- `globals.css` owns design tokens, resets, typography, animation primitives, and cross-route utility styles.
- Shared route-style files belong here only when multiple pages intentionally reuse the same page pattern.
- Each user-facing page should keep its own CSS module beside its route whenever the design is page-specific.

