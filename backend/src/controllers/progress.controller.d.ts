import { Request, Response } from 'express';
/**
 * Fetch progress for a specific user.
 * Expects userId as a route parameter.
 */
export declare const getUserProgress: (req: Request, res: Response) => Promise<void>;
/**
 * Update progress for a user on a specific chapter.
 * Expects userId, chapterId, completed, and score in the body.
 */
export declare const updateUserProgress: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=progress.controller.d.ts.map