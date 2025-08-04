'use server';

import { prisma } from '@/lib/prisma';
import { checkIfAuthorized, getAuthenticatedUser } from '@/lib/queries/auth';
import {
  AddNewTransactionSchema,
  AddNewTransactionType,
} from '@/lib/zodSchemas/transaction.schemas';
import { revalidatePath } from 'next/cache';

export async function createTransaction(data: AddNewTransactionType) {
  const user = await getAuthenticatedUser();

  const result = AddNewTransactionSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'An error occurred while creating transaction',
    };
  }

  const wallet = await prisma.wallet.findUnique({
    where: { id: result.data.walletId },
  });

  if (!wallet) {
    return {
      success: false,
      message: 'No wallet found',
    };
  }

  await checkIfAuthorized(wallet.userId);

  try {
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          type: result.data.type,
          amount: result.data.amount,
          walletId: result.data.walletId,
          userId: user.id,
        },
      }),
      prisma.wallet.update({
        where: {
          id: result.data.walletId,
        },
        data: {
          balance:
            result.data.type === 'INCOME'
              ? wallet.balance.plus(result.data.amount)
              : wallet.balance.minus(result.data.amount),
        },
      }),
    ]);

    revalidatePath('/transactions');
    revalidatePath('/wallets');
    revalidatePath(`/wallets/${wallet.id}`);

    return {
      success: true,
      message: 'Transaction created successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while creating transaction',
    };
  }
}
