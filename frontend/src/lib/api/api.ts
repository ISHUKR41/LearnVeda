/**
 * FILE: api.ts
 * LOCATION: frontend/src/lib/api/api.ts
 * PURPOSE: Central API client for communicating with Learnova Next.js API routes.
 *          Uses relative URLs (/api/*) so it works both locally and in production
 *          without any environment variable changes.
 *
 * IMPORTANT: This file is browser-only. API calls are relative to the Next.js
 *            app origin (/api/*), which points to the App Router route handlers.
 *            There is NO separate Express backend needed for these client calls.
 *
 * DEPENDENCIES: axios
 * USED BY: All frontend pages/components that call backend data
 * LAST UPDATED: 2026-05-31
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

/* ─────────────────────────────────────────────
 * Base URL Configuration
 *
 * Uses relative /api paths so requests always go to the Next.js API routes
 * on the same origin. NEXT_PUBLIC_API_URL can override for a separate API server.
 * ───────────────────────────────────────────── */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/* ─────────────────────────────────────────────
 * In-memory access token (NOT localStorage — more secure, no XSS leak)
 * ───────────────────────────────────────────── */
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void  { accessToken = token; }
export function getAccessToken(): string | null              { return accessToken; }

export function setRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) { localStorage.setItem("eduquest_refresh_token", token); }
  else        { localStorage.removeItem("eduquest_refresh_token"); }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("eduquest_refresh_token");
}

export function clearTokens(): void {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("eduquest_refresh_token");
    localStorage.removeItem("eduquest_user");
  }
}

/* ─────────────────────────────────────────────
 * Axios Instance — all Learnova API calls go through this
 * ───────────────────────────────────────────── */
const api: AxiosInstance = axios.create({
  baseURL:         API_BASE_URL,
  timeout:         15_000,
  headers:         { "Content-Type": "application/json" },
  withCredentials: true,    /* Send cookies (Clerk __session cookie) on every request */
});

/* ─────────────────────────────────────────────
 * Request Interceptor — attach Bearer token if available
 * ───────────────────────────────────────────── */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers["X-Request-ID"] = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return config;
  },
  (error) => Promise.reject(error),
);

/* ─────────────────────────────────────────────
 * Response Interceptor — handle 401 with token refresh (legacy cookie auth)
 * For Clerk-authenticated users this is a no-op since Clerk handles its own session.
 * ───────────────────────────────────────────── */
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: AxiosError | null, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error); else resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing    = true;
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
      setAccessToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      processQueue(null, data.data.accessToken);
      original.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

/* ─────────────────────────────────────────────
 * Type-Safe Response Wrapper
 * ───────────────────────────────────────────── */
export interface ApiResponse<T> {
  ok:     boolean;
  data:   T;
  error?: { code: string; message: string };
}

/* ─────────────────────────────────────────────
 * Domain-specific API namespaces
 * Each method corresponds to one Next.js API route handler.
 *
 * IMPORTANT: Paths must NOT have a leading "/".
 * Axios treats "/path" as absolute from the origin, bypassing baseURL entirely.
 * Without the leading slash, axios appends to baseURL:
 *   baseURL="/api" + "progress" → "/api/progress"  ✓
 *   baseURL="/api" + "/progress" → "/progress"      ✗ (ignores /api)
 * ───────────────────────────────────────────── */

export const authApi = {
  register: (d: { name: string; email: string; password: string; classLevel?: string }) =>
    api.post("auth/sign-up", d),
  login:   (d: { email: string; password: string }) =>
    api.post("auth/sign-in", d),
  refresh: (refreshToken: string) =>
    api.post("auth/refresh", { refreshToken }),
  logout: () => api.post("auth/sign-out"),
  me:     () => api.get("auth/me"),
};

export const contentApi = {
  getClasses:     ()                => api.get("classes"),
  getSubjects:    ()                => api.get("content/subjects"),
  getClass:       (slug: string)    => api.get(`classes?class=${slug}`),
  getSubject:     (id: string)      => api.get(`content/subjects?id=${id}`),
  getChapter:     (id: string)      => api.get(`subjects/${id}/chapters`),
  getEngineering: ()                => api.get("classes?class=engineering"),
  getLanguage:    (slug: string)    => api.get(`classes?class=engineering&lang=${slug}`),
  getStats:       ()                => api.get("platform-stats"),
};

