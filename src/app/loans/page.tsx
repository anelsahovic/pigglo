import { MdQueryStats } from 'react-icons/md';
import { RiArrowDownCircleLine, RiArrowUpCircleLine } from 'react-icons/ri';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { USER_ICONS } from '@/lib/constants/userIcons';
import { getUsersRelatedPersons } from '@/lib/queries/relatedPerson';
import AddNewLoanDialog from '@/components/AddNewLoanDialog';
import { getUserWallets } from '@/lib/queries/wallets';

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
      <div className="flex items-start gap-2">
        <MdQueryStats className="text-3xl mt-2" />
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-1 text-3xl font-semibold">
            Loans Insight
          </h1>
          <p className="text-sm pl-1 text-muted-foreground">
            Currently you have <strong>{loanTransactions.length}</strong> loan
            {loanTransactions.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Loan Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
        {/* Lent Money */}
        <div className="flex flex-col justify-between rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-3 text-green-700">
            <RiArrowUpCircleLine className="text-3xl" />
            <div className="flex flex-col">
              <h5 className="text-base font-semibold">Lent Money</h5>
              <p className="text-sm text-emerald-600">Money you gave someone</p>
            </div>
          </div>
          <p className="flex items-center gap-1 text-xl font-bold text-green-800 mt-4 ml-auto">
            <span>{Number(totalLentAmount).toFixed(2)}</span>
            <span>{currencySymbols[userMainCurrency]}</span>
          </p>
        </div>

        {/* Borrowed Money */}
        <div className="flex flex-col justify-between rounded-2xl border border-orange-200 bg-gradient-to-br from-amber-50 to-orange-100 p-5 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-3 text-orange-700">
            <RiArrowDownCircleLine className="text-3xl" />
            <div className="flex flex-col">
              <h5 className="text-base font-semibold">Borrowed Money</h5>
              <p className="text-sm text-amber-600">
                Money you took from someone
              </p>
            </div>
          </div>
          <p className=" flex items-center gap-1 text-xl font-bold text-orange-800 mt-4 ml-auto">
            <span>{Number(totalBorrowedAmount).toFixed(2)}</span>
            <span>{currencySymbols[userMainCurrency]}</span>
          </p>
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

      {/* Related People */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium">Related People</h4>
          <Button variant="link" className="text-sm">
            See all
          </Button>
        </div>

        {/* avatars */}
        <div className="flex gap-4 overflow-hidden">
          {relatedPersons.map((person, index) => (
            <div
              key={person.id}
              className="flex flex-col justify-center items-center gap-1"
            >
              <Avatar className="size-14 shadow">
                <AvatarImage src={USER_ICONS[index % USER_ICONS.length]} />
                <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
                  CN
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{person.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-medium">Recent Transactions</h4>
          <Button variant="link" className="text-sm">
            See all
          </Button>
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
