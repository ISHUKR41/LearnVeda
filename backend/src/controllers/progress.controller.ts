import { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Fetch progress for a specific user.
 * Expects userId as a route parameter.
 */
export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        chapter: true,
      },
    });

    res.status(200).json({ progress });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

/**
 * Update progress for a user on a specific chapter.
 * Expects userId, chapterId, completed, and score in the body.
 */
export const updateUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, chapterId, completed, score } = req.body;

    const updatedProgress = await prisma.userProgress.upsert({
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
  } catch (error: any) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
