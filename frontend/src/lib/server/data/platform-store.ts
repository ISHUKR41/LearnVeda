/**
 * FILE: platform-store.ts
 * LOCATION: src/lib/server/data/platform-store.ts
 * PURPOSE: Durable local backend data adapter for EduQuest. It stores users,
 *          matchmaking tickets, community posts, event registrations, and basic
 *          progress data in a JSON file with serialized writes.
 *
 * IMPORTANT PRODUCTION NOTE:
 * This adapter is intentionally shaped like a real backend repository layer, but
 * the storage engine is local JSON so the app works fully on this machine today.
 * Before serving real multi-instance production traffic, replace this file with
 * a PostgreSQL + Redis adapter while keeping the exported function contracts.
 *
 * USED BY: Auth routes, dashboard route, battle route, community route, events route
 * DEPENDENCIES: node:fs/promises, node:path, node:crypto, shared auth types
 * LAST UPDATED: 2026-05-11
 */

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditLogEntry, CreateAuditLogInput } from "@/lib/server/audit/audit-log";
import type { BackgroundJobIntent, CreateBackgroundJobInput } from "@/lib/server/jobs/job-intents";
import type { LearningTrack, PublicUser, StoredUser } from "@/types/auth";

interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  track: LearningTrack;
}

export interface MatchmakingTicket {
  id: string;
  userId: string;
  category: string;
  status: "queued" | "matched" | "cancelled";
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
}

interface PlatformStore {
  users: StoredUser[];
  matchmakingTickets: MatchmakingTicket[];
  communityPosts: CommunityPost[];
  eventRegistrations: EventRegistration[];
  auditLogs: AuditLogEntry[];
  backgroundJobs: BackgroundJobIntent[];
}

interface StoreRuntime {
  cache: PlatformStore | null;
  queue: Promise<unknown>;
}

type StoreGlobal = typeof globalThis & {
  __eduquestPlatformStore?: StoreRuntime;
};

/** Creates a stable process-level runtime for cached reads and serialized writes. */
function getRuntime(): StoreRuntime {
  const globalForStore = globalThis as StoreGlobal;

  if (!globalForStore.__eduquestPlatformStore) {
    globalForStore.__eduquestPlatformStore = {
      cache: null,
      queue: Promise.resolve(),
    };
  }

  return globalForStore.__eduquestPlatformStore;
}

/**
 * Resolves the local data file path.
 * EDUQUEST_DATA_FILE allows tests/deploy previews to use isolated storage.
 */
function getStoreFilePath(): string {
  return process.env.EDUQUEST_DATA_FILE
    ? path.resolve(process.env.EDUQUEST_DATA_FILE)
    : path.join(process.cwd(), ".data", "eduquest-store.json");
}

