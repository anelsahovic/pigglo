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
    <div>
      Landing Page
      {!user ? (
        <div>
          <LoginLink>Login</LoginLink>
          <RegisterLink>Sign up</RegisterLink>
        </div>
      ) : (
        <>
          <LogoutLink>Log out</LogoutLink>
        </>
      )}
    </div>
  );
}
