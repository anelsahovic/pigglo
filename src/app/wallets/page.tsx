import ChangeCurrencyDialog from '@/components/ChangeCurrencyDialog';
import { Button } from '@/components/ui/button';
import WalletCard from '@/components/WalletCard';
import { currencySymbols } from '@/lib/currencySymbols';
import { getAuthenticatedUser } from '@/lib/queries/auth';
import { getDbUserById } from '@/lib/queries/users';
import { getUserWallets } from '@/lib/queries/wallets';
import { getTotalBalanceFromWallets } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { CiCircleInfo } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa';
import { IoStatsChartSharp } from 'react-icons/io5';

export default async function WalletsPage() {
  const user = await getAuthenticatedUser();
  const wallets = await getUserWallets(user.id);
  const dbUser = await getDbUserById(user.id);

  if (!dbUser) redirect('/');

  const currencySymbol = currencySymbols[dbUser?.currency];

  const totalBalance = await getTotalBalanceFromWallets(
    wallets,
    dbUser?.currency
  );

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto h-full justify-start items-stretch gap-6 p-2">
      {/* Balance Card */}
      <div className="flex flex-col justify-between gap-2 p-4 border text-muted-foreground  rounded-sm w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium">Main Currency:</h3>
            <span className="text-base font-semibold">
              {dbUser?.currency} ({currencySymbol})
            </span>
          </div>

          <ChangeCurrencyDialog />
        </div>

        <div className="flex items-center gap-3 w-full">
          <IoStatsChartSharp className="text-2xl" />
          <h3 className="text-xl font-bold">Total Balance:</h3>
          <div className="text-xl font-bold tracking-wide flex items-end gap-1">
            <span>{Number(totalBalance).toFixed(2)}</span>
            <span className="text-base">{currencySymbol}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs sm:text-sm text-neutral-500 mt-1">
          <CiCircleInfo className=" text-xl" />
          <p>
            Your overall balance across wallets, displayed in your preferred
            currency.
          </p>
        </div>
      </div>

      {/* wallets list */}
      <div className="flex flex-col gap-4">
        {/* title and add new button */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight text-center text-muted-foreground">
            Wallets List
          </h3>
          <Button variant="outline" className="flex items-center gap-2 ">
            <FaPlus />

            <span className="hidden sm:flex">Add New Wallet</span>
          </Button>
        </div>

        {/* wallets cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <WalletCard wallet={wallet} key={wallet.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
