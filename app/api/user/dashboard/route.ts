import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/user/dashboard
export async function GET(request: Request) {
  try {
    // STEP 1: Get user session (must be logged in)
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    // STEP 2: Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // STEP 3: Count total problems in system
    const totalProblems = await prisma.problem.count();

    // STEP 4: Count how many problems user SOLVED
    const solvedProblems = await prisma.userProgress.count({
      where: {
        userId: user.id,
        status: 'SOLVED',
      },
    });

    // STEP 5: Count how many problems user ATTEMPTED (but didn't solve)
    const attemptedProblems = await prisma.userProgress.count({
      where: {
        userId: user.id,
        status: 'ATTEMPTED',
      },
    });

    // STEP 6: Count total submissions by user
    const totalSubmissions = await prisma.submission.count({
      where: { userId: user.id },
    });

    // STEP 7: Count successful submissions (isCorrect = true)
    const successfulSubmissions = await prisma.submission.count({
      where: {
        userId: user.id,
        isCorrect: true,
      },
    });

    // STEP 8: Calculate success rate percentage
    const successRate =
      totalSubmissions > 0
        ? ((successfulSubmissions / totalSubmissions) * 100).toFixed(1)
        : 0;

    // STEP 9: Get recent 5 submissions with problem details
    const recentSubmissions = await prisma.submission.findMany({
      where: { userId: user.id },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      take: 5,
      orderBy: { createdAt: 'desc' }, // Newest first
    });

    // STEP 10: Get progress breakdown by difficulty
    const problemsByDifficulty = await prisma.problem.groupBy({
      by: ['difficulty'],
      _count: true, // Count how many problems per difficulty
    });

    // STEP 11: Get user's progress by difficulty
    const progressByDifficulty = await prisma.userProgress.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true, // Count how many in each status
    });

    // STEP 12: Return comprehensive dashboard data
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      stats: {
        totalProblems,                              // Total problems in system
        solvedProblems,                             // Your solved count
        attemptedProblems,                          // Your attempted count
        unsolvedProblems: totalProblems - solvedProblems - attemptedProblems, // Remaining
        totalSubmissions,                           // Total submissions made
        successfulSubmissions,                      // Correct submissions
        successRate,                                // Success percentage
      },
      recentSubmissions,                           // Last 5 submissions
      problemsByDifficulty,                        // How many EASY/MEDIUM/HARD exist
      progressByDifficulty,                        // Your progress distribution
    });

  } catch (error: any) {
    console.error('Get dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}