import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { executeSQLQuery } from '@/lib/sql-executor';
import { checkRateLimit } from '@/lib/rate-limiter';
import { compareResults } from '@/lib/test-validator';
import { logger } from '@/lib/logger';
import { validateBody, submissionSchema, sanitizeSQLInput } from '@/lib/validation';
import type { SubmissionResult, TestCaseResult } from '@/types/api';
import { resolveCurrentUser } from '@/lib/current-user';

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    
    if (!session || (!session.user?.id && !session.user?.email)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get or recreate the authenticated user record.
    const user = await resolveCurrentUser(session);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Rate limiting
    const ratelimit = await checkRateLimit(
      `submit:${user.email ?? session.user.email ?? user.id}`,
      10,
      60
    );

    if (!ratelimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many submissions',
          message: `Please wait ${ratelimit.resetIn} seconds before trying again`
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = validateBody(submissionSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { problemId, code, isSubmission } = validation.data;

    // Sanitize SQL input
    const sanitizedCode = sanitizeSQLInput(code);

    // Get problem details
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true }
    });

    if (!problem) {
      return NextResponse.json(
        { success: false, error: 'Problem not found' },
        { status: 404 }
      );
    }

    // Execute the query
    try {
      logger.debug('Executing query', {
        userId: user.id,
        problemId,
        queryLength: sanitizedCode.length,
      });
      
      const execResult = await executeSQLQuery(
        sanitizedCode,
        problem.schema,
        problem.sampleData
      );
      
      if (!execResult.success) {
        return NextResponse.json<SubmissionResult>({
          success: false,
          error: execResult.error
        });
      }
      
      // If not a submission, just return results
      if (!isSubmission) {
        return NextResponse.json<SubmissionResult>({
          success: true,
          rows: execResult.rows
        });
      }

      // Test against test cases
      logger.debug('Running test validation', { testCount: problem.testCases.length });
      
      const testResults: TestCaseResult[] = problem.testCases.map((testCase) => {
        try {
          const expected = JSON.parse(testCase.expected);
          const passed = compareResults(execResult.rows || [], expected);
          
          return {
            id: testCase.id,
            passed,
            error: passed ? undefined : 'Expected different results',
            actual: testCase.isHidden ? undefined : execResult.rows,
            expected: testCase.isHidden ? undefined : expected,
            isHidden: testCase.isHidden,
          };
        } catch (e: any) {
          logger.error('Test case parsing error', e, { testCaseId: testCase.id });
          return {
            id: testCase.id,
            passed: false,
            error: 'Test case parsing error: ' + e.message,
            isHidden: testCase.isHidden,
          };
        }
      });

      const allPassed = testResults.every((t) => t.passed);
      const passedCount = testResults.filter((t) => t.passed).length;
      
      logger.info('Submission completed', {
        userId: user.id,
        problemId,
        passed: allPassed,
        passedCount,
        totalTests: testResults.length,
      });

      // Create submission record
      const submission = await prisma.submission.create({
        data: {
          userId: user.id,
          problemId,
          query: sanitizedCode,
          isCorrect: allPassed,
          executionTime: execResult.executionTime,
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
            status: 'SOLVED',
            attempts: 1,
            solvedAt: new Date(),
          },
          update: {
            status: 'SOLVED',
            solvedAt: new Date(),
            attempts: {
              increment: 1
            }
          }
        });
      } else {
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
            status: 'ATTEMPTED',
            attempts: 1,
          },
          update: {
            status: 'ATTEMPTED',
            attempts: {
              increment: 1
            }
          }
        });
      }

      const duration = Date.now() - startTime;
      logger.api('POST', '/api/submissions/submit', 200, duration);

      return NextResponse.json<SubmissionResult>({
        success: true,
        rows: execResult.rows,
        testResults,
        submissionId: submission.id,
        executionTime: execResult.executionTime,
      });

    } catch (execError: any) {
      logger.error('Query execution error', execError, { userId: user.id, problemId });
      return NextResponse.json<SubmissionResult>({
        success: false,
        error: execError.message || 'Query execution failed',
        testResults: []
      });
    }
  } catch (error: any) {
    logger.error('Submission request failed', error);
    const duration = Date.now() - startTime;
    logger.api('POST', '/api/submissions/submit', 500, duration);
    
    return NextResponse.json(
      { success: false, error: 'Submission failed: ' + error.message },
      { status: 500 }
    );
  }
}