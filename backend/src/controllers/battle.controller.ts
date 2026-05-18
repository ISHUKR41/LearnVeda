import { Request, Response } from 'express';
import prisma from '../config/db';

/**
 * Find an active match for a specific subject or create one if none exists.
 * Expects subjectId in the body.
 */
export const findOrCreateMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subjectId, userId } = req.body;

    // Check if there is an active match waiting for players
    let match = await prisma.match.findFirst({
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
        await prisma.matchParticipant.create({
          data: {
            matchId: match.id,
            userId,
          },
        });
        
        // Update match status if enough players (e.g., 2 for a duel)
        if (match.participants.length + 1 >= 2) {
          match = await prisma.match.update({
            where: { id: match.id },
            data: { status: 'ACTIVE' },
            include: { participants: true },
          });
        }
      }
    } else {
      // Create a new match
      match = await prisma.match.create({
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
  } catch (error: any) {
    console.error('Error in findOrCreateMatch:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

/**
 * End a match and record the winner.
 * Expects matchId and winnerUserId in the body.
 */
export const endMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matchId, winnerUserId } = req.body;

    // End the match
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
      },
    });

    // Update the winner
    if (winnerUserId) {
      await prisma.matchParticipant.updateMany({
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
      await prisma.user.update({
        where: { id: winnerUserId },
        data: { points: { increment: 100 }, xp: { increment: 50 } },
      });
    }

    res.status(200).json({ message: 'Match completed', match });
  } catch (error: any) {
    console.error('Error in endMatch:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
