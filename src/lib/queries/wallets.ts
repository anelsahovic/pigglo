import { prisma } from '../prisma';

export async function getUserWallets(userId: string) {
  return await prisma.wallet.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}
