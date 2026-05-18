import { Request, Response } from 'express';
/**
 * Find an active match for a specific subject or create one if none exists.
 * Expects subjectId in the body.
 */
export declare const findOrCreateMatch: (req: Request, res: Response) => Promise<void>;
/**
 * End a match and record the winner.
 * Expects matchId and winnerUserId in the body.
 */
export declare const endMatch: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=battle.controller.d.ts.map