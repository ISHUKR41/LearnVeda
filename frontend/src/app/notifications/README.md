# Notifications Route

This folder owns the authenticated `/notifications` inbox.

## Files

- `page.tsx` fetches `/api/notifications`, renders notification states, and marks notifications as read.
- `Notifications.module.css` contains notification-list, empty-state, and loading styles.

## Notes

The page reads real notification rows through the API. Do not query PostgreSQL directly from this client component; schema logic belongs in `src/app/api/notifications/route.ts`.
