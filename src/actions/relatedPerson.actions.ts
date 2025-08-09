'use server';

import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/queries/auth';
import {
  AddNewRelatedPersonSchema,
  AddNewRelatedPersonType,
} from '@/lib/zodSchemas/relatedPerson.schemas';
import { revalidatePath } from 'next/cache';

export async function createRelatedPerson(data: AddNewRelatedPersonType) {
  const user = await getAuthenticatedUser();

  const result = AddNewRelatedPersonSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data for creating person',
    };
  }

  try {
    await prisma.relatedPerson.create({
      data: {
        name: result.data.name,
        iconUrl: result.data.iconUrl,
        userId: user.id,
      },
    });

    revalidatePath('/wallets');
    revalidatePath('/loans');
    revalidatePath('/transactions');

    return {
      success: true,
      message: 'Person created successfully',
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'An error occurred while updating currency',
    };
  }
}
