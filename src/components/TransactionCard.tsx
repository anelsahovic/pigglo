import { Transaction } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { getWalletById } from '@/lib/queries/wallets';
import { FaDownLong, FaUpLong } from 'react-icons/fa6';
import { formatDistanceToNowStrict } from 'date-fns';
import { currencySymbols } from '@/lib/currencySymbols';
import { formatCurrency } from '@/lib/utils';

type Props = {
  transaction: Transaction;
};

export default async function TransactionCard({ transaction }: Props) {
  const wallet = await getWalletById(transaction.walletId);
  if (!wallet) return;

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
          <div className={`flex items-center gap-2 font-semibold ${iconClass}`}>
            <p>{sign}</p>
            <p className="flex items-end gap-1">
              <span>
                {formatCurrency(Number(transaction.amount), wallet?.currency)}
              </span>
              <span className="text-sm">
                {currencySymbols[wallet?.currency]}
              </span>
            </p>
          </div>
        </button>
      </DialogTrigger>

      {/* Dialog content */}
      <DialogContent className="max-w-md w-[95%]">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            {isIncome ? (
              <FaDownLong className="text-green-500" />
            ) : (
              <FaUpLong className="text-rose-500" />
            )}
            {transaction.title || transaction.type}
          </DialogTitle>
          {transaction.description && (
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {transaction.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className={`${iconClass} font-medium`}>
              {sign}
              {formatCurrency(Number(transaction.amount), wallet?.currency)}
              {currencySymbols[wallet?.currency]}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{new Date(transaction.createdAt).toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Wallet</span>
            <span className="font-medium">{wallet?.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Currency</span>
            <span>{wallet?.currency}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
