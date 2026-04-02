import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { resolveCurrentUser } from '@/lib/current-user';

// GET /api/user/dashboard
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (!session.user?.id && !session.user?.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const user = await resolveCurrentUser(session);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user.id;
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalProblems, solvedProblems, attemptedProblems, totalSubmissions, successfulSubmissions, solvedThisWeek, solvedThisMonth, recentSubmissions, problemsByDifficulty, problemsByCategory, solvedRows, progressByDifficulty] = await Promise.all([
      prisma.problem.count(),
      prisma.userProgress.count({
        where: {
          userId,
          status: 'SOLVED',
        },
      }),
      prisma.userProgress.count({
        where: {
          userId,
          status: 'ATTEMPTED',
        },
      }),
      prisma.submission.count({
        where: { userId },
      }),
      prisma.submission.count({
        where: {
          userId,
          isCorrect: true,
        },
      }),
      prisma.userProgress.count({
        where: {
          userId,
          status: 'SOLVED',
          solvedAt: {
            gte: weekStart,
          },
        },
      }),
      prisma.userProgress.count({
        where: {
          userId,
          status: 'SOLVED',
          solvedAt: {
            gte: monthStart,
          },
        },
      }),
      prisma.submission.findMany({
        where: { userId },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            },
          },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.problem.groupBy({
        by: ['difficulty'],
        _count: true,
      }),
      prisma.problem.groupBy({
        by: ['category'],
        _count: true,
      }),
      prisma.userProgress.findMany({
        where: {
          userId,
          status: 'SOLVED',
        },
        select: {
          problem: {
            select: {
              category: true,
              difficulty: true,
            },
          },
        },
      }),
      prisma.userProgress.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
    ]);

    const successRate =
      totalSubmissions > 0
        ? ((successfulSubmissions / totalSubmissions) * 100).toFixed(1)
        : 0;

    const solvedByCategory = solvedRows.reduce<Record<string, number>>((acc, row) => {
      const category = row.problem?.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const solvedByDifficulty = solvedRows.reduce<Record<string, number>>((acc, row) => {
      const difficulty = row.problem?.difficulty || 'EASY';
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      },
      stats: {
        totalProblems,                              // Total problems in system
        solvedProblems,                             // Your solved count
        attemptedProblems,                          // Your attempted count
        unsolvedProblems: totalProblems - solvedProblems - attemptedProblems, // Remaining
        totalSubmissions,                           // Total submissions made
        successfulSubmissions,                      // Correct submissions
        successRate,                                // Success percentage
        solvedThisWeek,
        solvedThisMonth,
      },
      recentSubmissions,                           // Last 5 submissions
      problemsByDifficulty,                        // How many EASY/MEDIUM/HARD exist
      problemsByCategory,
      progressByDifficulty,                        // Your progress distribution
      solvedByCategory,
      solvedByDifficulty,
    });

  } catch (error: any) {
    console.error('Get dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}