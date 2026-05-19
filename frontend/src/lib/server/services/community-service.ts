/**
 * FILE: community-service.ts
 * LOCATION: src/lib/server/services/community-service.ts
 * PURPOSE: Backend community orchestration. It keeps post retrieval and post
 *          publishing separate from HTTP route plumbing so moderation, spam
 *          checks, audit logs, and notifications can be inserted in one place.
 * USED BY: src/app/api/community/posts/route.ts
 * DEPENDENCIES: repository adapters, shared validation input types, auth user types
 * LAST UPDATED: 2026-05-19
 */

import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { CommunityPostInput } from "@/lib/validation/auth";
import type { PublicUser } from "@/types/auth";

/** Returns the community feed in the repository-defined newest-first order. */
export async function loadCommunityFeed() {
  return getPlatformRepository().community.listPosts();
}

/**
 * Returns one community post for a detail page.
 * The caller decides whether the read should count as a view so API previews
 * and page opens can use the same backend path without inflating metrics.
 */
export async function loadCommunityPostById(id: string, options: { incrementViews?: boolean } = {}) {
  return getPlatformRepository().community.findPostById(id, options);
}

/** Publishes a signed-in student's post after route-level validation succeeds. */
export async function publishCommunityPost(author: PublicUser, input: CommunityPostInput) {
  const repository = getPlatformRepository();
  const post = await repository.community.createPost({
    author,
    title: input.title,
    body: input.body,
    tags: input.tags,
  });

  await repository.audit.create({
    action: "community.post.created",
    actorId: author.id,
    actorType: "student",
    targetType: "community_post",
    targetId: post.id,
    severity: "info",
    metadata: {
      tagCount: input.tags.length,
      bodyLength: input.body.length,
    },
  });

  return post;
}
