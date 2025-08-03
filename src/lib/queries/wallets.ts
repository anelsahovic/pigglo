import { prisma } from '../prisma';

export async function getUserWallets(userId: string) {
  return await prisma.wallet.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getWalletById(walletId: string) {
  return await prisma.wallet.findUnique({
    where: { id: walletId },
    include: {
      transactions: true,
    },
  });
}
