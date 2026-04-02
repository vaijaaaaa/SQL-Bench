import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAX_LEADERBOARD_LIMIT = 100;

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);
    const parsedLimit = parseInt(searchParams.get('limit') || '10', 10);
    const limit = Number.isNaN(parsedLimit)
      ? 10
      : Math.min(Math.max(parsedLimit, 1), MAX_LEADERBOARD_LIMIT);
    const timeframe = searchParams.get('timeframe') || 'all'; 


    let startDate = null;
    if (timeframe === 'week') {
   
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'month') {
     
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
   
    const solvedByUser = await prisma.userProgress.groupBy({
      by: ['userId'],
      where: {
        status: 'SOLVED',
      },
      _count: {
        _all: true,
      },
    });

    if (solvedByUser.length === 0) {
      return NextResponse.json(
        {
          data: [],
          metadata: {
            timeframe,
            limit,
            total: 0,
          },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
          },
        }
      );
    }

    const userIds = solvedByUser.map((item) => item.userId);

    const submissionWhere: any = { userId: { in: userIds } };
    if (startDate) {
      submissionWhere.createdAt = { gte: startDate };
    }

    const [users, submissionsByUser, successfulSubmissionsByUser] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      }),
      prisma.submission.groupBy({
        by: ['userId'],
        where: submissionWhere,
        _count: {
          _all: true,
        },
        _avg: {
          executionTime: true,
        },
      }),
      prisma.submission.groupBy({
        by: ['userId'],
        where: {
          ...submissionWhere,
          isCorrect: true,
        },
        _count: {
          _all: true,
        },
      }),
    ]);

    const solvedMap = new Map(solvedByUser.map((item) => [item.userId, item._count._all]));
    const submissionMap = new Map(
      submissionsByUser.map((item) => [
        item.userId,
        {
          total: item._count._all,
          avgExecutionTime: Math.round(item._avg.executionTime ?? 0),
        },
      ])
    );
    const successfulMap = new Map(
      successfulSubmissionsByUser.map((item) => [item.userId, item._count._all])
    );

    const filtered = users.map((user) => {
      const solvedCount = solvedMap.get(user.id) ?? 0;
      const submissionStats = submissionMap.get(user.id) ?? { total: 0, avgExecutionTime: 0 };
      const successfulSubmissions = successfulMap.get(user.id) ?? 0;
      const totalSubmissions = submissionStats.total;
      const score = solvedCount * 100 + successfulSubmissions * 10;

      return {
        user,
        solvedCount,
        totalSubmissions,
        successfulSubmissions,
        successRate:
          totalSubmissions > 0
            ? ((successfulSubmissions / totalSubmissions) * 100).toFixed(1)
            : '0.0',
        avgExecutionTime: submissionStats.avgExecutionTime,
        score,
      };
    });


    const sorted = filtered.sort((a, b) => b.score - a.score);


    const topUsers = sorted.slice(0, limit);


    const leaderboard = topUsers.map((item, index) => ({
      rank: index + 1,              
      user: item.user,
      solvedCount: item.solvedCount,
      totalSubmissions: item.totalSubmissions,
      successfulSubmissions: item.successfulSubmissions,
      successRate: item.successRate,
      avgExecutionTime: item.avgExecutionTime,
      score: item.score,
    }));


    return NextResponse.json({
      data: leaderboard,
      metadata: {
        timeframe,
        limit,
        total: filtered.length, 
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
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