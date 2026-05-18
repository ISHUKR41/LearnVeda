# Events Route

This folder owns the events page experience.

- `page.tsx` is the server route shell and metadata boundary.
- `EventsClient.tsx` is the interactive event list plus registration UI.
- `Events.module.css` contains events-only layout, button, status, and feedback styles.

The route should continue reading event availability from backend APIs instead of duplicating backend business rules in the browser.
