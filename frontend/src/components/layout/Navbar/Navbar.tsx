/*
 * FILE: Navbar.tsx
 * LOCATION: src/components/layout/Navbar/Navbar.tsx
 * PURPOSE: Main top navigation bar for the EduQuest platform.
 *          Sticky, glass-morphism, responsive dropdowns and mobile drawer.
 *          Auth state is read directly from Clerk (useUser + useClerk).
 *          Sign-out calls clerk.signOut() which properly clears the Clerk
 *          session — no redirect loop, no stale cookies.
 * USED BY: src/app/layout.tsx
 * DEPENDENCIES: next/link, lucide-react, @clerk/nextjs, Navbar.module.css
 * LAST UPDATED: 2026-05-31
 */

"use client";

import { useState, useEffect, type FocusEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, Sun, Moon, BookOpen, ChevronDown, Zap,
  Search, Bell, Flame, Swords, User, Wallet, Settings
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import styles from "./Navbar.module.css";

/**
 * Navbar Component
 * Thin wrapper that re-mounts the shell on route changes to keep
 * dropdown state clean without extra manual resets.
 */
export default function Navbar() {
  const pathname = usePathname();
  return <NavbarShell key={pathname} pathname={pathname} />;
}

interface NavbarShellProps {
  pathname: string;
}

/** Stateful navbar implementation */
function NavbarShell({ pathname }: NavbarShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopGroup, setActiveDesktopGroup] = useState<string | null>(null);

  /**
   * Theme state — initializes to TRUE (dark) on both server and client.
   * EduQuest defaults to dark mode. The server renders data-theme="dark" and
   * this initial value matches it, preventing hydration mismatches.
   */
  const [isDark, setIsDark] = useState(true);

  /** Prevents theme icon hydration mismatch — render neutral icon until mounted. */
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();

  /* ── Clerk auth state ──────────────────────────────────────────
   * useUser() is the Clerk-recommended hook for reading the signed-in
   * user. It returns { isLoaded, isSignedIn, user } — no manual fetch needed.
   * useClerk() gives us the signOut() method.
   * ─────────────────────────────────────────────────────────────── */
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();

  /* Read saved theme from localStorage ONLY on the client after mount */
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

  /**
   * handleSignOut — uses Clerk's signOut() method.
   * After Clerk clears its session it redirects to "/" automatically.
   * We also close the mobile menu just in case it was open.
   */
  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    await signOut({ redirectUrl: "/" });
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeDesktopMenuOnBlur = (e: FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setActiveDesktopGroup(null);
    }
  };

  const toggleDesktopGroup = (group: string) => {
    setActiveDesktopGroup(prev => prev === group ? null : group);
  };

  /* Show auth buttons only after Clerk has loaded to avoid flicker */
  const authReady = isLoaded;
  const displayName = clerkUser?.firstName ?? clerkUser?.username ?? "Student";

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`} role="navigation">
      <div className={styles.navbarInner}>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <BookOpen className={styles.logoIcon} size={20} />
          <span className={styles.logoText}>EduQuest</span>
        </Link>

        {/* Desktop Nav */}
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

        {/* Right Actions */}
        <div className={styles.navActions}>

          {/* Search icon */}
          <Link href="/search" className={styles.iconBtn} aria-label="Search">
            <Search size={18} />
          </Link>

          {/* Authenticated-only icons */}
          {authReady && isSignedIn && (
            <>
              <Link href="/notifications" className={styles.iconBtn} aria-label="Notifications">
                <Bell size={17} />
              </Link>
              <Link href="/battle" className={`${styles.iconBtn} ${styles.battleBtn}`} aria-label="Battle Arena">
                <Swords size={17} />
              </Link>
            </>
          )}

          {/* Theme toggle */}
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : <Sun size={18} />}
          </button>

          {/* Auth buttons (desktop) */}
          <div className={styles.authButtons}>
            {/* While Clerk is loading, show nothing to avoid flicker */}
            {authReady && !isSignedIn && (
              <>
                <Link href="/sign-in" className={styles.btnGhost}>Sign In</Link>
                <Link href="/sign-up" className={styles.btnPrimary}>
                  Start Free <Flame size={14} />
                </Link>
              </>
            )}
            {authReady && isSignedIn && (
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

          {/* Hamburger — mobile only */}
          <button
            className={styles.mobileToggle}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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
              {authReady && isSignedIn && (
                <>
                  <Link href="/dashboard" className={styles.drawerBtnPrimary} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/profile" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><User size={16} /> Profile</Link>
                  <Link href="/wallet" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><Wallet size={16} /> Wallet</Link>
                  <Link href="/settings" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><Settings size={16} /> Settings</Link>
                  <button onClick={handleSignOut} className={styles.drawerBtnSecondary}>Sign Out</button>
                </>
              )}
              {authReady && !isSignedIn && (
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