/** Default data keeps community/event surfaces useful before real users arrive. */
function createDefaultStore(): PlatformStore {
  return {
    users: [],
    matchmakingTickets: [],
    eventRegistrations: [],
    auditLogs: [],
    backgroundJobs: [],
    communityPosts: [
      {
        id: "seed-quadratic-equations",
        authorId: "system",
        authorName: "Priya M.",
        title: "How to solve quadratic equations quickly?",
        body: "I struggle with factorization method. Can someone explain the fastest board-exam approach?",
        tags: ["Class 10", "Mathematics"],
        likes: 24,
        comments: 8,
        views: 156,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "seed-dsa-resources",
        authorId: "system",
        authorName: "Rohit K.",
        title: "Best resources for learning Data Structures in C++?",
        body: "Starting my DSA journey and looking for beginner-friendly practice flow.",
        tags: ["Engineering", "DSA"],
        likes: 42,
        comments: 15,
        views: 289,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
  };
}

/** Returns true only when Node reports that the data file does not exist yet. */
function isMissingStoreFile(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

/**
 * Normalizes parsed disk data into the shape expected by the MVP repository.
 * Invalid container types are rejected so damaged files never become silent resets.
 */
function normalizeStore(rawStore: unknown): PlatformStore {
  if (!rawStore || typeof rawStore !== "object") {
    throw new Error("PLATFORM_STORE_INVALID");
  }

  const parsed = rawStore as Partial<PlatformStore>;

  if (
    (parsed.users && !Array.isArray(parsed.users))
    || (parsed.matchmakingTickets && !Array.isArray(parsed.matchmakingTickets))
    || (parsed.communityPosts && !Array.isArray(parsed.communityPosts))
    || (parsed.eventRegistrations && !Array.isArray(parsed.eventRegistrations))
    || (parsed.auditLogs && !Array.isArray(parsed.auditLogs))
    || (parsed.backgroundJobs && !Array.isArray(parsed.backgroundJobs))
  ) {
    throw new Error("PLATFORM_STORE_INVALID");
  }

  return {
    users: parsed.users ?? [],
    matchmakingTickets: parsed.matchmakingTickets ?? [],
    communityPosts: parsed.communityPosts ?? [],
    eventRegistrations: parsed.eventRegistrations ?? [],
    auditLogs: parsed.auditLogs ?? [],
    backgroundJobs: parsed.backgroundJobs ?? [],
  };
}

/** Reads and normalizes the store from disk, creating it only when it is absent. */
async function loadStore(): Promise<PlatformStore> {
  const runtime = getRuntime();

  if (runtime.cache) {
    return runtime.cache;
  }

  const filePath = getStoreFilePath();

  try {
    const raw = await readFile(filePath, "utf8");
    runtime.cache = normalizeStore(JSON.parse(raw));
  } catch (error) {
    if (!isMissingStoreFile(error)) {
      /*
       * Important safety rule:
       * Never overwrite an existing store just because it failed to parse or
       * read. Keeping the failure visible is safer than destroying user data.
       */
      throw new Error("PLATFORM_STORE_UNAVAILABLE", { cause: error });
    }

    runtime.cache = createDefaultStore();
    await persistStore(runtime.cache);
  }

  return runtime.cache;
}

/** Writes the store atomically so partial writes do not corrupt the data file. */
async function persistStore(store: PlatformStore): Promise<void> {
  const filePath = getStoreFilePath();
  const directory = path.dirname(filePath);
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;

  await mkdir(directory, { recursive: true });
  await writeFile(tempPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(tempPath, filePath);
  getRuntime().cache = store;
}

/**
 * Serializes all store access through one queue.
 * This prevents two simultaneous sign-ups or posts from overwriting each other.
 */
async function withStore<T>(
  work: (store: PlatformStore) => T | Promise<T>,
  options: { persist?: boolean } = {},
): Promise<T> {
  const runtime = getRuntime();

  const operation = runtime.queue.then(async () => {
    const store = await loadStore();
    const result = await work(store);

    if (options.persist) {
      await persistStore(store);
    }

    return result;
  });

  runtime.queue = operation.then(
    () => undefined,
    () => undefined,
  );

  return operation;
}

/** Removes sensitive storage-only fields before data is sent to the browser. */
export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    track: user.track,
    role: user.role,
    level: user.level,
    xp: user.xp,
    streak: user.streak,
    createdAt: user.createdAt,
  };
}

/** Finds a user by normalized email address. */
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const normalizedEmail = email.toLowerCase();
  return withStore((store) => store.users.find((user) => user.email === normalizedEmail) ?? null);
}

/** Finds a user by stable user id from the signed session token. */
export async function findUserById(id: string): Promise<StoredUser | null> {
  return withStore((store) => store.users.find((user) => user.id === id) ?? null);
}

/** Creates and persists a new student account. */
export async function createUser(input: CreateUserInput): Promise<PublicUser> {
  return withStore((store) => {
    const normalizedEmail = input.email.toLowerCase();

    if (store.users.some((user) => user.email === normalizedEmail)) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const storedUser: StoredUser = {
      id: randomUUID(),
      name: input.name,
      email: normalizedEmail,
      passwordHash: input.passwordHash,
      track: input.track,
      role: "student",
      level: 1,
      xp: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    store.users.push(storedUser);
    return toPublicUser(storedUser);
  }, { persist: true });
}

/** Records a matchmaking ticket for the authenticated user. */
export async function createMatchmakingTicket(userId: string, category: string): Promise<string> {
  return withStore((store) => {
    const ticketId = randomUUID();
    store.matchmakingTickets.push({
      id: ticketId,
      userId,
      category,
      status: "queued",
      createdAt: new Date().toISOString(),
    });
    return ticketId;
  }, { persist: true });
}

/** Lists one user's matchmaking tickets newest-first for real battle statistics. */
export async function listMatchmakingTicketsForUser(userId: string): Promise<MatchmakingTicket[]> {
  return withStore((store) =>
    store.matchmakingTickets
      .filter((ticket) => ticket.userId === userId)
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)),
  );
}

