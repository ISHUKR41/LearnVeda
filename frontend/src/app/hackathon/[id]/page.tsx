/**
 * FILE: page.tsx
 * LOCATION: src/app/hackathon/[id]/page.tsx
 * PURPOSE: Server-side page handler for individual Hackathon detail page.
 *          Resolves dynamic route parameters ([id]), fetches hackathon metadata
 *          from backend to serve custom SEO headers, and mounts the HackathonDetailClient.
 * ROUTE: /hackathon/:id
 * USED BY: Next.js App Router
 * DEPENDENCIES: HackathonDetailClient, next/navigation, next/metadata
 * LAST UPDATED: 2026-05-27
 */

import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import HackathonDetailClient from "./HackathonDetailClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate dynamic metadata for search engines.
 * Hits backend API to grab latest title and description details.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
    const res = await fetch(`${backendUrl}/api/hackathons/${id}`, {
      next: { revalidate: 300 } // Cache metadata for 5 minutes
    });

    if (!res.ok) {
      return {
        title: "Hackathon Detail | EduQuest",
        description: "Join national level coding hackathons and prove your software engineering skills."
      };
    }

    const payload = await res.json();
    const hackathon = payload?.data?.hackathon;

    if (!hackathon) {
      return {
        title: "Hackathon Not Found | EduQuest",
        description: "The requested hackathon event is either completed or not active."
      };
    }

    return {
      title: `${hackathon.title} — National Engineering Hackathon | EduQuest`,
      description: `${hackathon.description} Join ${hackathon.collegeName}'s event on EduQuest. Prize Pool: ${hackathon.venue || "Online"}. Aligned with BTech/MCA syllabus.`,
      openGraph: {
        title: hackathon.title,
        description: hackathon.description,
        type: "website",
        url: `/hackathon/${id}`,
        images: hackathon.bannerUrl ? [{ url: hackathon.bannerUrl }] : []
      }
    };
  } catch (error) {
    console.error("[hackathon/[id]/page] Error generating SEO metadata:", error);
    return {
      title: "EduQuest Hackathon Details",
      description: "Learn, compete, and showcase your engineering projects on India's largest competitive learning portal."
    };
  }
}

export default async function HackathonDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Render Client Portal Component
  return <HackathonDetailClient id={id} />;
}
