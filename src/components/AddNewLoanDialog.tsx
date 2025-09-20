'use client';

import { ReactNode, useState } from 'react';
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
import { twMerge } from 'tailwind-merge';

type Props = {
  wallets: WalletClient[];
  relatedPersons: RelatedPerson[];
  loanType: 'lend' | 'borrow';
  quickAction?: boolean;
};

export default function AddNewLoanDialog({
  wallets,
  relatedPersons,
  loanType,
  quickAction,
}: Props) {
  const [open, setOpen] = useState(false);

  const defaultDirection = loanType === 'lend' ? 'TO_SOMEONE' : 'FROM_SOMEONE';

  const icon: ReactNode =
    loanType === 'lend' ? (
      <BsArrowUpRightCircle className="size-5 sm:size-6 md:size-7" />
    ) : (
      <BsArrowDownLeftCircle className="size-5 sm:size-6 md:size-7" />
    );
  const label = loanType === 'lend' ? 'Lend Money' : 'Borrow Money';
  const buttonStyle =
    loanType === 'lend'
      ? 'from-orange-700 to-amber-500'
      : 'from-teal-700 to-emerald-500';

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {quickAction ? (
          <button className="flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            {icon}
            <span>{label} </span>
          </button>
        ) : (
          <Button
            className={twMerge(
              'flex items-center justify-center flex-1 min-w-[140px] gap-2 bg-gradient-to-br text-white cursor-pointer p-6 sm:p-7 rounded-full shadow hover:shadow-md text-center',
              buttonStyle
            )}
          >
            {icon}
            <span className="break-words text-sm sm:text-lg  font-medium">
              {label}
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
