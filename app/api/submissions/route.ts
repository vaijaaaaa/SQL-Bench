import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';


export async function GET(request: Request) {
  try {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    
    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');     
    const page = parseInt(searchParams.get('page') || '1'); 
    const limit = parseInt(searchParams.get('limit') || '10'); 

 
    const where: any = { userId: user.id }; 
    if (problemId) {
      where.problemId = problemId; 
    }


    const skip = (page - 1) * limit;

    const total = await prisma.submission.count({ where });

    const submissions = await prisma.submission.findMany({
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
    });

  
    return NextResponse.json({
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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