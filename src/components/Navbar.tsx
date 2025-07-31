import { prisma } from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import MobileNavbar from './MobileNavbar';
import DesktopNavbar from './DesktopNavbar';

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  return (
    <>
      <MobileNavbar user={dbUser} />
      <DesktopNavbar user={dbUser} />
    </>
  );
}
