import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';


export async function GET(request: Request) {
  try {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId'); 
    const limitParam = parseInt(searchParams.get('limit') || '200', 10);
    const limit = Number.isNaN(limitParam) ? 200 : Math.min(Math.max(limitParam, 1), 500);

    if (problemId) {
      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_problemId: {
            userId: session.user.id,
            problemId: problemId,
          },
        },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
              category: true,
            },
          },
        },
      });

      return NextResponse.json(progress || null, {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      });
    }


    const allProgress = await prisma.userProgress.findMany({
      where: { userId: session.user.id },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            category: true,
          },
        },
      },
      take: limit,
      orderBy: { updatedAt: 'desc' },
    });

    
    return NextResponse.json(allProgress, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });

  } catch (error: any) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}