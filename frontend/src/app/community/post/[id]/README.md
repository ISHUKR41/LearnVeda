# Community Post Detail Route

This folder owns the page for one community discussion at `/community/post/[id]`.

- `page.tsx` loads one persisted post from the backend repository layer.
- `CommunityPostDetail.module.css` keeps this page's styles separate from the community feed.
- `loading.tsx` provides a route-local skeleton while the server page is loading.

Only post detail UI belongs here. Feed filters, post creation, and category navigation stay in `src/app/community`.
