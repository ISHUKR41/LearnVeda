# Hooks — Custom React Hooks

## What This Folder Is

This folder contains all **custom React hooks** for EduQuest. Each hook encapsulates a specific piece of reusable logic and provides a clean interface for components to use.

## Hooks in This Folder

| File | Purpose |
|------|---------|
| `useAuth.ts` | Session hydration + auth state from Zustand authStore |
| `useLevel.ts` | XP, level number, progress bar data from levelStore |
| `useStreak.ts` | Daily streak count, at-risk detection from streakStore |

## How to Write a New Hook

1. Create a new file: `src/hooks/useYourFeature.ts`
2. Name the function with the `use` prefix (React rules)
3. Accept parameters if needed, return a plain object
4. Import from Zustand stores or use TanStack Query internally
5. Add detailed English comments
6. Update this README

## Example: Using a Hook in a Component

```tsx
import { useAuth } from "@/hooks/useAuth";

function ProfileCard() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading…</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

## Comment Standards

Every hook file MUST include:
- File-level header comment block (FILE, LOCATION, PURPOSE, USED BY)
- JSDoc comment on the exported hook function explaining all return values
- Inline comments on any non-obvious logic
