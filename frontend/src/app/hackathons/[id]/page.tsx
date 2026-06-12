import React from "react";
import { Metadata } from "next";
import HackathonDetailClient from "./HackathonDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Hackathon: ${resolvedParams.id} | LearnVeda`,
    description: "Join this hackathon on LearnVeda to build real-world projects, win prizes, and showcase your skills.",
  };
}

export default async function HackathonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Mock detailed data for the specific hackathon
  const hackathon = {
    id: resolvedParams.id,
    title: resolvedParams.id === "ai-innovators-2026" ? "AI Innovators Challenge 2026" : "Web3 Global Buildathon",
    theme: resolvedParams.id === "ai-innovators-2026" ? "Artificial Intelligence" : "Blockchain & Web3",
    description: "Join the most prestigious coding challenge of the year. Build a project that solves a real-world problem using cutting-edge technologies. You'll have 48 hours to ideate, build, and pitch your solution to our panel of industry experts.",
    date: "August 15 - 17, 2026",
    prizePool: "$10,000",
    participants: 1250,
    image: resolvedParams.id === "ai-innovators-2026" 
      ? "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200"
      : "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200",
    status: "upcoming" as const,
    rules: [
      "Maximum team size is 4 members.",
      "All code must be written during the hackathon period.",
      "Open source libraries and APIs are allowed.",
      "Projects must be submitted before the deadline."
    ],
    timeline: [
      { event: "Registration Closes", time: "Aug 14, 11:59 PM" },
      { event: "Opening Ceremony", time: "Aug 15, 9:00 AM" },
      { event: "Hacking Begins", time: "Aug 15, 10:00 AM" },
      { event: "Submission Deadline", time: "Aug 17, 10:00 AM" },
      { event: "Winners Announced", time: "Aug 17, 5:00 PM" }
    ]
  };

  return <HackathonDetailClient hackathon={hackathon} />;
}
