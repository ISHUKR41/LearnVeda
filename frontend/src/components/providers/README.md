# Providers — Application Context Wrapper

## What This Folder Is

This folder contains the root `Providers` component that wraps the entire EduQuest application with all necessary React context providers.

## Why a Separate Providers Folder?

Next.js App Router layouts must export a server component by default. But providers like TanStack Query and React Hot Toast require `"use client"`. 

By isolating all providers in this separate `Providers.tsx` client component, the root `layout.tsx` can remain a server component while still giving every child access to all the context they need.

## What Providers Are Included

| Provider | Package | Purpose |
|----------|---------|---------|
| `QueryClientProvider` | `@tanstack/react-query` | Manages server state, caching, and background data refresh |
| `ThemeInitializer` | Custom (uses Zustand) | Restores dark/light theme from localStorage on first load |
| `Toaster` | `react-hot-toast` | Renders beautiful toast notifications in the top-right corner |

## How to Add a New Provider

1. Import your provider at the top of `Providers.tsx`
2. Wrap `{children}` with the new provider
3. Add a comment explaining why the provider is needed
4. Update this README table

## Toast Usage in Components

```tsx
import toast from "react-hot-toast";

// Success toast
toast.success("Level up! You reached Level 5!");

// Error toast
toast.error("Something went wrong. Please try again.");

// Loading toast (returns an ID you can update)
const toastId = toast.loading("Submitting your answer...");
toast.success("Correct! +20 XP", { id: toastId });
```

## TanStack Query Usage in Components

```tsx
import { useQuery, useMutation } from "@tanstack/react-query";

// Fetch data with automatic caching
const { data, isLoading } = useQuery({
  queryKey: ["leaderboard", "global"],
  queryFn: () => fetch("/api/leaderboard").then(r => r.json()),
});
```
