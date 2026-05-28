/*
 * FILE: Navbar.tsx
 * LOCATION: src/components/layout/Navbar/Navbar.tsx
 * PURPOSE: Main top navigation bar for the EduQuest platform.
 *          Sticky, glass-morphism, responsive dropdowns and mobile drawer.
 * USED BY: src/app/layout.tsx
 * DEPENDENCIES: next/link, lucide-react, Navbar.module.css, constants.ts
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useState, useEffect, type FocusEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, Sun, Moon, BookOpen, ChevronDown, Zap,
  Search, Bell, Flame, Swords, User, Wallet, Settings, ShieldCheck
} from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import styles from "./Navbar.module.css";
import type { PublicUser } from "@/types/auth";

/**
 * Navbar Component
 * @cache-buster - Added to invalidate stale Turbopack browser cache
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
  const { isLoaded, isSignedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDesktopGroup, setActiveDesktopGroup] = useState<string | null>(null);
  /**
   * Theme state — initializes to TRUE (dark) on both server and client.
   * EduQuest defaults to dark mode. The server renders data-theme="dark" and
   * this initial value matches it, preventing hydration mismatches.
   * The actual localStorage value is then read in useEffect to honour
   * any explicit user preference (only switching to light if they saved "light").
   */
  const [isDark, setIsDark] = useState(true);
  /** Tracks whether the component has mounted on the client. Used to prevent
   *  theme icon hydration mismatch — we render a neutral icon until mounted. */
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [sessionState, setSessionState] = useState<"checking" | "guest" | "authenticated">("checking");
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);

  /* Read saved theme from localStorage ONLY on the client after mount.
   * Default is dark — only switch to light if the user explicitly saved "light".
   * This prevents the server from rendering a different icon than the client. */
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("eduquest-theme");
    // If no stored preference, keep dark (matches server default).
    // Only honour an explicit "light" choice.
    const prefersDark = stored ? stored === "dark" : true;
    setIsDark(prefersDark);
    // Persist the default so future page loads are also consistent.
    if (!stored) {
      localStorage.setItem("eduquest-theme", "dark");
    }
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

  useEffect(() => {
    let isMounted = true;
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!isMounted) return;

        if (res.ok) {
          const payload = await res.json();
          const user = payload?.data?.user ?? null;
          setCurrentUser(user);
          setSessionState(user ? "authenticated" : "guest");
          return;
        }

        setCurrentUser(null);
        setSessionState("guest");
      } catch {
        if (isMounted) {
          setCurrentUser(null);
          setSessionState("guest");
        }
      }
    }
    loadSession();
    return () => { isMounted = false; };
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("eduquest-theme", newDark ? "dark" : "light");
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    setSessionState("guest");
    setCurrentUser(null);
    setIsMobileMenuOpen(false);
    router.push("/");
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

  const isAdmin = currentUser?.role === "admin";

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
                <Link href="/hackathon" className={styles.dropdownLink}>Hackathons</Link>
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

          {/* Search icon — always visible, links to the global search page */}
          <Link href="/search" className={styles.iconBtn} aria-label="Search">
            <Search size={18} />
          </Link>

          {/* Authenticated-only icons: notifications bell + streak flame */}
          {isLoaded && isSignedIn && (
            <>
              <Link href="/notifications" className={styles.iconBtn} aria-label="Notifications">
                <Bell size={17} />
              </Link>
              <Link href="/battle" className={`${styles.iconBtn} ${styles.battleBtn}`} aria-label="Battle Arena">
                <Swords size={17} />
              </Link>
            </>
          )}

          {/* Theme toggle — shows neutral Sun until client-side mount to avoid hydration mismatch */}
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            {mounted ? (isDark ? <Sun size={18} /> : <Moon size={18} />) : <Sun size={18} />}
          </button>

          {/* Auth buttons (desktop) */}
          <div className={styles.authButtons}>
            {isLoaded && !isSignedIn && (
              <>
                <Link href="/sign-in" className={styles.btnGhost}>Sign In</Link>
                <Link href="/sign-up" className={styles.btnPrimary}>
                  Start Free <Flame size={14} />
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <>
                <Link href="/dashboard" className={styles.btnGhost}>
                  <Zap size={14} /> Dashboard
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: `${styles.accountAvatarBox} w-8 h-8 rounded-full border border-[rgba(255,255,255,0.06)]`
                    }
                  }}
                />
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
              <Link href="/hackathon" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Hackathons</Link>
              <Link href="/leaderboard" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Leaderboard</Link>
              <Link href="/features" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
              <Link href="/pricing" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            </div>

            <div className={styles.drawerAuth}>
              {isLoaded && isSignedIn && (
                <>
                  <Link href="/dashboard" className={styles.drawerBtnPrimary} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/profile" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><User size={16} /> Profile</Link>
                  <Link href="/wallet" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><Wallet size={16} /> Wallet</Link>
                  <Link href="/settings" className={styles.drawerLink} onClick={() => setIsMobileMenuOpen(false)}><Settings size={16} /> Settings</Link>
                  <div style={{ padding: "8px 16px" }}>
                    <UserButton />
                  </div>
                </>
              )}
              {isLoaded && !isSignedIn && (
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
