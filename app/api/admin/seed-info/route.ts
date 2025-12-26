import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint helps populate problems from the database
// Usage: GET /api/admin/seed
export async function GET(request: Request) {
  try {
    // Check if ADMIN_SECRET is provided (for security)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Simple security check
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all problems grouped by category
    const problems = await prisma.problem.findMany({
      include: {
        _count: {
          select: { testCases: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const groupedByCategory = problems.reduce((acc: any, problem) => {
      if (!acc[problem.category]) {
        acc[problem.category] = [];
      }
      acc[problem.category].push(problem);
      return acc;
    }, {});

    return NextResponse.json({
      totalProblems: problems.length,
      byCategory: groupedByCategory,
      problems,
    });

  } catch (error: any) {
    console.error('Seed info error:', error);
    return NextResponse.json(
      { error: 'Failed to get seed info' },
      { status: 500 }
    );
  }
}
