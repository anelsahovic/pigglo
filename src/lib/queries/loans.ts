import { prisma } from '../prisma';
import { getAuthenticatedUser } from './auth';

export async function getUserLoans() {
  const authUser = await getAuthenticatedUser();

  return prisma.loan.findMany({
    where: {
      userId: authUser.id,
    },
    include: {
      transactions: {
        include: {
          loan: {
            select: {
              direction: true,
              person: {
                select: { name: true },
              },
            },
          },
          wallet: {
            select: {
              currency: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getUserLoanById(loanId: string) {
  const authUser = await getAuthenticatedUser();

  return prisma.loan.findUnique({
    where: {
      userId: authUser.id,
      id: loanId,
    },
    include: {
      person: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getUserLoansByRelatedPersonId(relatedPersonId: string) {
  const authUser = await getAuthenticatedUser();

  return prisma.loan.findMany({
    where: {
      userId: authUser.id,
      personId: relatedPersonId,
    },
    include: {
      transactions: {
        include: {
          loan: {
            select: {
              direction: true,
              person: {
                select: { name: true },
              },
            },
          },
          wallet: {
            select: {
              currency: true,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}
