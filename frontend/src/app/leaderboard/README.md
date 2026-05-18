# Leaderboard Route

This folder owns the leaderboard route experience.

- `page.tsx` provides the server shell and lazy client loading.
- `LeaderboardClient.tsx` handles interactive ranking filters.
- `Leaderboard.module.css` keeps leaderboard-only layout and presentation styles isolated.

Leaderboard ranking should eventually connect to the backend repository and Redis-backed counters without mixing that logic into page files.
