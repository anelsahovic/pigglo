'use server';

import { prisma } from '@/lib/prisma';
import { checkIfAuthorized, getAuthenticatedUser } from '@/lib/queries/auth';
import {
  AddNewTransactionSchema,
  AddNewTransactionType,
  EditTransactionAmountSchema,
  EditTransactionAmountType,
  EditTransactionMetadataSchema,
  EditTransactionMetadataType,
  EditTransactionTypeSchema,
  EditTransactionTypeType,
  EditTransactionWalletSchema,
  EditTransactionWalletType,
} from '@/lib/zodSchemas/transaction.schemas';
import { Decimal } from '@prisma/client/runtime/library';
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
              ? new Decimal(wallet.balance).plus(result.data.amount)
              : new Decimal(wallet.balance).minus(result.data.amount),
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

export async function updateTransactionMetadata(
  data: EditTransactionMetadataType,
  transactionId: string
) {
  const result = EditTransactionMetadataSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid transaction data',
    };
  }

  const existingTransaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!existingTransaction) {
    return {
      success: false,
      message: 'Transaction not found',
    };
  }

  await checkIfAuthorized(existingTransaction.userId);

  try {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        title: result.data.title,
        description: result.data.description,
      },
    });

    revalidatePath('/transactions');
    revalidatePath('/wallets');
    revalidatePath(`/wallets/${existingTransaction.walletId}`);

    return {
      success: true,
      message: 'Transaction data updated successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while updating transaction metadata',
    };
  }
}

export async function updateTransactionAmount(
  data: EditTransactionAmountType,
  transactionId: string
) {
  const result = EditTransactionAmountSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid transaction data',
    };
  }

  const existingTransaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!existingTransaction) {
    return {
      success: false,
      message: 'Transaction not found',
    };
  }

  const wallet = await prisma.wallet.findUnique({
    where: { id: existingTransaction.walletId },
  });

  if (!wallet) {
    return {
      success: false,
      message: 'Wallet not found',
    };
  }

  await checkIfAuthorized(existingTransaction.userId);

  const oldAmount = existingTransaction.amount;
  const newAmount = result.data.amount;
  // Calculate updated balance: remove old amount, add new amount
  const updatedBalance =
    existingTransaction.type === 'INCOME'
      ? wallet.balance.minus(oldAmount).plus(newAmount)
      : wallet.balance.plus(oldAmount).minus(newAmount);

  try {
    await prisma.$transaction([
      prisma.transaction.update({
        where: { id: transactionId },
        data: {
          amount: newAmount,
        },
      }),
      prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: updatedBalance,
        },
      }),
    ]);

    revalidatePath('/transactions');
    revalidatePath('/wallets');
    revalidatePath(`/wallets/${wallet.id}`);

    return {
      success: true,
      message: 'Transaction amount updated successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while updating transaction amount',
    };
  }
}

export async function updateTransactionType(
  data: EditTransactionTypeType,
  transactionId: string
) {
  const result = EditTransactionTypeSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid transaction data',
    };
  }

  const existingTransaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!existingTransaction) {
    return {
      success: false,
      message: 'Transaction not found',
    };
  }

  const wallet = await prisma.wallet.findUnique({
    where: { id: existingTransaction.walletId },
  });

  if (!wallet) {
    return {
      success: false,
      message: 'Wallet not found',
    };
  }

  await checkIfAuthorized(existingTransaction.userId);

  if (existingTransaction.type !== result.data.type) {
    // change wallet balance
    const amount = new Decimal(existingTransaction.amount);
    const updatedBalance =
      result.data.type === 'INCOME'
        ? wallet.balance.plus(amount.mul(2))
        : wallet.balance.minus(amount.mul(2));

    // change transaction type

    const updatedType = result.data.type;
    try {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transactionId },
          data: {
            type: updatedType,
          },
        }),
        prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: updatedBalance,
          },
        }),
      ]);

      revalidatePath('/transactions');
      revalidatePath('/wallets');
      revalidatePath(`/wallets/${wallet.id}`);

      return {
        success: true,
        message: 'Transaction type updated successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'An error occurred while updating transaction type',
      };
    }
  } else {
    return {
      success: true,
      message: 'Transaction type updated successfully',
    };
  }
}

export async function updateTransactionWallet(
  data: EditTransactionWalletType,
  transactionId: string
) {
  const result = EditTransactionWalletSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid transaction data',
    };
  }

  const existingTransaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!existingTransaction) {
    return {
      success: false,
      message: 'Transaction not found',
    };
  }

  const oldWallet = await prisma.wallet.findUnique({
    where: { id: existingTransaction.walletId },
  });

  const newWallet = await prisma.wallet.findUnique({
    where: { id: result.data.walletId },
  });

  if (!oldWallet || !newWallet) {
    return {
      success: false,
      message: 'Wallet not found',
    };
  }

  await checkIfAuthorized(existingTransaction.userId);

  if (newWallet.id !== oldWallet.id) {
    const amount = new Decimal(existingTransaction.amount);
    // change old wallet balance - revert
    const oldWalletBalance =
      existingTransaction.type === 'INCOME'
        ? oldWallet.balance.minus(amount)
        : oldWallet.balance.plus(amount);

    // change new wallet balance - add
    const newWalletBalance =
      existingTransaction.type === 'INCOME'
        ? newWallet.balance.plus(amount)
        : newWallet.balance.minus(amount);

    // change transactions walletId
    const newWalletId = result.data.walletId;

    try {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: oldWallet.id },
          data: {
            balance: oldWalletBalance,
          },
        }),
        prisma.wallet.update({
          where: { id: newWallet.id },
          data: {
            balance: newWalletBalance,
          },
        }),
        prisma.transaction.update({
          where: { id: transactionId },
          data: {
            walletId: newWalletId,
          },
        }),
      ]);

      revalidatePath('/transactions');
      revalidatePath('/wallets');
      revalidatePath(`/wallets/${oldWallet.id}`);
      revalidatePath(`/wallets/${newWallet.id}`);

      return {
        success: true,
        message: 'Transaction wallet updated successfully',
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'An error occurred while updating transaction type',
      };
    }
  } else {
    return {
      success: true,
      message: 'Transaction wallet updated successfully',
    };
  }
}

export async function deleteTransaction(id: string) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction) {
    return {
      success: false,
      message: 'No transaction found',
    };
  }

  const wallet = await prisma.wallet.findUnique({
    where: {
      id: transaction?.walletId,
    },
  });

  if (!wallet) {
    return {
      success: false,
      message: 'No wallet found',
    };
  }

  await checkIfAuthorized(transaction.userId);

  try {
    await prisma.$transaction([
      prisma.transaction.delete({ where: { id } }),

      prisma.wallet.update({
        where: {
          id: transaction.walletId,
        },
        data: {
          balance:
            transaction.type === 'INCOME'
              ? new Decimal(wallet.balance).minus(transaction.amount)
              : new Decimal(wallet.balance).plus(transaction.amount),
        },
      }),
    ]);

    revalidatePath('/transactions');
    revalidatePath('/wallets');
    revalidatePath(`/wallets/${transaction.walletId}`);

    return {
      success: true,
      message: 'Transaction deleted successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while deleting transaction',
    };
  }
}
