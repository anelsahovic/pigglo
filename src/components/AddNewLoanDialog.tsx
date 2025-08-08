'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { WalletClient } from '@/types';
import { RelatedPerson } from '@prisma/client';
import LoanTransactionForm from './LoanTransactionForm';
import { BsArrowDownLeftCircle, BsArrowUpRightCircle } from 'react-icons/bs';

type Props = {
  wallets: WalletClient[];
  relatedPersons: RelatedPerson[];
  loanType: 'lend' | 'borrow';
};

export default function AddNewLoanDialog({
  wallets,
  relatedPersons,
  loanType,
}: Props) {
  const [open, setOpen] = useState(false);

  const defaultDirection = loanType === 'lend' ? 'TO_SOMEONE' : 'FROM_SOMEONE';

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {loanType === 'lend' ? (
          <Button className="flex items-center justify-center flex-1 min-w-[140px] gap-2 bg-gradient-to-br from-teal-700 to-emerald-500 text-white cursor-pointer p-6 sm:p-7 rounded-full shadow hover:shadow-md text-center">
            <BsArrowUpRightCircle className="size-6" />
            <span className="break-words text-sm sm:text-lg  font-medium">
              Lend Money
            </span>
          </Button>
        ) : (
          <Button className="flex items-center justify-center flex-1 min-w-[140px] gap-2 bg-gradient-to-br from-orange-700 to-amber-500 text-white cursor-pointer p-6 sm:p-7 rounded-full shadow hover:shadow-md text-center">
            <BsArrowDownLeftCircle className="size-5" />
            <span className="break-words text-sm sm:text-lg font-medium">
              Borrow Money
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {loanType === 'lend' ? 'Lend Money' : 'Borrow Money'}
          </DialogTitle>
          <DialogDescription>
            {' '}
            {loanType === 'lend'
              ? 'Give money to someone from your wallet'
              : 'Borrow money from someone as income'}
          </DialogDescription>
        </DialogHeader>

        <LoanTransactionForm
          wallets={wallets}
          relatedPersons={relatedPersons}
          defaultDirection={defaultDirection}
          handleCloseDialog={handleCloseDialog}
        />
      </DialogContent>
    </Dialog>
  );
}
