# Profile Route

This folder owns the authenticated `/profile` page.

## Files

- `page.tsx` renders user progress, XP, streaks, subject progress, and recent activity.
- `Profile.module.css` contains profile-specific layout, stat, and responsive styles.

## Notes

The page loads real profile data through `/api/profile`. Keep database joins and schema mapping inside the API route, not inside this client component.
