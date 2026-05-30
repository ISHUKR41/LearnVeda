import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import DashboardLoadingSkeleton from "./DashboardLoadingSkeleton";

export const metadata = {
  title: "Dashboard",
  description: "Your EduQuest learning progress, streaks, XP, battles, and quick actions.",
  icons: {
    icon: "/favicons/dashboard.svg",
  },
};

const DashboardClient = dynamic(() => import("./DashboardClient"), {
  loading: () => <DashboardLoadingSkeleton />,
});

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("eduquest_session");

  if (!session) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  return <DashboardClient />;
}