/** Returns newest community posts first. */
export async function listCommunityPosts(): Promise<CommunityPost[]> {
  return withStore((store) =>
    [...store.communityPosts].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
  );
}

/** Creates a new community post from a signed-in user. */
export async function createCommunityPost(input: {
  author: PublicUser;
  title: string;
  body: string;
  tags: string[];
}): Promise<CommunityPost> {
  return withStore((store) => {
    const post: CommunityPost = {
      id: randomUUID(),
      authorId: input.author.id,
      authorName: input.author.name,
      title: input.title,
      body: input.body,
      tags: input.tags,
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    };

    store.communityPosts.push(post);
    return post;
  }, { persist: true });
}

/** Stores one event registration per user/event pair. */
export async function registerForEvent(eventId: string, userId: string): Promise<EventRegistration> {
  return withStore((store) => {
    const existing = store.eventRegistrations.find(
      (registration) => registration.eventId === eventId && registration.userId === userId,
    );

    if (existing) {
      return existing;
    }

    const registration: EventRegistration = {
      id: randomUUID(),
      eventId,
      userId,
      createdAt: new Date().toISOString(),
    };

    store.eventRegistrations.push(registration);
    return registration;
  }, { persist: true });
}

/** Lists event ids already registered by a user. */
export async function listRegisteredEventIds(userId: string): Promise<string[]> {
  return withStore((store) =>
    store.eventRegistrations
      .filter((registration) => registration.userId === userId)
      .map((registration) => registration.eventId),
  );
}

/** Returns public ranking candidates sorted by XP and level for leaderboard APIs. */
export async function listPublicUsersByRank(): Promise<PublicUser[]> {
  return withStore((store) =>
    store.users
      .map(toPublicUser)
      .sort((left, right) => {
        if (right.xp !== left.xp) {
          return right.xp - left.xp;
        }

        if (right.level !== left.level) {
          return right.level - left.level;
        }

        return Date.parse(left.createdAt) - Date.parse(right.createdAt);
      }),
  );
}

/** Stores one safe audit record for security, moderation, and production review. */
export async function createAuditLog(input: CreateAuditLogInput): Promise<AuditLogEntry> {
  return withStore((store) => {
    const entry: AuditLogEntry = {
      ...input,
      id: randomUUID(),
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString(),
    };

    store.auditLogs.push(entry);

    /*
     * Keep the local JSON store bounded. PostgreSQL keeps the full audit
     * history, while local development only needs recent records for debugging.
     */
    if (store.auditLogs.length > 500) {
      store.auditLogs.splice(0, store.auditLogs.length - 500);
    }

    return entry;
  }, { persist: true });
}

/** Creates a durable background job intent for future worker processing. */
export async function createBackgroundJob(input: CreateBackgroundJobInput): Promise<BackgroundJobIntent> {
  return withStore((store) => {
    const job: BackgroundJobIntent = {
      ...input,
      id: randomUUID(),
      status: "pending",
      payload: input.payload ?? {},
      attempts: 0,
      createdAt: new Date().toISOString(),
      runAfter: input.runAfter ?? new Date().toISOString(),
    };

    store.backgroundJobs.push(job);

    /*
     * The MVP JSON adapter is only a local fallback, so it keeps a bounded queue.
     * Production uses PostgreSQL where workers can process and retain jobs safely.
     */
    if (store.backgroundJobs.length > 500) {
      store.backgroundJobs.splice(0, store.backgroundJobs.length - 500);
    }

    return job;
  }, { persist: true });
}
