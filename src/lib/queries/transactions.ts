import { prisma } from '../prisma';
import { getAuthenticatedUser } from './auth';

export async function getAllUserTransactions() {
  const user = await getAuthenticatedUser();
  return await prisma.transaction.findMany({
    where: {
      userId: user.id,
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
    orderBy: {
      updatedAt: 'desc',
    },
  });
}
