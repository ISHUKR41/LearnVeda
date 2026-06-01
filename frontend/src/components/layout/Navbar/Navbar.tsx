/*
 * FILE: Navbar.tsx
 * LOCATION: src/components/layout/Navbar/Navbar.tsx
 * PURPOSE: Main top navigation bar. Auth state from Zustand authStore (hydrated by Providers).
 * LAST UPDATED: 2026-06-01
 */

"use client";

import { useState, useEffect, type FocusEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  Menu, X, Sun, Moon, BookOpen, ChevronDown, Zap,
  Search, Bell, Flame, Swords, User, Wallet, Settings
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  return <NavbarShell key={pathname} pathname={pathname} />;
}

function NavbarShell({ pathname }: { pathname: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopGroup, setActiveDesktopGroup] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("eduquest-theme");
    const prefersDark = stored ? stored === "dark" : true;
    setIsDark(prefersDark);
    if (!stored) localStorage.setItem("eduquest-theme", "dark");
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.dataset.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.dataset.theme = "light";
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("eduquest-theme", newDark ? "dark" : "light");
  };

  /* Sign out — calls the API to clear the server session cookie, then clears local state */
  const { clearUser } = useAuthStore();
  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    try {
      await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
      await signOut({ redirectUrl: "/" });
    } catch {
      /* Continue even if server call fails */
    }
    /* Clear ALL stale auth data from localStorage to prevent the auth-store
       (auth.store.ts) from re-hydrating a ghost session on next page load */
    if (typeof window !== "undefined") {
      localStorage.removeItem("eduquest_user");
      localStorage.removeItem("eduquest_refresh_token");
      localStorage.removeItem("eduquest_session");
    }
    clearUser();
    router.replace("/");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeDesktopMenuOnBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveDesktopGroup(null);
  };

  const toggleDesktopGroup = (group: string) => {
    setActiveDesktopGroup(prev => prev === group ? null : group);
  };

  const authReady = !isLoading;
  const displayName = user?.name?.split(" ")[0] ?? "Student";

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`} role="navigation">
      <div className={styles.navbarInner}>

        <Link href="/" className={styles.logo}>
          <BookOpen className={styles.logoIcon} size={20} />
          <span className={styles.logoText}>EduQuest</span>
        </Link>

        <ul className={styles.navLinks}>
          <li className={styles.navItem} onBlur={closeDesktopMenuOnBlur}>
            <button className={`${styles.navBtn} ${activeDesktopGroup === "classes" ? styles.active : ""}`} onClick={() => toggleDesktopGroup("classes")}>
              Classes <ChevronDown size={14} className={activeDesktopGroup === "classes" ? styles.rotate : ""} />
            </button>
            {activeDesktopGroup === "classes" && (
              <div className={styles.dropdown}>
                <Link href="/class-9" className={styles.dropdownLink}>Class 9</Link>
                <Link href="/class-10" className={styles.dropdownLink}>Class 10</Link>
                <Link href="/class-11" className={styles.dropdownLink}>Class 11</Link>
                <Link href="/class-12" className={styles.dropdownLink}>Class 12</Link>
              </div>
            )}
          </li>
          <li>
            <Link href="/engineering" className={`${styles.navLink} ${isActive("/engineering") ? styles.active : ""}`}>Engineering</Link>
          </li>
          <li className={styles.navItem} onBlur={closeDesktopMenuOnBlur}>
            <button className={`${styles.navBtn} ${activeDesktopGroup === "practice" ? styles.active : ""}`} onClick={() => toggleDesktopGroup("practice")}>
              Practice <ChevronDown size={14} className={activeDesktopGroup === "practice" ? styles.rotate : ""} />
            </button>
            {activeDesktopGroup === "practice" && (
              <div className={styles.dropdown}>
                <Link href="/test" className={styles.dropdownLink}>Test Center</Link>
                <Link href="/battle" className={styles.dropdownLink}>Live Battles</Link>
              </div>
            )}
          </li>
          <li className={styles.navItem} onBlur={closeDesktopMenuOnBlur}>
            <button className={`${styles.navBtn} ${activeDesktopGroup === "explore" ? styles.active : ""}`} onClick={() => toggleDesktopGroup("explore")}>
              Explore <ChevronDown size={14} className={activeDesktopGroup === "explore" ? styles.rotate : ""} />
            </button>
            {activeDesktopGroup === "explore" && (
              <div className={styles.dropdown}>
                <Link href="/community" className={styles.dropdownLink}>Community</Link>
                <Link href="/events" className={styles.dropdownLink}>Events</Link>
                <Link href="/leaderboard" className={styles.dropdownLink}>Leaderboard</Link>
                <Link href="/features" className={styles.dropdownLink}>Features</Link>
                <Link href="/pricing" className={styles.dropdownLink}>Pricing</Link>
                <Link href="/about" className={styles.dropdownLink}>About</Link>
              </div>
            )}
          </li>
        </ul>

        <div className={styles.navActions}>
          <Link href="/search" className={styles.iconBtn} aria-label="Search">
            <Search size={18} />
          </Link>
          {authReady && isAuthenticated && (
            <>
              <Link href="/notifications" className={styles.iconBtn} aria-label="Notifications">
                <Bell size={17} />
              </Link>
              <Link href="/battle" className={`${styles.iconBtn} ${styles.battleBtn}`} aria-label="Battle Arena">
                <Swords size={17} />
              </Link>
            </>
          )}
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : <Sun size={18} />}
          </button>
          <div className={styles.authButtons}>
            {authReady && !isAuthenticated && (
              <>
                <Link href="/sign-in" className={styles.btnGhost}>Sign In</Link>
                <Link href="/sign-up" className={styles.btnPrimary}>
                  Start Free <Flame size={14} />
                </Link>
              </>
            )}
            {authReady && isAuthenticated && (
              <>
                <Link href="/dashboard" className={styles.btnGhost}>
                  <Zap size={14} /> {displayName}
                </Link>
                <button onClick={handleSignOut} className={styles.btnGhost} style={{ cursor: "pointer" }}>
                  Sign Out
                </button>
              </>
            )}
          </div>
          <button className={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={() => setIsMobileMenuOpen(false)} />
          <div className={styles.mobileDrawer}>
            <div className={styles.drawerHeader}>
              <span className={styles.logoText}>EduQuest</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className={styles.closeBtn}><X size={24} /></button>
            </div>
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>Learn</div>
              <Link href="/class-9" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Class 9</Link>
              <Link href="/class-10" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Class 10</Link>
              <Link href="/class-11" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Class 11</Link>
              <Link href="/class-12" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Class 12</Link>
              <Link href="/engineering" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Engineering</Link>
            </div>
            <div className={styles.drawerSection}>
              <div className={styles.drawerSectionTitle}>Practice & Explore</div>
              <Link href="/test" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Test Center</Link>
              <Link href="/battle" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Live Battles</Link>
              <Link href="/community" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
              <Link href="/events" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
              <Link href="/leaderboard" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</Link>
              <Link href="/features" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
              <Link href="/pricing" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            </div>
            <div className={styles.drawerAuth}>
              {authReady && isAuthenticated && (
                <>
                  <Link href="/dashboard" className={styles.drawerBtnPrimary} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/profile" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><User size={16} /> Profile</Link>
                  <Link href="/wallet" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><Wallet size={16} /> Wallet</Link>
                  <Link href="/settings" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><Settings size={16} /> Settings</Link>
                  <button onClick={handleSignOut} className={styles.drawerBtnSecondary}>Sign Out</button>
                </>
              )}
              {authReady && !isAuthenticated && (
                <>
                  <Link href="/sign-in" className={styles.drawerBtnSecondary} onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link href="/sign-up" className={styles.drawerBtnPrimary} onClick={() => setIsMobileMenuOpen(false)}>Start Free</Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
