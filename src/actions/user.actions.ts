'use server';

import { prisma } from '@/lib/prisma';
import {
  updateCurrencySchema,
  UpdateCurrencyType,
} from '@/lib/zodSchemas/user.schemas';
import { revalidatePath } from 'next/cache';

export async function updateUserCurrency(
  data: UpdateCurrencyType,
  userId: string
) {
  const result = updateCurrencySchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'An error occurred while updating currency',
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currency: result.data.currency,
      },
    });
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
  } finally {
    revalidatePath('/wallets');
  }
}
