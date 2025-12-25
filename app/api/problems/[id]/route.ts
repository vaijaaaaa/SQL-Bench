import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request,
  { params }: { params: Promise<{ id: string }> }){
        try {
            const { id: problemId } = await params;

            const problem = await prisma.problem.findUnique({
                where: { id: problemId },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    difficulty: true,
                    category: true,
                    schema: true,
                    sampleData: true,
                    solution: true,
                    slug: true,
                    createdAt: true,
                    _count: {
                        select: { testCases: true }
                    }
                },
            });

            if(!problem){
                return NextResponse.json(
                    {error : 'Problem not found'},
                    {status : 404}
                );
            }

            return NextResponse.json(problem);

        } catch (error : any) {
            console.error('Get problem error:', error.message || error);
            return NextResponse.json(
                {error:'Failed to fetch problem', details: error.message},
                {status : 500}
            )
        }
}

export async function PUT(
    request : Request,
    {params}:{params : Promise<{id : string}>}
){
    try {
        const { id: problemId } = await params;

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await params;

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