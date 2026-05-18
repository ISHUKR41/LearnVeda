import { Router } from 'express';
import { findOrCreateMatch, endMatch } from '../controllers/battle.controller';

const router = Router();

/**
 * Route: POST /api/battle/match
 * Description: Finds an existing waiting match or creates a new one for the specified subject.
 */
router.post('/match', findOrCreateMatch);

/**
 * Route: POST /api/battle/end
 * Description: Ends an active match and processes the results.
 */
router.post('/end', endMatch);

export default router;
