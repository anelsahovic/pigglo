import { buttonVariants } from '@/components/ui/button';
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

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
          <LogoutLink>Log out</LogoutLink>
        </>
      )}
    </div>
  );
}
