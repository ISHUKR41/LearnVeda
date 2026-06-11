import { NextResponse } from 'next/server';
import { auth } from '@/lib/clerk-shim/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

// Create a new progress record or update existing one
// Handles high concurrency by utilizing unique composite keys
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    // Fallback to a test user ONLY in development if auth fails
    const activeUserId = userId || (process.env.NODE_ENV === 'development' ? 'test-user-1' : null);

    if (!activeUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { chapterId, score, completed } = body;

    if (!activeUserId || !chapterId) {
      return NextResponse.json({ error: 'Missing userId or chapterId' }, { status: 400 });
    }

    // Use upsert to handle race conditions gracefully under high concurrency (10k+ users)
    const progress = await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId: activeUserId,
          chapterId
        }
      },
      update: {
        score: score !== undefined ? score : undefined,
        completed: completed !== undefined ? completed : undefined,
        lastAccessed: new Date()
      },
      create: {
        userId: activeUserId,
        chapterId,
        score: score || 0,
        completed: completed || false
      }
    });

    return NextResponse.json({ success: true, data: progress });

  } catch (error) {
    console.error('[PROGRESS_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Fetch user progress for a specific user
export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const paramUserId = searchParams.get('userId');

    // Use token userId, fallback to paramUserId only if not authenticated, else test-user
    const activeUserId = userId || paramUserId || (process.env.NODE_ENV === 'development' ? 'test-user-1' : null);

    if (!activeUserId) {
      return NextResponse.json({ error: 'Unauthorized or missing userId' }, { status: 401 });
    }

    // Uses the @@index([userId]) we created for O(1) lookups
    const progress = await prisma.chapterProgress.findMany({
      where: {
        userId: activeUserId
      },
      orderBy: {
        lastAccessed: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: progress });

  } catch (error) {
    console.error('[PROGRESS_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
