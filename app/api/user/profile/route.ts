import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { resolveCurrentUser } from '@/lib/current-user';

export async function GET(request : Request){
    try {
        const session = await getServerSession(authOptions);

    if(!session || (!session.user?.id && !session.user?.email)){
            return NextResponse.json(
                {error : 'Unauthorized - Please login first'},
                {status : 401}
            );
        }

        const user = await resolveCurrentUser(session);

        if(!user){
            return NextResponse.json(
                {error : 'User not found'},
                {status : 404}
            );
        }

        return NextResponse.json(user, {
          headers: {
            'Cache-Control': 'private, no-store',
          },
        });



    } catch (error) {
        console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
    }
}

export async function PUT(request: Request) {
  try {

    const session = await getServerSession(authOptions);

    if (!session || (!session.user?.id && !session.user?.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const user = await resolveCurrentUser(session);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }


    const body = await request.json();
    const { name, image } = body;

    if (!name && !image) {
      return NextResponse.json(
        { error: 'At least one field (name or image) is required' },
        { status: 400 }
      );
    }


    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),    
        ...(image && { image }),  
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}