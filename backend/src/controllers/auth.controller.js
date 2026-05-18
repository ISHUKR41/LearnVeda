"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
/**
 * Register a new user in the system.
 * Expects email, passwordHash, and name in the body.
 */
const registerUser = async (req, res) => {
    try {
        const { email, passwordHash, name, role } = req.body;
        // Check if the user already exists
        const existingUser = await db_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }
        // Create a new user
        const user = await db_1.default.user.create({
            data: {
                email,
                passwordHash, // In production, this should be properly hashed before arriving or here
                name,
                role: role || 'STUDENT',
            },
        });
        res.status(201).json({ message: 'User registered successfully', user });
    }
    catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
exports.registerUser = registerUser;
/**
 * Login an existing user.
 * Expects email and passwordHash in the body.
 */
const loginUser = async (req, res) => {
    try {
        const { email, passwordHash } = req.body;
        const user = await db_1.default.user.findUnique({
            where: { email },
        });
        if (!user || user.passwordHash !== passwordHash) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        res.status(200).json({ message: 'Login successful', user });
    }
    catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.controller.js.map