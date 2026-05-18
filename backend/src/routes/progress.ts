import { Router } from 'express';
import { getUserProgress, updateUserProgress } from '../controllers/progress.controller';

const router = Router();

/**
 * Route: GET /api/progress/:userId
 * Description: Retrieves progress records for a user.
 */
router.get('/:userId', getUserProgress);

/**
 * Route: POST /api/progress
 * Description: Creates or updates a progress record.
 */
router.post('/', updateUserProgress);

export default router;
