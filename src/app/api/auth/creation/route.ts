import { prisma } from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

export async function GET() {
  dotenv.config();

  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user || !user.id) {
    throw new Error("Couldn't find user");
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const backupUsername = user.email?.split('@') ?? '';

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        name: user.given_name,
        username:
          user.username || user.given_name?.toLowerCase() || backupUsername[0],
        email: user.email ?? '',
        profileImage: user.picture ?? '',
      },
    });
  }

  return NextResponse.redirect(
    process.env.REDIRECT_URL || 'http://localhost:3000/dashboard'
  );
}
