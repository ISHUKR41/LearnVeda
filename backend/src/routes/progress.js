"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("../controllers/progress.controller");
const router = (0, express_1.Router)();
/**
 * Route: GET /api/progress/:userId
 * Description: Retrieves progress records for a user.
 */
router.get('/:userId', progress_controller_1.getUserProgress);
/**
 * Route: POST /api/progress
 * Description: Creates or updates a progress record.
 */
router.post('/', progress_controller_1.updateUserProgress);
exports.default = router;
//# sourceMappingURL=progress.js.map