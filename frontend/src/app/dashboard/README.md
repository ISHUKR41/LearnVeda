# Dashboard Route

This folder owns the signed-in learner dashboard.

- `page.tsx` provides metadata and lazy client loading.
- `DashboardClient.tsx` fetches personalized backend data.
- `Dashboard.module.css` stores dashboard-only layout and feedback styles.

Keep dashboard presentation separate from server-side data assembly in `src/lib/server`.
