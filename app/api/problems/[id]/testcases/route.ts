import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await params;

    const testCases = await prisma.testCase.findMany({
      where: { problemId },
      select: {
        id: true,
        input: true,
        expected: true,
        isHidden: true,
      },
    });

    return NextResponse.json(testCases);
  } catch (error) {
    console.error('Fetch test cases error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test cases' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await params;

    const body = await request.json();
    const { input, expected, isHidden } = body;

    if (!input || !expected) {
      return NextResponse.json(
        { error: 'Input and expected fields are required' },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    const testCase = await prisma.testCase.create({
      data: {
        problemId,
        input,
        expected,
        isHidden: Boolean(isHidden),
      },
    });

    return NextResponse.json(testCase, { status: 201 });
  } catch (error) {
    console.error('Create test case error:', error);
    return NextResponse.json(
      { error: 'Failed to create test case' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await params;

    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId');

    if (!testCaseId) {
      return NextResponse.json(
        { error: 'testCaseId query parameter is required' },
        { status: 400 }
      );
    }

    const testCase = await prisma.testCase.findUnique({
      where: { id: testCaseId },
    });

    if (!testCase) {
      return NextResponse.json(
        { error: 'Test case not found' },
        { status: 404 }
      );
    }

    if (testCase.problemId !== problemId) {
      return NextResponse.json(
        { error: 'Test case does not belong to this problem' },
        { status: 400 }
      );
    }

    await prisma.testCase.delete({
      where: { id: testCaseId },
    });

    return NextResponse.json({
      message: 'Test case deleted successfully',
      deletedId: testCaseId,
    });
  } catch (error) {
    console.error('Delete test case error:', error);
    return NextResponse.json(
      { error: 'Failed to delete test case' },
      { status: 500 }
    );
  }
}
