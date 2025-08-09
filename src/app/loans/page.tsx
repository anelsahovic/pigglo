import { MdQueryStats } from 'react-icons/md';
import { getUserLoans } from '@/lib/queries/loans';
import TransactionCard from '@/components/TransactionCard';
import { LoanTransaction } from '@/types';
import { getAuthenticatedUser } from '@/lib/queries/auth';
import { getDbUserById } from '@/lib/queries/users';
import {
  getTotalLoanAmountInMainCurrency,
  transformWalletForClient,
} from '@/lib/utils';
import { currencySymbols } from '@/lib/constants/currencySymbols';
import { getUsersRelatedPersons } from '@/lib/queries/relatedPerson';
import AddNewLoanDialog from '@/components/AddNewLoanDialog';
import { getUserWallets } from '@/lib/queries/wallets';
import AllLoansDialog from '@/components/AllLoansDialog';
import AllRelatedPersonsDialog from '@/components/AllRelatedPersonsDialog';
import RelatedPersonCard from '@/components/RelatedPersonCard';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import AddNewRelatedPersonDialog from '@/components/AddNewRelatedPersonDialog';

export default async function LoansPage() {
  const authUser = await getAuthenticatedUser();
  const dbUser = await getDbUserById(authUser.id);
  const userMainCurrency = dbUser?.currency || 'EUR';
  const loans = await getUserLoans();

  const relatedPersons = await getUsersRelatedPersons();

  const wallets = await getUserWallets(authUser.id);
  const walletsDataForClient = wallets.map((wallet) =>
    transformWalletForClient(wallet)
  );

  // extract loan transactions
  const loanTransactions: LoanTransaction[] = loans.flatMap((loan) =>
    loan.transactions.map((tx) => ({
      ...tx,
      loan: tx.loan,
    }))
  );

  // filter loan transactions - the ones user loaned to someone
  const lentTransactions = loanTransactions.filter(
    (tx) => tx.loan?.direction === 'TO_SOMEONE'
  );
  // filter loan transactions - the ones user borrowed from someone
  const borrowedTransactions = loanTransactions.filter(
    (tx) => tx.loan?.direction === 'FROM_SOMEONE'
  );

  // calculate total lent amount, converted to users main currency
  const totalLentAmount = await getTotalLoanAmountInMainCurrency(
    lentTransactions,
    userMainCurrency
  );

  // calculate total borrowed amount, converted to users main currency
  const totalBorrowedAmount = await getTotalLoanAmountInMainCurrency(
    borrowedTransactions,
    userMainCurrency
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Loans Insight */}
      <div className="flex items-center gap-3 mb-6">
        <MdQueryStats className="text-4xl text-primary" />
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Loans Insight
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-md">
            You currently have <strong>{loanTransactions.length}</strong> active
            loan
            {loanTransactions.length !== 1 ? 's' : ''} tracked in your account.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Lent Money  */}
        <div className="p-5 rounded-xl border border-amber-200 bg-gradient-to-br from-orange-50 to-amber-100 shadow-sm hover:shadow-md transition-all">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 text-amber-700">
            <div className="p-2 rounded-full bg-amber-100">
              <ArrowUpRight className="size-5" />
            </div>
            <div>
              <h5 className="text-base font-semibold">Money Lent</h5>
              <p className="text-xs text-amber-600">
                Total money you’ve given to others
              </p>
            </div>
          </div>

          {/* Stats: Balance & Transactions  */}
          <div className="flex border-t border-amber-200 pt-3 text-amber-700">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-sm font-medium">Balance</span>
              <span className="text-lg font-bold text-amber-800">
                {Number(totalLentAmount).toFixed(2)}{' '}
                {currencySymbols[userMainCurrency]}
              </span>
            </div>

            <div className="border-l border-amber-200 mx-4"></div>

            <div className="flex-1 flex flex-col items-center">
              <span className="text-sm font-medium">Transactions</span>
              <span className="text-lg font-bold text-amber-800">
                {lentTransactions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Borrowed Money  */}
        <div className="p-5 rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 shadow-sm hover:shadow-md transition-all">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 text-green-700">
            <div className="p-2 rounded-full bg-green-100">
              <ArrowDownLeft className="size-5" />
            </div>
            <div>
              <h5 className="text-base font-semibold">Money Borrowed</h5>
              <p className="text-xs text-green-600">
                Total money you’ve taken from others
              </p>
            </div>
          </div>

          {/* Stats: Balance & Transactions  */}
          <div className="flex border-t border-green-200 pt-3 text-green-700">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-sm font-medium">Balance</span>
              <span className="text-lg font-bold text-green-800">
                {Number(totalBorrowedAmount).toFixed(2)}{' '}
                {currencySymbols[userMainCurrency]}
              </span>
            </div>

            <div className="border-l border-green-200 mx-4"></div>

            <div className="flex-1 flex flex-col items-center">
              <span className="text-sm font-medium">Transactions</span>
              <span className="text-lg font-bold text-green-800">
                {borrowedTransactions.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex w-full max-w-xl mx-auto gap-4">
        <AddNewLoanDialog
          loanType="lend"
          wallets={walletsDataForClient}
          relatedPersons={relatedPersons}
        />

        <AddNewLoanDialog
          loanType="borrow"
          wallets={walletsDataForClient}
          relatedPersons={relatedPersons}
        />
      </div>

      {/* Related Persons */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium">Related People</h4>
          <AllRelatedPersonsDialog
            persons={relatedPersons}
            userMainCurrency={userMainCurrency}
          />
        </div>

        {/* avatars */}
        <div className="flex gap-4 overflow-hidden">
          <AddNewRelatedPersonDialog />
          {relatedPersons.map((person, index) => (
            <RelatedPersonCard
              key={person.id}
              person={person}
              index={index}
              userMainCurrency={userMainCurrency}
            />
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium">Recent Transactions</h4>
          <AllLoansDialog loans={loanTransactions} />
        </div>

        <div className="flex flex-col gap-2">
          {loanTransactions.map((transaction, index) => (
            <TransactionCard key={index} transaction={transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}
