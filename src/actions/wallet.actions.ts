'use server';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/queries/auth';
import {
  AddNewWalletSchema,
  AddNewWalletType,
} from '@/lib/zodSchemas/wallet.schemas';
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
