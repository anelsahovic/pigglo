'use server';

import { prisma } from '@/lib/prisma';
import { checkIfAuthorized, getAuthenticatedUser } from '@/lib/queries/auth';
import {
  AddNewLoanTransactionSchema,
  AddNewLoanTransactionType,
  EditLoanRelatedPersonSchema,
  EditLoanRelatedPersonType,
} from '@/lib/zodSchemas/loan.schemas';
import { Decimal } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';

export async function createLoanTransaction(data: AddNewLoanTransactionType) {
  const user = await getAuthenticatedUser();

  const result = AddNewLoanTransactionSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data provided',
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

  const transactionType =
    result.data.direction === 'TO_SOMEONE' ? 'EXPENSE' : 'INCOME';

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Create Loan
      const loan = await tx.loan.create({
        data: {
          personId: result.data.personId,
          direction: result.data.direction,
          userId: user.id,
        },
      });

      // 2. Create Transaction with loanId
      await tx.transaction.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          type: transactionType,
          amount: result.data.amount,
          walletId: result.data.walletId,
          userId: user.id,
          loanId: loan.id,
        },
      });

      // 3. Update wallet balance
      const newBalance =
        transactionType === 'INCOME'
          ? new Decimal(wallet.balance).plus(result.data.amount)
          : new Decimal(wallet.balance).minus(result.data.amount);

      await tx.wallet.update({
        where: {
          id: result.data.walletId,
        },
        data: {
          balance: newBalance,
        },
      });
    });

    revalidatePath('/transactions');
    revalidatePath('/loans');
    revalidatePath('/wallets');
    revalidatePath(`/wallets/${wallet.id}`);

    return {
      success: true,
      message: 'Loan transaction created successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while creating loan transaction',
    };
  }
}

export async function updateLoanRelatedPerson(
  data: EditLoanRelatedPersonType,
  transactionId: string
) {
  const result = EditLoanRelatedPersonSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data',
    };
  }

  const existingLoanTransaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!existingLoanTransaction) {
    return {
      success: false,
      message: 'Loan Transaction not found',
    };
  }

  const loan = await prisma.loan.findUnique({
    where: { id: existingLoanTransaction.loanId || '' },
  });

  if (!loan) {
    return {
      success: false,
      message: 'Loan not found',
    };
  }

  await checkIfAuthorized(existingLoanTransaction.userId);

  if (loan.personId !== result.data.personId) {
    try {
      await prisma.loan.update({
        where: {
          id: loan.id,
        },
        data: {
          personId: result.data.personId,
        },
      });

      revalidatePath('/transactions');
      revalidatePath('/loans');
      revalidatePath('/wallets');
      revalidatePath(`/wallets/${existingLoanTransaction.walletId}`);

      return {
        success: true,
        message: 'Loan related person updated successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'An error occurred while updating related person',
      };
    }
  } else {
    return {
      success: true,
      message: 'Loan related person updated successfully',
    };
  }
}
