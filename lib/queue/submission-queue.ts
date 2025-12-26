import Queue from 'bull';
import { prisma } from '@/lib/prisma';
import { validateSubmission } from '@/lib/test-validator';

// Parse Upstash Redis URL
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || '';
const redisHost = redisUrl.replace('https://', '').replace('http://', '');

export const submissionQueue = new Queue('sql-submissions', {
  redis: {
    host: redisHost,
    port: 6379,
    password: process.env.UPSTASH_REDIS_REST_TOKEN,
    tls: {
      rejectUnauthorized: false
    }
  }
});


submissionQueue.process(async (job) => {
  const { submissionId, userId, problemId, query } = job.data;

  try {

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true }
    });

    if (!problem) {
      throw new Error('Problem not found');
    }


    const validation = await validateSubmission(
      query,
      problem.testCases,
      problem.schema
    );


    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        isCorrect: validation.passed,
        result: JSON.stringify({
          passed: validation.passed,
          totalTests: validation.totalTests,
          passedTests: validation.passedTests,
          failedTests: validation.failedTests.map(tc => ({
            id: tc.id,
            isHidden: tc.isHidden
          }))
        }),
        executionTime: validation.executionTime,
      }
    });

    if (validation.passed) {
      await prisma.userProgress.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId
          }
        },
        create: {
          userId,
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
            userId,
            problemId
          }
        },
        create: {
          userId,
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

    return { success: true, validation };

  } catch (error: any) {
   
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        isCorrect: false,
        result: JSON.stringify({ error: error.message }),
      }
    });

    throw error;
  }
});