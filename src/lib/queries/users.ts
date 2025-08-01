import { prisma } from '../prisma';

export async function getDbUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
  });
}
