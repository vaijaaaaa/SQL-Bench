import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { resolveCurrentUser } from '@/lib/current-user';


export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (!session.user?.id && !session.user?.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const currentUser = await resolveCurrentUser(session);

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');     
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '10', 10);
    const page = Number.isNaN(pageParam) ? 1 : Math.max(1, pageParam);
    const limit = Number.isNaN(limitParam) ? 10 : Math.min(Math.max(1, limitParam), 50);

    const where: any = { userId: currentUser.id };
    if (problemId) {
      where.problemId = problemId; 
    }

    const skip = (page - 1) * limit;

    const [total, submissions] = await Promise.all([
      prisma.submission.count({ where }),
      prisma.submission.findMany({
        where,
        skip,
        take: limit,
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

  
    return NextResponse.json({
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });

  } catch (error: any) {
    console.error('Get submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}