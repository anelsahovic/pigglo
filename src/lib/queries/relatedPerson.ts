import { prisma } from '../prisma';
import { getAuthenticatedUser } from './auth';

export async function getUsersRelatedPersons() {
  const user = await getAuthenticatedUser();

  return prisma.relatedPerson.findMany({
    where: {
      userId: user.id,
    },
  });
}
