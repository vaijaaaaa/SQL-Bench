import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/submissions/sub_123/get
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // STEP 3: Get submission ID from URL parameter
    const { id: submissionId } = await params;

    // STEP 4: Fetch submission with all details
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        problem: {
          include: {
            testCases: {
              select: {
                id: true,
                input: true,
                expected: true,
                isHidden: true,
              },
            },
          },
        },
      },
    });

    // STEP 5: Check if submission exists
    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // STEP 6: Security check - user can only view their own submissions
    if (submission.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You can only view your own submissions' },
        { status: 403 }
      );
    }

    // STEP 7: Return submission with problem and test cases
    return NextResponse.json(submission);

  } catch (error: any) {
    console.error('Get submission error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}