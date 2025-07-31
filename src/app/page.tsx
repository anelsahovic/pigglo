import { buttonVariants } from '@/components/ui/button';
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();
  const hasSession = await isAuthenticated();

  if (hasSession) {
    redirect('/dashboard');
  }

  return (
    <div className="">
      Landing Page
      {!user ? (
        <div>
          <LoginLink className={buttonVariants()}>Login</LoginLink>
          <RegisterLink className={buttonVariants({ variant: 'secondary' })}>
            Sign up
          </RegisterLink>
        </div>
      ) : (
        <>
          <LogoutLink className={buttonVariants({ variant: 'destructive' })}>
            Log out
          </LogoutLink>
        </>
      )}
    </div>
  );
}
