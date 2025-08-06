import { prisma } from '../prisma';
import { getAuthenticatedUser } from './auth';

export async function getAllUserTransactions() {
  const user = await getAuthenticatedUser();
  return await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
    include: {
      loan: {
        select: {
          direction: true,
          person: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getUsersIncomeTransactions() {
  const user = await getAuthenticatedUser();
  return await prisma.transaction.findMany({
    where: {
      userId: user.id,
      type: 'INCOME',
    },
    include: {
      loan: {
        select: {
          direction: true,
          person: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getUsersExpenseTransactions() {
  const user = await getAuthenticatedUser();
  return await prisma.transaction.findMany({
    where: {
      userId: user.id,
      type: 'EXPENSE',
    },
    include: {
      loan: {
        select: {
          direction: true,
          person: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}
