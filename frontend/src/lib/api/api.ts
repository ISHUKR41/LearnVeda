/**
 * FILE: api.ts
 * LOCATION: frontend/src/lib/api/api.ts
 * PURPOSE: Central API client for communicating with the EduQuest backend.
 *          Wraps Axios with authentication token management, automatic token
 *          refresh, request/response interceptors, and type-safe helpers.
 *
 * ARCHITECTURE:
 *  - Singleton Axios instance with base URL configuration
 *  - Request interceptor: Attaches JWT access token to every request
 *  - Response interceptor: Handles 401 errors with automatic token refresh
 *  - Token storage: In-memory for access token, localStorage for refresh token
 *    (httpOnly cookie is preferred in production)
 *
 * DEPENDENCIES: axios
 * USED BY: All frontend pages and components that need backend data
 * LAST UPDATED: 2026-05-19
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

/* ─────────────────────────────────────────────
 * Configuration
 * ───────────────────────────────────────────── */

/**
 * Backend API base URL.
 * - Development: http://localhost:4000/api
 * - Production: Configured via NEXT_PUBLIC_API_URL environment variable
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

/* ─────────────────────────────────────────────
 * Token Storage
 * Access token is kept in memory (not localStorage) for security.
 * If the tab is closed, the user must refresh via the refresh token.
 * ───────────────────────────────────────────── */
let accessToken: string | null = null;

/**
 * Sets the access token in memory.
 * Called after login, registration, or token refresh.
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/**
 * Gets the current access token from memory.
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Stores the refresh token in localStorage.
 * NOTE: In production, prefer httpOnly cookies for refresh tokens.
 */
export function setRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("eduquest_refresh_token", token);
  } else {
    localStorage.removeItem("eduquest_refresh_token");
  }
}

/**
 * Retrieves the refresh token from localStorage.
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("eduquest_refresh_token");
}

/**
 * Clears all authentication tokens. Called on logout.
 */
export function clearTokens(): void {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("eduquest_refresh_token");
    localStorage.removeItem("eduquest_user");
  }
}

/* ─────────────────────────────────────────────
 * Axios Instance
 * ───────────────────────────────────────────── */

