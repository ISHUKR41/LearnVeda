import type { NextRequest } from "next/server";
import { getSessionFromRequest, verifySessionToken } from "@/lib/server/auth/session";
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { PublicUser } from "@/types/auth";

export async function getAuthenticatedUser(request: NextRequest): Promise<PublicUser | null> {
  const session = getSessionFromRequest(request);
  return getAuthenticatedUserFromPayload(session);
}

export async function getAuthenticatedUserFromToken(token: string | undefined): Promise<PublicUser | null> {
  return getAuthenticatedUserFromPayload(verifySessionToken(token));
}

async function getAuthenticatedUserFromPayload(
  session: ReturnType<typeof verifySessionToken>,
): Promise<PublicUser | null> {
  if (!session) {
    return null;
  }

  const repository = getPlatformRepository();
  const user = await repository.users.findById(session.sub);
  return user ? repository.users.toPublic(user) : null;
}
