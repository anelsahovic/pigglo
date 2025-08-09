import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { getUserWallets, getWalletById } from '@/lib/queries/wallets';
import { format } from 'date-fns';
import { currencySymbols } from '@/lib/constants/currencySymbols';
import { formatCurrency, transformWalletForClient } from '@/lib/utils';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import EditTransactionMetadataDialog from './EditTransactionMetadataDialog';
import EditTransactionAmountDialog from './EditTransactionAmountDialog';
import EditTransactionTypeDialog from './EditTransactionTypeDialog';
import EditTransactionWalletDialog from './EditTransactionWalletDialog';
import { getAuthenticatedUser } from '@/lib/queries/auth';
import { TransactionExtended } from '@/types';
import { Badge } from './ui/badge';
import { FaArrowDown, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';
import EditLoanPersonDialog from './EditLoanPersonDialog';
import { getUsersRelatedPersons } from '@/lib/queries/relatedPerson';

type Props = {
  transaction: TransactionExtended;
};

export default async function TransactionCard({ transaction }: Props) {
  const user = await getAuthenticatedUser();
  const wallet = await getWalletById(transaction.walletId);
  if (!wallet) return;

  const fetchedWallets = await getUserWallets(user.id);
  const clientWallets = fetchedWallets.map((wallet) =>
    transformWalletForClient(wallet)
  );

  const relatedPersons = await getUsersRelatedPersons();

  const isLoan: boolean = !!transaction.loanId;
  const isIncome = transaction.type === 'INCOME';
  const isExpense = transaction.type === 'EXPENSE';
  const iconClass = isIncome
    ? 'text-green-600'
    : isExpense
    ? 'text-red-500'
    : 'text-blue-500';
  const sign = isIncome ? '+' : isExpense ? '-' : '';

  const icon = isIncome ? (
    <FaArrowDown className="text-green-500" />
  ) : isExpense ? (
    <FaArrowUp className="text-red-500" />
  ) : (
    <FaExchangeAlt className="text-blue-500" />
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="group w-full rounded-lg bg-white shadow-sm hover:shadow-md 
                   border border-neutral-200 hover:border-neutral-300
                   p-5 flex items-center justify-between transition-all duration-200 cursor-pointer"
        >
          {/* Left Section */}
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full 
                        ${
                          isIncome
                            ? 'bg-green-50'
                            : isExpense
                            ? 'bg-red-50'
                            : 'bg-blue-50'
                        }
                        group-hover:scale-105 transition-transform`}
            >
              {icon}
            </div>

            {/* Transaction Info */}
            <div className="flex flex-col text-left">
              <h4 className="text-sm font-semibold text-neutral-800 truncate max-w-[200px]">
                {transaction.title}
              </h4>
              {transaction.description && (
                <p className="text-xs text-neutral-500 truncate max-w-[100px]">
                  {transaction.description}
                </p>
              )}
              <p className="text-[11px] text-neutral-400 mt-1">
                {format(new Date(transaction.createdAt), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end">
            <span className={`text-base font-semibold ${iconClass}`}>
              {sign}
              {Number(transaction.amount).toFixed(2)}
              <span className={`text-sm ml-1 font-semibold ${iconClass}`}>
                {currencySymbols[wallet?.currency]}
              </span>
            </span>

            {isLoan && (
              <Badge className="mt-1 text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                Loan
              </Badge>
            )}
          </div>
        </button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="max-w-xl w-[95%] rounded-2xl shadow-lg bg-white dark:bg-zinc-950">
        <DialogHeader className="flex flex-col items-start justify-start">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-primary">
            Transaction Details
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            View and update fields for this transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4 text-sm">
          {/* Title + Description */}
          <div className="border rounded-xl p-4 bg-muted/50 flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-xs text-muted-foreground">Title</span>
                <div className="font-medium">{transaction.title || '—'}</div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Description
                </span>
                <div className="line-clamp-2 text-sm">
                  {transaction.description || '—'}
                </div>
              </div>
            </div>
            <EditTransactionMetadataDialog
              transaction={{
                title: transaction.title,
                description: transaction.description || '',
                id: transaction.id,
              }}
            />
          </div>

          {/* Amount + Type */}
          <div className="flex gap-4">
            <div className="flex-1 border rounded-xl p-4 bg-muted/50 flex justify-between items-center">
              <div>
                <span className="text-xs text-muted-foreground">Amount</span>
                <div className={`${iconClass} font-medium`}>
                  {sign}
                  {formatCurrency(Number(transaction.amount), wallet?.currency)}
                </div>
              </div>
              <EditTransactionAmountDialog
                transaction={{
                  amount: Number(transaction.amount),
                  id: transaction.id,
                }}
              />
            </div>

            <div className="flex-1 border rounded-xl p-4 bg-muted/50 flex justify-between items-center">
              <div>
                <span className="text-xs text-muted-foreground">Type</span>
                <div className="capitalize">
                  {transaction.type.toLowerCase()}
                </div>
              </div>
              <EditTransactionTypeDialog
                transaction={{ type: transaction.type, id: transaction.id }}
              />
            </div>
          </div>

          {/* Wallet + Currency */}
          <div className="flex gap-4">
            <div className="flex-1 border rounded-xl p-4 bg-muted/50 flex justify-between items-center">
              <div>
                <span className="text-xs text-muted-foreground">Wallet</span>
                <div className="font-medium">{wallet?.name}</div>
              </div>
              <EditTransactionWalletDialog
                transaction={{
                  walletId: transaction.walletId,
                  id: transaction.id,
                }}
                wallets={clientWallets}
              />
            </div>

            <div className="flex-1 border rounded-xl p-4 bg-muted/30">
              <span className="text-xs text-muted-foreground">Currency</span>
              <div>{wallet?.currency}</div>
            </div>
          </div>

          {/* Loan info */}
          {isLoan && (
            <div className="flex gap-4">
              <div className="flex-1 border rounded-xl p-4 bg-muted/30">
                <span className="text-xs text-muted-foreground">Loan Type</span>
                <div>
                  {transaction?.loan?.direction === 'FROM_SOMEONE'
                    ? 'Borrowed'
                    : 'Lend'}
                </div>
              </div>

              <div className="flex-1 border rounded-xl p-4 bg-muted/30 flex justify-between items-center">
                <div>
                  <span className="text-xs text-muted-foreground">
                    Related Person
                  </span>
                  <div>{transaction?.loan?.person.name}</div>
                </div>

                <EditLoanPersonDialog
                  relatedPersons={relatedPersons}
                  transaction={{
                    id: transaction.id,
                    personId: transaction.loan?.person.id || '',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Date + Actions */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-xs text-muted-foreground">
            Created on:{' '}
            <span className="text-foreground">
              {new Date(transaction.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex gap-2 self-end">
            <DeleteTransactionDialog transactionId={transaction.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
