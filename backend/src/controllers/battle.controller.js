"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.endMatch = exports.findOrCreateMatch = void 0;
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
/**
 * Find an active match for a specific subject or create one if none exists.
 * Expects subjectId in the body.
 */
const findOrCreateMatch = async (req, res) => {
    try {
        const { subjectId, userId } = req.body;
        // Check if there is an active match waiting for players
        let match = await db_1.default.match.findFirst({
            where: {
                subjectId,
                status: 'WAITING',
            },
            include: {
                participants: true,
            },
        });
        if (match) {
            // Add user to existing match if not already in it
            const alreadyInMatch = match.participants.some(p => p.userId === userId);
            if (!alreadyInMatch) {
                await db_1.default.matchParticipant.create({
                    data: {
                        matchId: match.id,
                        userId,
                    },
                });
                // Update match status if enough players (e.g., 2 for a duel)
                if (match.participants.length + 1 >= 2) {
                    match = await db_1.default.match.update({
                        where: { id: match.id },
                        data: { status: 'ACTIVE' },
                        include: { participants: true },
                    });
                }
            }
        }
        else {
            // Create a new match
            match = await db_1.default.match.create({
                data: {
                    subjectId,
                    status: 'WAITING',
                    participants: {
                        create: {
                            userId,
                        }
                    }
                },
                include: {
                    participants: true,
                },
            });
        }
        res.status(200).json({ message: 'Match found or created', match });
    }
    catch (error) {
        console.error('Error in findOrCreateMatch:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
exports.findOrCreateMatch = findOrCreateMatch;
/**
 * End a match and record the winner.
 * Expects matchId and winnerUserId in the body.
 */
const endMatch = async (req, res) => {
    try {
        const { matchId, winnerUserId } = req.body;
        // End the match
        const match = await db_1.default.match.update({
            where: { id: matchId },
            data: {
                status: 'COMPLETED',
                endTime: new Date(),
            },
        });
        // Update the winner
        if (winnerUserId) {
            await db_1.default.matchParticipant.updateMany({
                where: {
                    matchId,
                    userId: winnerUserId,
                },
                data: {
                    isWinner: true,
                    score: { increment: 100 }, // Award points
                },
            });
            // Optionally, add points to the user's overall profile
            await db_1.default.user.update({
                where: { id: winnerUserId },
                data: { points: { increment: 100 }, xp: { increment: 50 } },
            });
        }
        res.status(200).json({ message: 'Match completed', match });
    }
    catch (error) {
        console.error('Error in endMatch:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
exports.endMatch = endMatch;
//# sourceMappingURL=battle.controller.js.map