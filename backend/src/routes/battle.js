"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const battle_controller_1 = require("../controllers/battle.controller");
const router = (0, express_1.Router)();
/**
 * Route: POST /api/battle/match
 * Description: Finds an existing waiting match or creates a new one for the specified subject.
 */
router.post('/match', battle_controller_1.findOrCreateMatch);
/**
 * Route: POST /api/battle/end
 * Description: Ends an active match and processes the results.
 */
router.post('/end', battle_controller_1.endMatch);
exports.default = router;
//# sourceMappingURL=battle.js.map