import { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Register a new user in the system.
 * Expects email, passwordHash, and name in the body.
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, passwordHash, name, role } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash, // In production, this should be properly hashed before arriving or here
        name,
        role: role || 'STUDENT',
      },
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error: any) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

/**
 * Login an existing user.
 * Expects email and passwordHash in the body.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, passwordHash } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.passwordHash !== passwordHash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error: any) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
