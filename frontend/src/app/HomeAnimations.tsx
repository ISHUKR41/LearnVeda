/*
 * FILE: HomeAnimations.tsx
 * LOCATION: src/app/HomeAnimations.tsx
 * PURPOSE: Client component to handle intersection observer animations for the homepage.
 * USED BY: src/app/page.tsx
 * DEPENDENCIES: react
 * LAST UPDATED: 2026-05-17
 */

"use client";

import { useEffect } from "react";

/**
 * Attaches IntersectionObserver to elements with .animate-on-scroll class
 */
export default function HomeAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
