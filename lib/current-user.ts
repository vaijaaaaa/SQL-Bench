import { prisma } from "@/lib/prisma";

type SessionUser = {
  id?: string | null;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

type SessionLike = {
  user?: SessionUser | null;
};

type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
};

function buildUserWhere(session: SessionLike) {
  const clauses: Array<{ id?: string; email?: string }> = [];

  if (session.user?.id) {
    clauses.push({ id: session.user.id });
  }

  if (session.user?.email) {
    clauses.push({ email: session.user.email });
  }

  return clauses;
}

export async function resolveCurrentUser(session: SessionLike): Promise<CurrentUser | null> {
  const where = buildUserWhere(session);

  if (where.length === 0) {
    return null;
  }

  const select = {
    id: true,
    name: true,
    email: true,
    image: true,
    createdAt: true,
  } as const;

  const existingUser = await prisma.user.findFirst({
    where: { OR: where },
    select,
  });

  if (existingUser) {
    return existingUser;
  }

  const fallbackEmail = session.user?.email?.trim() || null;

  if (!fallbackEmail) {
    return null;
  }

  try {
    return await prisma.user.create({
      data: {
        email: fallbackEmail,
        name: session.user?.name ?? null,
        image: session.user?.image ?? null,
      },
      select,
    });
  } catch {
    return prisma.user.findFirst({
      where: { email: fallbackEmail },
      select,
    });
  }
}