"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
/**
 * Route: POST /api/auth/register
 * Description: Registers a new user.
 */
router.post('/register', auth_controller_1.registerUser);
/**
 * Route: POST /api/auth/login
 * Description: Authenticates a user and logs them in.
 */
router.post('/login', auth_controller_1.loginUser);
exports.default = router;
//# sourceMappingURL=auth.js.map