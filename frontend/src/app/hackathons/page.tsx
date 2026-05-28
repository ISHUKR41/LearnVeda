import React from "react";
import { Metadata } from "next";
import HackathonsClient from "./HackathonsClient";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

export const metadata: Metadata = {
  title: "Hackathons & Challenges | EduQuest",
  description: "Discover and participate in premium coding hackathons. Build real-world projects, win prizes, and showcase your skills.",
};

export default function HackathonsPage() {
  // In a real production setup, we would fetch upcoming hackathons from the database here.
  // For now, we pass mock data to the client component to demonstrate the professional UI.
  const upcomingHackathons = [
    {
      id: "ai-innovators-2026",
      title: "AI Innovators Challenge 2026",
      theme: "Artificial Intelligence",
      date: "August 15, 2026",
      prizePool: "$10,000",
      participants: 1250,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      status: "upcoming" as const,
    },
    {
      id: "web3-buildathon",
      title: "Web3 Global Buildathon",
      theme: "Blockchain & Decentralization",
      date: "September 05, 2026",
      prizePool: "$25,000",
      participants: 840,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
      status: "upcoming" as const,
    },
    {
      id: "green-tech-sprint",
      title: "Green Tech Sprint",
      theme: "Sustainability",
      date: "July 20, 2026",
      prizePool: "$5,000",
      participants: 3200,
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=800",
      status: "active" as const,
    }
  ];

  return (
    <>
      <SchemaMarkup 
        type="FAQPage" 
        data={[
          { question: "What is an EduQuest Hackathon?", answer: "It is a coding competition to build real-world projects." },
          { question: "Is it free to join?", answer: "Yes, all our hackathons are free to join." }
        ]}
      />
      <HackathonsClient hackathons={upcomingHackathons} />
    </>
  );
}
