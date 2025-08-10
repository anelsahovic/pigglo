'use server';

import { prisma } from '@/lib/prisma';
import { checkIfAuthorized, getAuthenticatedUser } from '@/lib/queries/auth';
import {
  AddNewRelatedPersonSchema,
  AddNewRelatedPersonType,
  EditRelatedPersonSchema,
  EditRelatedPersonType,
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
        icon: result.data.icon,
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
      message: 'An error occurred while creating person',
    };
  }
}

export async function updateRelatedPerson(
  data: EditRelatedPersonType,
  personId: string
) {
  const user = await getAuthenticatedUser();

  const result = EditRelatedPersonSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      message: 'Invalid data for updating person',
    };
  }

  try {
    await prisma.relatedPerson.update({
      where: {
        id: personId,
      },
      data: {
        name: result.data.name,
        icon: result.data.icon,
        userId: user.id,
      },
    });

    revalidatePath('/wallets');
    revalidatePath('/loans');
    revalidatePath('/transactions');

    return {
      success: true,
      message: 'Person updated successfully',
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'An error occurred while updating person',
    };
  }
}

export async function deleteRelatedPerson(id: string) {
  const person = await prisma.relatedPerson.findUnique({ where: { id } });

  if (!person) {
    return {
      success: false,
      message: 'No related person found',
    };
  }

  await checkIfAuthorized(person.userId);

  try {
    await prisma.relatedPerson.delete({ where: { id } });
    revalidatePath('/transactions');
    revalidatePath('/wallets');
    revalidatePath('/loans');

    return {
      success: true,
      message: 'Related person deleted successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred while deleting related person',
    };
  }
}
