import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit } from "@/lib/rate-limiter";


export async function POST(request :Request){
    try{
        const body = await request.json();
        const {email,password,name} = body

        const ip = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
        
        const rateLimit = await checkRateLimit(
            `signup:${ip}`,
            3,
            3600
        );

        if(!rateLimit.allowed){
            return NextResponse.json(
                {
                    error : 'Too many signup attempts',
                    message :   `Try again in ${Math.ceil(rateLimit.resetIn/60)} minutes`
                },
                {status : 429}
            );
        }

        if(!email || !password){
            return NextResponse.json(
                {error : "Email and password are required"},
                {status : 400}
            )
        }

        const existingUser = await prisma.user.findUnique({
            where : {email}
        })

        if(existingUser){
            return NextResponse.json(
                {error : "User already exists"},
                {status:400}
            )
        }
        const hashedPassword = await bcrypt.hash(password,10)

        const user = await prisma.user.create({
            data : {
                email,
                name,
                password : hashedPassword,
            }
        })

        return NextResponse.json(
            {
                message : "User created successfully",
                user : {
                    id : user.id,
                    email : user.email,
                    name : user.name
                }
            },
            {status : 201}
        )
    }catch(error){
        console.log("signup error :", error)
        return NextResponse.json(
            {error : "Something went wrong"},
            {status : 500}
        )
        
    }
}