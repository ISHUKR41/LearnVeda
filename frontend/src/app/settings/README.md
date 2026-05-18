# Settings Route

This folder owns the authenticated `/settings` page.

## Files

- `page.tsx` renders profile settings, track selection, security placeholders, and account actions.
- `Settings.module.css` contains settings-page layout and form styles.

## Notes

Settings writes should call backend APIs once those endpoints are implemented. Do not mutate account state only in the browser for production-critical settings.
