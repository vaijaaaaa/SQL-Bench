import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import {prisma} from '@/lib/prisma';
import { validateSubmission } from '@/lib/test-validator';

export async function POST (request : Request){
    try {
        const session = await getServerSession(authOptions);

        if(!session || !session.user){
            return NextResponse.json(
                {error:'Unauthorized'},
                {status : 401}
            );
        }

        const body = await request.json();
        const {problemId,query} = body;

        if(!problemId || !query){
            return NextResponse.json(
                {error:'Problem ID and query are required'},
                {status:400}
            )
        }

        const problem = await prisma.problem.findUnique({
            where : {id : problemId},
            include: { testCases: true }
        })

        if(!problem){
            return NextResponse.json(
                {error : 'Problem not found'},
                {status : 404}
            );
        }

        const submission = await prisma.submission.create({
            data : {
                userId : session.user.id,
                problemId,
                query,
                isCorrect:false,
            }
        })

        // Process submission inline
        try {
            const validation = await validateSubmission(
                query,
                problem.testCases,
                problem.schema
            );

            await prisma.submission.update({
                where: { id: submission.id },
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
                            userId: session.user.id,
                            problemId
                        }
                    },
                    create: {
                        userId: session.user.id,
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
                            userId: session.user.id,
                            problemId
                        }
                    },
                    create: {
                        userId: session.user.id,
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

            return NextResponse.json({
                success: true,
                submissionId: submission.id,
                validation
            });

        } catch (validationError: any) {
            await prisma.submission.update({
                where: { id: submission.id },
                data: {
                    isCorrect: false,
                    result: JSON.stringify({ error: validationError.message }),
                }
            });

            return NextResponse.json({
                success: false,
                error: validationError.message,
                submissionId: submission.id
            }, { status: 400 });
        }

    } catch (error) {
        console.error('Submission error :',error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status : 500}
        )
    }
}