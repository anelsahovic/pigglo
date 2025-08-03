'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { WalletClient } from '@/types';
import { Button } from './ui/button';
import { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { deleteWallet } from '@/actions/wallet.actions';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  wallet: WalletClient;
};

export default function DeleteWalletDialog({ wallet }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteWallet = async (walletId: string) => {
    setIsSubmitting(true);

    const result = await deleteWallet(walletId);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
      redirect('/wallets');
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
          className="flex items-center justify-start gap-2 w-full h-full"
        >
          <FaTrashAlt />

          <span>Delete Wallet</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            {wallet.name} and its transactions from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDeleteWallet(wallet.id)}
            disabled={isSubmitting}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
