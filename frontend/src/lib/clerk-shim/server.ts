import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/server/auth/session";

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("eduquest_session")?.value;
  return await verifySessionToken(token);
}

export async function auth() {
  const session = await getSession();
  return {
    userId: session?.sub ?? null,
    sessionId: session?.sid ?? null,
    protect: async () => {
      if (!session) {
        const { redirect } = await import("next/navigation");
        redirect("/sign-in");
      }
    },
  };
}

export async function currentUser() {
  const session = await getSession();
  if (!session) return null;
  return {
    id: session.sub,
    firstName: session.name?.split(" ")[0] ?? null,
    lastName: session.name?.split(" ").slice(1).join(" ") || null,
    username: session.email?.split("@")[0] ?? null,
    primaryEmailAddress: { emailAddress: session.email },
    emailAddresses: [{ emailAddress: session.email }],
  };
}
