import AddNewTransactionDialog from '@/components/AddNewTransactionDialog';
import TransactionCard from '@/components/TransactionCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAuthenticatedUser } from '@/lib/queries/auth';
import {
  getAllUserTransactions,
  getUsersExpenseTransactions,
  getUsersIncomeTransactions,
} from '@/lib/queries/transactions';
import { getUserWallets } from '@/lib/queries/wallets';
import { transformWalletForClient } from '@/lib/utils';
import { Transaction } from '@prisma/client';

export default async function TransactionsPage() {
  const user = await getAuthenticatedUser();
  const wallets = await getUserWallets(user.id);
  const walletsDataForClient = wallets.map((wallet) =>
    transformWalletForClient(wallet)
  );

  const allTransactions: Transaction[] = await getAllUserTransactions();
  const incomeTransactions: Transaction[] = await getUsersIncomeTransactions();
  const expenseTransactions: Transaction[] =
    await getUsersExpenseTransactions();
  return (
    <div className="flex flex-col items-center gap-5 w-full h-full p-4">
      <h1 className="text-2xl tracking-wide font-medium text-foreground">
        Transactions
      </h1>
      {/* search */}
      <Input type="text" placeholder="Search..." className="rounded-full p-4" />

      <div className="w-full flex  items-center justify-between">
        <p className="text-foreground ">Recent transactions</p>
        <AddNewTransactionDialog wallets={walletsDataForClient} />
      </div>

      <div className="w-full flex flex-col  items-center">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-sm rounded-full bg-background">
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
          <TabsContent className="p-2" value="all">
            {allTransactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet.</p>
            ) : (
              <div className="space-y-2">
                {allTransactions.map((tx) => (
                  <TransactionCard key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent className="p-2" value="income">
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
          <TabsContent className="p-2" value="expense">
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
  );
}
