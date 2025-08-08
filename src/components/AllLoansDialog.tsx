import { LoanTransaction } from '@/types';
import { buttonVariants } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import TransactionCard from './TransactionCard';
import clsx from 'clsx';

type Props = {
  loans: LoanTransaction[];
};

export default function AllLoansDialog({ loans }: Props) {
  return (
    <Dialog>
      <DialogTrigger
        className={clsx(buttonVariants({ variant: 'link' }), 'cursor-pointer')}
      >
        See All
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All Loan Transactions</DialogTitle>
          <DialogDescription>
            Showing all transactions where you ether lent or borrowed money
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {loans.map((loan) => (
            <TransactionCard key={loan.id} transaction={loan} />
          ))}

          <>*pagination</>
        </div>
      </DialogContent>
    </Dialog>
  );
}