/**
 * Central Axios instance — all API calls go through this.
 * Configured with sensible defaults for the EduQuest backend.
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,           // 15 second timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,     // Send cookies in cross-origin requests
});

/* ─────────────────────────────────────────────
 * Request Interceptor
 * Automatically attaches the JWT access token to every outgoing request.
 * ───────────────────────────────────────────── */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add request ID for tracing
    config.headers["X-Request-ID"] = `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    return config;
  },
  (error) => Promise.reject(error)
);

/* ─────────────────────────────────────────────
 * Response Interceptor
 * Handles 401 Unauthorized responses by attempting a token refresh.
 * If the refresh succeeds, the original request is retried.
 * If the refresh fails, the user is redirected to the login page.
 * ───────────────────────────────────────────── */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Processes the queue of failed requests after a token refresh.
 * All queued requests are retried with the new access token.
 */
function processQueue(error: AxiosError | null, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  // Success — pass through
  (response) => response,

  // Error handler
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh for 401 errors (expired access token)
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken;

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null);
      clearTokens();

      // Redirect to login if on client side
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in?expired=true";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/* ─────────────────────────────────────────────
 * Type-Safe API Response Types
 * ───────────────────────────────────────────── */

/** Standard API response wrapper */
export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

/* ─────────────────────────────────────────────
 * Convenience Methods
 * Type-safe wrappers around the API client for common operations.
 * ───────────────────────────────────────────── */

/** Auth API */
export const authApi = {
  register: (data: { name: string; email: string; password: string; classLevel?: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  refresh: (refreshToken: string) =>
    api.post("/auth/refresh", { refreshToken }),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/auth/me"),
};

/** Content API */
export const contentApi = {
  getClasses: () => api.get("/content/classes"),
  getClass: (slug: string) => api.get(`/content/classes/${slug}`),
  getSubject: (id: string) => api.get(`/content/subjects/${id}`),
  getChapter: (id: string) => api.get(`/content/chapters/${id}`),
  getTopic: (id: string) => api.get(`/content/topics/${id}`),
  getEngineering: () => api.get("/content/engineering"),
  getLanguage: (slug: string) => api.get(`/content/engineering/${slug}`),
  getStats: () => api.get("/content/stats"),
};

/** Progress API */
export const progressApi = {
  getUserProgress: () => api.get("/progress"),
  updateChapterProgress: (chapterId: string, data: { completed?: boolean; score?: number }) =>
    api.put(`/progress/chapters/${chapterId}`, data),
};

/** Battle API */
export const battleApi = {
  joinQueue: (data: { subjectId: string; mode?: string }) =>
    api.post("/battle/queue", data),
  leaveQueue: () => api.delete("/battle/queue"),
  getMatch: (matchId: string) => api.get(`/battle/matches/${matchId}`),
  submitAnswer: (matchId: string, data: { questionId: string; answer: string }) =>
    api.post(`/battle/matches/${matchId}/answer`, data),
};

/** Community API */
export const communityApi = {
  getPosts: (params?: { category?: string; limit?: number; offset?: number }) =>
    api.get("/community/posts", { params }),
  getPost: (postId: string) => api.get(`/community/posts/${postId}`),
  createPost: (data: { title: string; content: string; categoryId: string }) =>
    api.post("/community/posts", data),
  likePost: (postId: string) => api.post(`/community/posts/${postId}/like`),
  deletePost: (postId: string) => api.delete(`/community/posts/${postId}`),
};

/** Wallet API */
export const walletApi = {
  getWallet: () => api.get("/wallet"),
  getHistory: (params?: { type?: string; limit?: number; offset?: number }) =>
    api.get("/wallet/history", { params }),
};

/** Events API */
export const eventsApi = {
  getEvents: (params?: { status?: string; type?: string; limit?: number; offset?: number }) =>
    api.get("/events", { params }),
  getEvent: (id: string) => api.get(`/events/${id}`),
  register: (eventId: string) => api.post(`/events/${eventId}/register`),
  cancelRegistration: (eventId: string) => api.delete(`/events/${eventId}/register`),
};

/** Leaderboard API */
export const leaderboardApi = {
  getGlobal: (params?: { limit?: number; classLevel?: string }) =>
    api.get("/leaderboard", { params }),
  getBattle: (params?: { limit?: number }) =>
    api.get("/leaderboard/battle", { params }),
};

/** Notifications API */
export const notificationsApi = {
  getAll: (params?: { limit?: number; unreadOnly?: boolean }) =>
    api.get("/notifications", { params }),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

/** Users API */
export const usersApi = {
  getProfile: (userId: string) => api.get(`/users/${userId}`),
  getStats: (userId: string) => api.get(`/users/${userId}/stats`),
  updateProfile: (userId: string, data: { name?: string; track?: string }) =>
    api.put(`/users/${userId}/profile`, data),
};

/** Search API */
export const searchApi = {
  search: (query: string, params?: { type?: string; limit?: number }) =>
    api.get("/search", { params: { q: query, ...params } }),
};

/**
 * Coding API — Engineering section learning plans, lessons, and submissions.
 * Used by: Engineering pages, code editor, submission history
 */
export const codingApi = {
  /** Get all learning plans for a programming language */
  getLanguagePlans: (slug: string) =>
    api.get(`/coding/languages/${slug}/plans`),

  /** Get all daily lessons for a specific learning plan */
  getPlanLessons: (planId: string) =>
    api.get(`/coding/plans/${planId}/lessons`),

  /** Get a single lesson with theory content and problems */
  getLesson: (lessonId: string) =>
    api.get(`/coding/lessons/${lessonId}`),

  /** Get a coding problem with starter code and sample test cases */
  getProblem: (problemId: string) =>
    api.get(`/coding/problems/${problemId}`),

  /** Submit a code solution for grading */
  submitSolution: (problemId: string, data: { code: string; language: string }) =>
    api.post(`/coding/problems/${problemId}/submit`, data),

  /** Get the current user's submission history */
  getSubmissions: (params?: { limit?: number; offset?: number }) =>
    api.get("/coding/submissions", { params }),

  /** Get the user's best submission for a specific problem */
  getBestSubmission: (problemId: string) =>
    api.get(`/coding/submissions/${problemId}/best`),
};

/**
 * Tests API — Mock test execution, scoring, and results.
 * Used by: Class pages (take test), test history page
 */
export const testsApi = {
  /** Get available tests for a specific chapter */
  getChapterTests: (chapterId: string) =>
    api.get(`/tests/chapter/${chapterId}`),

  /** Get test details with questions (answers hidden) */
  getTest: (testId: string) =>
    api.get(`/tests/${testId}`),

  /** Start a new test session */
  startTest: (testId: string) =>
    api.post(`/tests/${testId}/start`),

  /** Submit answers and get graded results */
  submitTest: (testId: string, data: {
    scoreId: string;
    answers: Array<{ questionId: string; userAnswer: string }>;
    timeTaken?: number;
  }) =>
    api.post(`/tests/${testId}/submit`, data),

  /** Get detailed results for a completed test attempt */
  getResults: (testId: string, scoreId: string) =>
    api.get(`/tests/${testId}/results/${scoreId}`),

  /** Get the current user's test history */
  getHistory: (params?: { limit?: number; offset?: number }) =>
    api.get("/tests/history", { params }),
};

export default api;