export const progressApi = {
  /**
   * GET /api/progress — fetches the current user's overall progress across chapters.
   * Returns 401 when not signed in (handled gracefully in TopicStudyClient).
   * The response is used by TopicStudyClient to restore answered questions on mount.
   */
  getUserProgress: () => api.get("progress"),

  updateChapterProgress: (
    chapterId: string,
    data: { completed?: boolean; score?: number; answers?: string; timeSpent?: number },
  ) => api.put(`progress/chapters/${chapterId}`, data),

  saveAnswer: (data: {
    chapterId:    string;
    topicId:      string;
    questionId:   string;
    userAnswer:   string;
    isCorrect:    boolean;
    timeSpent?:   number;
    questionType?: string;
  }) => api.post("progress/answers", data),

  getTopicProgress: (chapterId: string, topicId: string) =>
    api.get(`progress/chapters/${chapterId}/topics/${topicId}`),
};

export const battleApi = {
  joinQueue:    (d: { subjectId: string; mode?: string }) => api.post("battle/matchmaking", d),
  leaveQueue:   ()                                         => api.delete("battle/matchmaking"),
  getMatch:     (matchId: string)                          => api.get(`battles/${matchId}`),
  submitAnswer: (matchId: string, d: { questionId: string; answer: string }) =>
    api.post(`battles/${matchId}/answer`, d),
};

export const communityApi = {
  getPosts:   (params?: { category?: string; limit?: number; offset?: number }) =>
    api.get("community/posts", { params }),
  getPost:    (id: string)                               => api.get(`community/posts/${id}`),
  createPost: (d: { title: string; content: string; categoryId: string }) =>
    api.post("community/posts", d),
  likePost:   (id: string)                               => api.post(`community/posts/${id}/like`),
  deletePost: (id: string)                               => api.delete(`community/posts/${id}`),
};

export const walletApi = {
  getWallet:  ()                                                         => api.get("wallet"),
  getHistory: (p?: { type?: string; limit?: number; offset?: number })  =>
    api.get("wallet", { params: p }),
};

export const eventsApi = {
  getEvents:          (p?: { status?: string; type?: string; limit?: number; offset?: number }) =>
    api.get("events", { params: p }),
  getEvent:           (id: string)       => api.get(`events?id=${id}`),
  register:           (eventId: string)  => api.post("events/register", { eventId }),
  cancelRegistration: (eventId: string)  => api.delete(`events/register?eventId=${eventId}`),
};

export const leaderboardApi = {
  getGlobal: (p?: { limit?: number; classLevel?: string }) =>
    api.get("leaderboard", { params: p }),
  getBattle: (p?: { limit?: number }) =>
    api.get("leaderboard", { params: p }),
};

export const notificationsApi = {
  getAll:      (p?: { limit?: number; unreadOnly?: boolean }) =>
    api.get("notifications", { params: p }),
  markRead:    (id: string) => api.patch(`notifications?id=${id}`),
  markAllRead: ()           => api.patch("notifications"),
};

export const usersApi = {
  getProfile:    (_userId: string) => api.get("users/me"),
  getStats:      (_userId: string) => api.get("users/me"),
  updateProfile: (_userId: string, data: { name?: string; track?: string }) =>
    api.put("users/me", data),
};

export const searchApi = {
  search: (query: string, params?: { type?: string; limit?: number }) =>
    api.get("search", { params: { q: query, ...params } }),
};

export const codingApi = {
  getLanguagePlans: (slug: string)      => api.get(`classes?class=engineering&lang=${slug}`),
  getPlanLessons:   (planId: string)    => api.get(`classes?planId=${planId}`),
  getLesson:        (lessonId: string)  => api.get(`classes?lessonId=${lessonId}`),
  getProblem:       (problemId: string) => api.get(`classes?problemId=${problemId}`),
  submitSolution:   (problemId: string, d: { code: string; language: string }) =>
    api.post("classes/submit", { problemId, ...d }),
  getSubmissions:   (p?: { limit?: number; offset?: number }) =>
    api.get("classes/submissions", { params: p }),
  getBestSubmission: (problemId: string) =>
    api.get(`classes/submissions?best=1&problemId=${problemId}`),
};

export const testsApi = {
  getChapterTests: (chapterId: string) => api.get(`test?chapterId=${chapterId}`),
  getTest:         (testId: string)    => api.get(`test?testId=${testId}`),
  startTest:       (testId: string)    => api.post("test/start", { testId }),
  submitTest:      (testId: string, d: { scoreId: string; answers: unknown[]; timeTaken?: number }) =>
    api.post("test/submit", { testId, ...d }),
  getResults:      (testId: string, scoreId: string) =>
    api.get(`test/results?testId=${testId}&scoreId=${scoreId}`),
  getHistory:      (p?: { limit?: number; offset?: number }) =>
    api.get("test/history", { params: p }),
};

export default api;
