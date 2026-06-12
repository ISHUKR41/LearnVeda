/**
 * FILE: page.tsx
 * LOCATION: src/app/admin/host-applications/page.tsx
 * PURPOSE: Admin-only review console for event host applications.
 * LAST UPDATED: 2026-05-19
 */

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthenticatedUserFromToken } from "@/lib/server/auth/current-user";
import styles from "./AdminHostApplications.module.css";

export const metadata = {
  title: "Host Applications Review | VidyaBolt Admin",
  description: "Review and manage institution event hosting applications.",
};

const AdminHostApplicationsClient = dynamic(() => import("./AdminHostApplicationsClient"), {
  loading: () => <div className={styles.loadingSkeleton} aria-label="Loading admin console…" />,
});

export default async function AdminHostApplicationsPage() {
  // Uses Clerk auth (primary) with legacy cookie fallback
  const user = await getAuthenticatedUserFromToken(undefined);

  if (!user) {
    redirect("/sign-in?redirect_url=/admin/host-applications");
  }


  if (user.role !== "admin") {
    return (
      <div className={styles.unauthorized}>
        <h1>Admin Access Required</h1>
        <p>You do not have permission to review host applications.</p>
        <Link href="/" className={styles.ctaLink}>Return to home</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Image
          src="/images/admin-ops-hero.svg"
          alt="Admin operations background"
          fill
          priority
          className={styles.heroMedia}
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}>
            <ShieldCheck size={14} aria-hidden="true" /> Admin Review Console
          </div>
          <h1 className={styles.heroTitle}>Host Application Review</h1>
          <p className={styles.heroSubtitle}>
            Evaluate institution event requests, capture review notes, and publish outcomes in one place.
          </p>
        </div>
      </section>

      <div className={styles.content}>
        <AdminHostApplicationsClient />
      </div>
    </div>
  );
}
