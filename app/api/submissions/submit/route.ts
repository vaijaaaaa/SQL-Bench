import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { error } from 'console';
import { Erica_One } from 'next/font/google';

export async function GET (
    request : Request,
    {params} : {params : {id : string}}
) {
    try {
        const session = await getServerSession(authOptions);

        if(!session || !session.user){
            return NextResponse.json(
                {error : 'Unauthorized'},
                {status : 401}
            )
        };

        const submission = await prisma.submission.findUnique({
            where : {id : params.id},
            include : {
                problem : {
                    select : {
                        title : true,
                        difficulty : true,
                    }
                }
            }
        });

        if(!submission){
            return NextResponse.json(
                {error : 'Submission not found'},
                {status : 404}
            );
        }

        if(submission.userId !== session.user.id){
            return NextResponse.json(
                {error : 'Forbidden'},
                {status :403}
            );
        }

        return NextResponse.json(submission);


    } catch (error) {
        console.error('Get submission error :', error);
        return NextResponse.json(
            {error : 'Internal server error'},
            {status:500}
        );
    }
}