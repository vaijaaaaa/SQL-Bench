import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function GET(request:Request) {
    try {

        const ip = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') ||
                    'unknown';

        const retaLimit = await checkRateLimit(
            `problems:${ip}`,
            100,
            60
        );

        if (!retaLimit.allowed) {
          return NextResponse.json(
            { error: 'Too many requests. Please slow down.' },
            { status: 429 }
          );
        }


        const {searchParams} = new URL(request.url);
        const difficulty = searchParams.get('difficulty');
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where : any = {};

        if(difficulty){
            where.difficulty = difficulty.toUpperCase();
        }

        if(category){
            where.category = category;
        }

        const skip = (page-1) * limit;
        const total = await prisma.problem.count({where});

        const problems = await prisma.problem.findMany({
            where,
            skip,
            take : limit,
            select : {
                id : true,
                title : true,
                slug : true,
                description : true,
                difficulty : true,
                category : true,
                createdAt : true,
                _count : {
                    select : {testCases : true},
                },
            },
            orderBy : {createdAt : 'desc'},
        })

        return NextResponse.json({
            data : problems,
            pagination:{
                page,
                limit,
                total,
                pages : Math.ceil(total/limit),
            }
        })



    } catch (error : any) {
        console.error('Get problems error:',error);
        return NextResponse.json(
            {error : 'Failed to fetch problems'},
            {status:500}
        );
    }
}

export async function POST(request:Request){
    try {
        const body = await request.json();
        const{
            title,
            slug,
            description,
            difficulty,
            category,
            schema,
            sampleData,
            solution,
        } = body;

        if(!title || !slug || !description || !difficulty || !schema || !sampleData){
            return NextResponse.json(
                {error: 'Missing required fields'},
                {status : 400}
            );
        }

        const existingProblem = await prisma.problem.findUnique({
            where : {slug},
        });

        if(existingProblem){
            return NextResponse.json(
                {error : 'Problem with this slug already exists'},
                {status:400}
            );
        }

        const problem = await prisma.problem.create({
            data : {
                title,
                slug,
                description,
                difficulty : difficulty.toUpperCase(),
                category,
                schema,
                sampleData,
                solution,
            },
        })


        return NextResponse.json(problem,{status:201});


    } catch (error) {
        console.error('Create Problem error:',error);
        return NextResponse.json(
            {error : 'Failed to crete problem'},
            {status: 500}
        );
    }
}