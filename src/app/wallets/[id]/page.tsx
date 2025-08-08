import AddNewTransactionDialog from '@/components/AddNewTransactionDialog';
import TransactionCard from '@/components/TransactionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletDropDown from '@/components/WalletDropDown';
import { walletIconMap } from '@/lib/constants/ walletIcons';
import { currencySymbols } from '@/lib/constants/currencySymbols';
import { getAuthenticatedUser } from '@/lib/queries/auth';
import { getUsersRelatedPersons } from '@/lib/queries/relatedPerson';
import {
  getAllUserTransactionsByWalletId,
  getUsersExpenseTransactionsByWalletId,
  getUsersIncomeTransactionsByWalletId,
} from '@/lib/queries/transactions';
import { getUserWallets, getWalletById } from '@/lib/queries/wallets';
import { transformWalletForClient } from '@/lib/utils';
import { TransactionExtended } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FaChevronLeft, FaMoneyBillWave } from 'react-icons/fa';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import { LuClock3 } from 'react-icons/lu';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ShowWalletPage({ params }: Props) {
  const { id } = await params;

  const wallet = await getWalletById(id);

  if (!wallet) redirect('wallets');

  const user = await getAuthenticatedUser();
  const wallets = await getUserWallets(user.id);
  const allWalletsClientSide = wallets.map((wallet) =>
    transformWalletForClient(wallet)
  );

  const walletClientSide = transformWalletForClient(wallet);

  const allTransactions: TransactionExtended[] =
    await getAllUserTransactionsByWalletId(wallet.id);
  const incomeTransactions: TransactionExtended[] =
    await getUsersIncomeTransactionsByWalletId(wallet.id);
  const expenseTransactions: TransactionExtended[] =
    await getUsersExpenseTransactionsByWalletId(wallet.id);

  const relatedPersons = await getUsersRelatedPersons();

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div
        style={{
          backgroundImage: "url('/images/woods_asset.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="absolute top-0 -translate-y-4 sm:translate-y-0 w-screen md:w-full h-[280px]  text-white flex flex-col z-10 p-4"
      >
        {/* App Header (Top Nav) */}
        <div className="flex justify-between items-center w-full px-4 pt-6">
          <Link href="/wallets" className="text-xl">
            <FaChevronLeft />
          </Link>

          <h2 className="text-xl font-medium tracking-wide flex items-center gap-1 truncate max-w-[60%] text-center">
            {walletIconMap[wallet.icon]}
            {wallet.name}
          </h2>

          <WalletDropDown wallet={walletClientSide} />
        </div>

        {/* Wallet Info Section */}
        <div className="flex flex-col items-center justify-center flex-1 relative mb-10">
          <div className="text-6xl mb-1 flex items-baseline gap-2 font-semibold">
            <span>{wallet.balance.toLocaleString()}</span>
            <span className="text-2xl font-bold">
              {currencySymbols[wallet.currency]}
            </span>
          </div>
          <p className="text-white/80 text-sm tracking-wide">Total balance</p>
        </div>

        {/* Floating Card - Wallet Summary */}
        <div className="absolute h-[100px] sm:h-[110px] md:h-[120px] w-[90%] bottom-0 translate-y-14 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-xl shadow-md rounded-lg border border-white/30 text-foreground p-4 flex justify-around items-center gap-4">
          {/* Last Updated */}
          <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-20 sm:w-24">
            <LuClock3 className="text-xl sm:text-2xl opacity-80" />
            <span className="text-sm font-medium text-center hidden sm:block">
              Last modified
            </span>
            <p className="text-sm sm:text-base font-medium text-center truncate">
              {formatDistanceToNow(new Date(wallet.updatedAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          {/* Transactions Count */}
          <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-20 sm:w-24">
            <FaArrowRightArrowLeft className="text-xl sm:text-2xl opacity-80" />
            <span className="text-sm font-medium hidden sm:block">
              Transactions
            </span>
            <p className="text-sm sm:text-base font-medium">
              {wallet.transactions.length}
            </p>
          </div>

          {/* Currency */}
          <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-20 sm:w-24">
            <FaMoneyBillWave className="text-xl sm:text-2xl opacity-80 " />
            <span className="text-sm font-medium hidden sm:block">
              Currency
            </span>
            <p className="text-sm sm:text-base font-medium">
              {wallet.currency}
            </p>
          </div>
        </div>
      </div>

      {/* bottom section - transactions */}

      <div className="mt-[350px] w-full p-4 flex flex-col gap-2">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl font-semibold mb-4">Transactions List</h2>
          <AddNewTransactionDialog
            wallets={allWalletsClientSide}
            relatedPersons={relatedPersons}
            defaultWalletId={id}
          />
        </div>
        <div className="w-full flex flex-col  items-center">
          <Tabs defaultValue="all" className="w-full ">
            <TabsList className="w-full max-w-sm rounded-full">
              <TabsTrigger className="rounded-full" value="all">
                All
              </TabsTrigger>
              <TabsTrigger className="rounded-full" value="income">
                Income
              </TabsTrigger>
              <TabsTrigger className="rounded-full" value="expense">
                Expense
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {wallet.transactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
              ) : (
                <div className="space-y-2">
                  {allTransactions.map((tx) => (
                    <TransactionCard key={tx.id} transaction={tx} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="income">
              {incomeTransactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
              ) : (
                <div className="space-y-2">
                  {incomeTransactions.map((tx) => (
                    <TransactionCard key={tx.id} transaction={tx} />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="expense">
              {expenseTransactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet.</p>
              ) : (
                <div className="space-y-2">
                  {expenseTransactions.map((tx) => (
                    <TransactionCard key={tx.id} transaction={tx} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// <div className="p-6 space-y-8 max-w-4xl mx-auto">
//       {/* Wallet Header */}
//       <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-md border">
//         <div className="flex items-center space-x-4">
//           <div className="text-3xl text-primary">
//             {walletIconMap[wallet.icon]}
//           </div>
//           <div>
//             <h1 className="text-2xl font-semibold">{wallet.name}</h1>
//             <p className="text-gray-500 text-sm">{wallet.currency}</p>
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-lg font-semibold">
//             {formatCurrency(wallet.balance, wallet.currency)}
//           </p>
//           <p className="text-gray-400 text-sm">
//             Updated {new Date(wallet.updatedAt).toLocaleDateString()}
//           </p>
//         </div>
//       </div>

//     </div>
