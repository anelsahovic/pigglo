'use server';

import { prisma } from '@/lib/prisma';
import { checkIfAuthorized, getAuthenticatedUser } from '@/lib/queries/auth';
import { exchangeCurrencyRate } from '@/lib/utils';
import {
  updateCurrencySchema,
  UpdateCurrencyType,
} from '@/lib/zodSchemas/user.schemas';
import {
  AddNewWalletSchema,
  AddNewWalletType,
  EditWalletSchema,
  EditWalletType,
} from '@/lib/zodSchemas/wallet.schemas';
import { Decimal } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';

export async function createWallet(data: AddNewWalletType) {
  const user = await getAuthenticatedUser();

  const result = AddNewWalletSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'An error occurred while creating wallet',
    };
  }

  try {
    await prisma.wallet.create({
      data: {
        userId: user.id,
        name: result.data.name,
        balance: result.data.balance,
        currency: result.data.currency,
        icon: result.data.icon,
      },
    });
    revalidatePath('/wallets');

    return {
      success: true,
      message: 'Wallet created successfully',
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'An error occurred while updating currency',
    };
  }
}

export async function updateWallet(data: EditWalletType, walletId: string) {
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
  });

  if (!wallet) {
    return {
      success: false,
      message: 'No wallet found',
    };
  }

  await checkIfAuthorized(wallet.userId);

  const result = EditWalletSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'An error occurred while updating the wallet',
    };
  }

  try {
    await prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        name: result.data.name,
        balance: new Decimal(result.data.balance),
        currency: result.data.currency,
        icon: result.data.icon,
      },
    });

    revalidatePath(`/wallets/${walletId}`);
    return {
      success: true,
      message: 'Wallet updated successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while updating the wallet',
    };
  }
}

export async function updateWalletCurrency(
  data: UpdateCurrencyType,
  walletId: string
) {
  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId },
  });

  if (!wallet) {
    return {
      success: false,
      message: 'No wallet found',
    };
  }

  await checkIfAuthorized(wallet.userId);

  const result = updateCurrencySchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'An error occurred while updating currency',
    };
  }

  const convertedBalance = await exchangeCurrencyRate(
    data.currency,
    wallet.currency,
    wallet.balance
  );

  try {
    await prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        currency: result.data.currency,
        balance: new Decimal(convertedBalance),
      },
    });

    revalidatePath(`/wallets/${walletId}`);
    return {
      success: true,
      message: 'Currency updated successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while updating currency',
    };
  }
}

export async function deleteWallet(walletId: string) {
  const wallet = await prisma.wallet.findUnique({
    where: {
      id: walletId,
    },
  });

  if (!wallet) {
    return {
      success: false,
      message: 'No wallet found',
    };
  }

  await checkIfAuthorized(wallet.userId);

  try {
    await prisma.wallet.delete({
      where: {
        id: wallet.id,
      },
    });

    revalidatePath('/wallets');
    return {
      success: true,
      message: 'Wallet deleted successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while deleting the wallet',
    };
  }
}
