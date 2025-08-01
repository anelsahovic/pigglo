import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function getAuthenticatedUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) throw new Error('Unauthorized');
  return user;
}
