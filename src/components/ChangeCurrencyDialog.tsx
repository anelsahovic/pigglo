import { getAuthenticatedUser } from '@/lib/queries/auth';
import ChangeCurrencyForm from './ChangeCurrencyForm';
import { getDbUserById } from '@/lib/queries/users';
import { redirect } from 'next/navigation';

export default async function ChangeCurrencyDialog() {
  const user = await getAuthenticatedUser();
  const dbUser = await getDbUserById(user.id);

  if (!dbUser) redirect('/');

  return <ChangeCurrencyForm user={dbUser} />;
}
