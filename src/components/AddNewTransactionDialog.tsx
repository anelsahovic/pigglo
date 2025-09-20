'use client';

import { ReactNode, useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { FaPlus } from 'react-icons/fa';
import { WalletClient } from '@/types';
import { LoanDirection, RelatedPerson, TransactionType } from '@prisma/client';
import { Checkbox } from './ui/checkbox';
import RegularTransactionForm from './RegularTransactionForm';
import LoanTransactionForm from './LoanTransactionForm';

type Props = {
  wallets: WalletClient[];
  relatedPersons: RelatedPerson[];
  defaultWalletId?: string;
  defaultTransactionType?: TransactionType;
  defaultDirection?: LoanDirection;
  quickAction?: boolean;
  quickActionLabel?: 'Income' | 'Expense' | 'Transaction';
  quickActionIcon?: ReactNode;
};

export default function AddNewTransactionDialog({
  wallets,
  relatedPersons,
  defaultWalletId,
  defaultTransactionType,
  defaultDirection,
  quickAction,
  quickActionLabel,
  quickActionIcon,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isLoan, setIsLoan] = useState(false);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {quickAction ? (
          <button className="flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            {/* <GiReceiveMoney className="size-7" /> */}
            {quickActionIcon}
            <span>{quickActionLabel} </span>
          </button>
        ) : (
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <FaPlus />

            <span className="hidden sm:flex">Add New Transaction</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {isLoan ? 'Loan' : 'Transaction'}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isLoan}
            onCheckedChange={(checked) => setIsLoan(checked === true)}
          />
          <label className="text-sm">Is this a loan?</label>
        </div>

        {isLoan ? (
          <LoanTransactionForm
            wallets={wallets}
            relatedPersons={relatedPersons}
            defaultWalletId={defaultWalletId}
            defaultDirection={defaultDirection}
            handleCloseDialog={handleCloseDialog}
          />
        ) : (
          <RegularTransactionForm
            wallets={wallets}
            defaultWalletId={defaultWalletId}
            defaultTransactionType={defaultTransactionType}
            handleCloseDialog={handleCloseDialog}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
