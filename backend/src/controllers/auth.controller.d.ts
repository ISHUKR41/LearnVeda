import { Request, Response } from 'express';
/**
 * Register a new user in the system.
 * Expects email, passwordHash, and name in the body.
 */
export declare const registerUser: (req: Request, res: Response) => Promise<void>;
/**
 * Login an existing user.
 * Expects email and passwordHash in the body.
 */
export declare const loginUser: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map