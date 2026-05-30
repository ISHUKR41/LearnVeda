"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import { ClerkProvider } from "@clerk/nextjs";
import { useUIStore } from "@/store/uiStore";

const LevelUpModal = dynamic(
  () => import("@/components/gamification/LevelUpModal"),
  { ssr: false },
);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

function ThemeInitializer() {
  const setTheme = useUIStore((state) => state.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem("eduquest-theme");
    const shouldBeDark = stored ? stored === "dark" : true;

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }

    setTheme(shouldBeDark);
  }, [setTheme]);

  return null;
}

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2563EB",
          colorBackground: "#0b1120",
          colorInputBackground: "#0f172a",
          colorInputText: "#f1f5f9",
          colorText: "#f1f5f9",
          colorTextSecondary: "#94a3b8",
          colorNeutral: "#1e293b",
          borderRadius: "10px",
        },
        elements: {
          card: { background: "#0b1120", border: "1px solid #1e293b" },
          headerTitle: { color: "#f1f5f9" },
          headerSubtitle: { color: "#64748b" },
          formButtonPrimary: { background: "#2563EB" },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeInitializer />
        {children}
        <LevelUpModal />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "10px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              maxWidth: "380px",
              padding: "12px 16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
            },
            success: {
              iconTheme: { primary: "#10B981", secondary: "#ECFDF5" },
              style: { background: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#FEF2F2" },
              style: { background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" },
            },
          }}
        />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
