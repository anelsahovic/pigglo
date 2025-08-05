import { Transaction } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { getUserWallets, getWalletById } from '@/lib/queries/wallets';
import { FaDownLong, FaUpLong } from 'react-icons/fa6';
import { formatDistanceToNowStrict } from 'date-fns';
import { currencySymbols } from '@/lib/currencySymbols';
import { formatCurrency, transformWalletForClient } from '@/lib/utils';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import EditTransactionMetadataDialog from './EditTransactionMetadataDialog';
import EditTransactionAmountDialog from './EditTransactionAmountDialog';
import EditTransactionTypeDialog from './EditTransactionTypeDialog';
import EditTransactionWalletDialog from './EditTransactionWalletDialog';
import { getAuthenticatedUser } from '@/lib/queries/auth';

type Props = {
  transaction: Transaction;
};

export default async function TransactionCard({ transaction }: Props) {
  const user = await getAuthenticatedUser();
  const wallet = await getWalletById(transaction.walletId);
  if (!wallet) return;

  const fetchedWallets = await getUserWallets(user.id);
  const clientWallets = fetchedWallets.map((wallet) =>
    transformWalletForClient(wallet)
  );

  const isIncome = transaction.type === 'INCOME';
  const iconClass = isIncome ? 'text-green-500' : 'text-rose-500';
  const sign = isIncome ? '+' : '-';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full cursor-pointer hover:border-primary transition-colors p-4 border-b flex items-center justify-between text-left ">
          {/* Left: Icon + Meta */}
          <div className="flex items-center gap-4">
            {isIncome ? (
              <FaDownLong className={`text-xl ${iconClass}`} />
            ) : (
              <FaUpLong className={`text-xl ${iconClass}`} />
            )}
            <div className="flex flex-col">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNowStrict(transaction.createdAt)} ago
              </p>
              <p className="font-medium truncate max-w-[180px]">
                {transaction.title || transaction.type}
              </p>
            </div>
          </div>

          {/* Right: Amount */}
          <div className={`flex flex-col items-end`}>
            <div
              className={`flex items-center gap-2 justify-end font-semibold ${iconClass}`}
            >
              <p>{sign}</p>
              <p className="flex items-end gap-1">
                <span>{transaction.amount.toFixed(2)}</span>
                <span className="text-sm">
                  {currencySymbols[wallet?.currency]}
                </span>
              </p>
            </div>
            <p className="text-muted-foreground text-xs italic">
              ({wallet.currency})
            </p>
          </div>
        </button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="max-w-xl w-[95%] rounded-2xl shadow-lg bg-white dark:bg-zinc-950">
        <DialogHeader>
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
