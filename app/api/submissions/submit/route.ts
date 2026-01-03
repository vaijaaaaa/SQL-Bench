import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { executeSQLQuery } from '@/lib/sql-executor';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(request: Request) {
  try {

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const ratelimit = await checkRateLimit(
      `submit:${session.user.email}`,
      10,
      60
    );

    if(!ratelimit.allowed){
      return NextResponse.json(
        {
          error : 'Too many submissions',
          message : `Please wait ${ratelimit.resetIn} seconds before trying again`
        },
        {status : 429}
      )
    }

    const body = await request.json();
    const { problemId, code, isSubmission } = body;


    if (!problemId || !code) {
      return NextResponse.json(
        { error: 'Problem ID and code are required' },
        { status: 400 }
      );
    }

  
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true }
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Execute the query
    try {
      const execResult = await executeSQLQuery(code, problem.schema, problem.sampleData);
      
      if (!execResult.success) {
        return NextResponse.json({
          success: false,
          error: execResult.error
        });
      }
      
      if (!isSubmission) {
        // Just run the query, don't test
        return NextResponse.json({
          success: true,
          rows: execResult.rows
        });
      }

      // Test against test cases
      const testResults = problem.testCases.map((testCase) => {
        try {
          const expected = JSON.parse(testCase.expected);
          const passed = JSON.stringify(execResult.rows) === JSON.stringify(expected);
          return {
            id: testCase.id,
            passed,
            error: passed ? null : `Expected different results`
          };
        } catch (e) {
          return {
            id: testCase.id,
            passed: false,
            error: 'Test case parsing error'
          };
        }
      });

      const allPassed = testResults.every(t => t.passed);

      // Create submission record
      const submission = await prisma.submission.create({
        data: {
          userId: user.id,
          problemId,
          query: code,
          isCorrect: allPassed, 
        }
      });

      // Update user progress
      if (allPassed) {
        await prisma.userProgress.upsert({
          where: {
            userId_problemId: {
              userId: user.id,
              problemId
            }
          },
          create: {
            userId: user.id,
            problemId,
            status: 'SOLVED'
          },
          update: {
            status: 'SOLVED'
          }
        });
      }

      return NextResponse.json({
        success: true,
        rows: execResult.rows,
        testResults,
        submissionId: submission.id
      });

    } catch (execError: any) {
      return NextResponse.json({
        success: false,
        error: execError.message || 'Query execution failed',
        testResults: []
      });
    }
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Submission failed: ' + error.message },
      { status: 500 }
    );
  }
}