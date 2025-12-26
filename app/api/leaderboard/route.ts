import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/leaderboard
// GET /api/leaderboard?limit=10&timeframe=week
export async function GET(request: Request) {
  try {
    // STEP 1: Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10'); // Default: top 10
    const timeframe = searchParams.get('timeframe') || 'all'; // all, week, month

    // STEP 2: Calculate date filter based on timeframe
    let startDate = null;
    if (timeframe === 'week') {
      // Get last 7 days
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'month') {
      // Get last 30 days
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    // If 'all', startDate remains null (no filter)

    // STEP 3: Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // STEP 4: Calculate leaderboard data for each user
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        // Build where clause for submissions (filter by timeframe)
        const submissionWhere: any = { userId: user.id };
        if (startDate) {
          submissionWhere.createdAt = { gte: startDate };
        }

        // Count total solved problems (all time, not affected by timeframe)
        const solvedCount = await prisma.userProgress.count({
          where: {
            userId: user.id,
            status: 'SOLVED',
          },
        });

        // Get submissions in the timeframe
        const submissions = await prisma.submission.findMany({
          where: submissionWhere,
        });

        // Count successful submissions in timeframe
        const successfulSubmissions = submissions.filter(
          (s) => s.isCorrect
        ).length;

        // Calculate average execution time
        const avgExecutionTime =
          submissions.length > 0
            ? Math.round(
                submissions.reduce((sum, s) => sum + (s.executionTime || 0), 0) /
                  submissions.length
              )
            : 0;

        // Calculate score
        // Formula: (solved problems × 100) + (successful submissions × 10)
        const score = solvedCount * 100 + successfulSubmissions * 10;

        return {
          user,
          solvedCount,
          totalSubmissions: submissions.length,
          successfulSubmissions,
          successRate:
            submissions.length > 0
              ? ((successfulSubmissions / submissions.length) * 100).toFixed(1)
              : 0,
          avgExecutionTime,
          score,
        };
      })
    );

    // STEP 5: Filter users with at least 1 solved problem
    // Only show users who have solved something
    const filtered = leaderboardData.filter((data) => data.solvedCount > 0);

    // STEP 6: Sort by score (highest first)
    const sorted = filtered.sort((a, b) => b.score - a.score);

    // STEP 7: Get top N users (limit parameter)
    const topUsers = sorted.slice(0, limit);

    // STEP 8: Add ranking
    const leaderboard = topUsers.map((item, index) => ({
      rank: index + 1,                    // 1st place, 2nd place, etc
      user: item.user,
      solvedCount: item.solvedCount,
      totalSubmissions: item.totalSubmissions,
      successfulSubmissions: item.successfulSubmissions,
      successRate: item.successRate,
      avgExecutionTime: item.avgExecutionTime,
      score: item.score,
    }));

    // STEP 9: Return leaderboard with metadata
    return NextResponse.json({
      data: leaderboard,
      metadata: {
        timeframe,
        limit,
        total: filtered.length, // Total users with at least 1 solve
      },
    });

  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}