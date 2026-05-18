import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

/**
 * Route: POST /api/auth/register
 * Description: Registers a new user.
 */
router.post('/register', registerUser);

/**
 * Route: POST /api/auth/login
 * Description: Authenticates a user and logs them in.
 */
router.post('/login', loginUser);

export default router;
