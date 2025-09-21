import { prisma } from '@/lib/prisma';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import MobileNavbar from './MobileNavbar';
import { AppSidebar } from './AppSidebar';
import { getUsersRelatedPersons } from '@/lib/queries/relatedPerson';
import { getUserWallets } from '@/lib/queries/wallets';
import { transformWalletForClient } from '@/lib/utils';

export default async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  if (!dbUser) {
    return;
  }

  const relatedPersons = await getUsersRelatedPersons();
  const wallets = await getUserWallets(dbUser.id);
  const walletsDataForClient = wallets.map((wallet) =>
    transformWalletForClient(wallet)
  );

  return (
    <>
      <MobileNavbar
        user={dbUser}
        relatedPersons={relatedPersons}
        wallets={walletsDataForClient}
      />
      <AppSidebar
        user={dbUser}
        relatedPersons={relatedPersons}
        wallets={walletsDataForClient}
      />
    </>
  );
}
