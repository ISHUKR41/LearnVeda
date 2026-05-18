# Search Route

This folder owns the public `/search` page.

## Files

- `page.tsx` renders the debounced global search UI.
- `Search.module.css` contains search-input, filter-tab, and result-list styles.

## Notes

The page calls `/api/search`, which reads PostgreSQL through the shared backend pool. Keep query ranking, SQL, and indexing decisions in backend code.
