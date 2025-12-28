import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10'); 
    const timeframe = searchParams.get('timeframe') || 'all'; 


    let startDate = null;
    if (timeframe === 'week') {
   
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'month') {
     
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
   


    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    const leaderboardData = await Promise.all(
      users.map(async (user) => {
   
        const submissionWhere: any = { userId: user.id };
        if (startDate) {
          submissionWhere.createdAt = { gte: startDate };
        }

 
        const solvedCount = await prisma.userProgress.count({
          where: {
            userId: user.id,
            status: 'SOLVED',
          },
        });


        const submissions = await prisma.submission.findMany({
          where: submissionWhere,
        });


        const successfulSubmissions = submissions.filter(
          (s) => s.isCorrect
        ).length;

    
        const avgExecutionTime =
          submissions.length > 0
            ? Math.round(
                submissions.reduce((sum, s) => sum + (s.executionTime || 0), 0) /
                  submissions.length
              )
            : 0;


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


    const filtered = leaderboardData.filter((data) => data.solvedCount > 0);


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
    });

  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}