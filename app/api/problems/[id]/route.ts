import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from '@/lib/prisma';
import { Param } from "@prisma/client/runtime/library";


export async function GET(request: Request,
  { params }: { params: { id: string } }){
        try {
            const problemId = params.id;

             const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: {
          select: {
            id: true,
            input: true,
            isHidden: true,
            expected: true, // Always show expected for logged-in users
          },
        },
      },
    });


        if(!problem){
            return NextResponse.json(
                {error : 'Problem not found'},
                {status : 404}
            );
        }


        const session = await getServerSession(authOptions);

        let userProgress = null;
        if(session?.user?.email){
            const user = await prisma.user.findUnique({
                where : {email : session.user.email},
            })
            if (user) {
        userProgress = await prisma.userProgress.findUnique({
          where: {
            userId_problemId: {
              userId: user.id,
              problemId: problemId,
            },
          },
        });
      }
        }


        return NextResponse.json({
            ...problem,
            userProgress,
        })





        } catch (error : any) {
            console.error('Get problem error :',error);
            return NextResponse.json(
                {error:'Failed to fetch problem'},
                {status : 500}
            )
        }
}

export async function PUT(
    request : Request,
    {params}:{params : {id : string}}
){
    try {
        const problemId = params.id;

        const body = await request.json();
          const {
      title,
      description,
      difficulty,
      category,
      schema,
      sampleData,
      solution,
    } = body;


    const problem = await prisma.problem.update({
      where: { id: problemId },
      data: {
        ...(title && { title }),                              
        ...(description && { description }),                  
        ...(difficulty && { difficulty: difficulty.toUpperCase() }),
        ...(category && { category }),
        ...(schema && { schema }),
        ...(sampleData && { sampleData }),
        ...(solution && { solution }),
      },
    });





    return NextResponse.json(problem);




    } catch (error : any) {
         console.error('Update problem error:', error);
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    );
    }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {

    const problemId = params.id;

    await prisma.problem.delete({
      where: { id: problemId },
    });

    return NextResponse.json({
      message: 'Problem deleted successfully',
      deletedId: problemId,
    });

  } catch (error: any) {
    console.error('Delete problem error:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem' },
      { status: 500 }
    );
  }
}