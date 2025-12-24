import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { submissionQueue } from '@/lib/queue/submission-queue';

export async function POST(request: Request) {
  try {

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { problemId, query } = body;


    if (!problemId || !query) {
      return NextResponse.json(
        { error: 'Problem ID and query are required' },
        { status: 400 }
      );
    }

  
    const problem = await prisma.problem.findUnique({
      where: { id: problemId }
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId,
        query,
        isCorrect: false, 
      }
    });

  
    await submissionQueue.add({
      submissionId: submission.id,
      userId: session.user.id,
      problemId,
      query,
    });

    return NextResponse.json({
      message: 'Submission received',
      submissionId: submission.id,
    }, { status: 202 });

  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}