"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProgress = exports.getUserProgress = void 0;
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
/**
 * Fetch progress for a specific user.
 * Expects userId as a route parameter.
 */
const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await db_1.default.userProgress.findMany({
            where: { userId },
            include: {
                chapter: true,
            },
        });
        res.status(200).json({ progress });
    }
    catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
exports.getUserProgress = getUserProgress;
/**
 * Update progress for a user on a specific chapter.
 * Expects userId, chapterId, completed, and score in the body.
 */
const updateUserProgress = async (req, res) => {
    try {
        const { userId, chapterId, completed, score } = req.body;
        const updatedProgress = await db_1.default.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
            update: {
                completed,
                score,
            },
            create: {
                userId,
                chapterId,
                completed,
                score,
            },
        });
        res.status(200).json({ message: 'Progress updated successfully', progress: updatedProgress });
    }
    catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
exports.updateUserProgress = updateUserProgress;
//# sourceMappingURL=progress.controller.js.map