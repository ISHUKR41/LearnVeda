# Store — Zustand Global State

## What This Folder Is

This folder contains all **Zustand** global state stores for EduQuest.

Zustand is a lightweight state management library for React. It replaces the need for Redux or Context API for global state. Each store manages one specific concern of the application.

## Why Zustand Instead of Context?

- **Simpler syntax** — no Provider wrapping, no useReducer boilerplate
- **Better performance** — components only re-render when their slice of state changes
- **TypeScript-native** — full type inference out of the box
- **Devtools support** — works with Redux DevTools browser extension

## Stores in This Folder

| File | Purpose |
|------|---------|
| `authStore.ts` | Logged-in user, session state, and auth actions |
| `levelStore.ts` | XP points, level number, progress bar, level-up modal |
| `streakStore.ts` | Daily streak count, at-risk detection, today's completion |
| `uiStore.ts` | Dark/light theme, page loading, mobile menu state |

## How to Use a Store in a Component

```tsx
import { useAuthStore } from "@/store/authStore";

function MyComponent() {
  // Only subscribe to what you need — avoids unnecessary re-renders
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  return <div>{user?.name}</div>;
}
```

## Adding a New Store

1. Create a new file: `src/store/yourFeatureStore.ts`
2. Define a TypeScript interface for the state shape
3. Export a `create<YourState>(...)` store
4. Add detailed English comments explaining every field and action
5. Update this README to document the new store

## Comment Standards

Every store file MUST include:
- A file-level comment block (FILE, LOCATION, PURPOSE, USED BY, DEPENDENCIES)
- A comment on every state field explaining what it represents
- A comment on every action explaining what it does and when to call it
