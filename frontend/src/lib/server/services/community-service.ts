/**
 * FILE: community-service.ts
 * LOCATION: src/lib/server/services/community-service.ts
 * PURPOSE: Backend community orchestration. It keeps post retrieval and post
 *          publishing separate from HTTP route plumbing so moderation, spam
 *          checks, and notifications can be inserted later in one place.
 * USED BY: src/app/api/community/posts/route.ts
 * DEPENDENCIES: platform store, shared validation input types, auth user types
 * LAST UPDATED: 2026-05-12
 */

import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { CommunityPostInput } from "@/lib/validation/auth";
import type { PublicUser } from "@/types/auth";

/** Returns the community feed in the repository-defined newest-first order. */
export async function loadCommunityFeed() {
  return getPlatformRepository().community.listPosts();
}

/** Publishes a signed-in student's post after route-level validation succeeds. */
export async function publishCommunityPost(author: PublicUser, input: CommunityPostInput) {
  return getPlatformRepository().community.createPost({
    author,
    title: input.title,
    body: input.body,
    tags: input.tags,
  });
}
