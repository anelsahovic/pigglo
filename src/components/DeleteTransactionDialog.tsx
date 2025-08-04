'use client';

import { useState } from 'react';
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
import { Button } from './ui/button';
import { deleteTransaction } from '@/actions/transaction.actions';
import { toast } from 'sonner';

type Props = {
  transactionId: string;
};

export default function DeleteTransactionDialog({ transactionId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDelete(id: string) {
    setIsSubmitting(true);

    const result = await deleteTransaction(id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            transaction and update your wallet balance accordingly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={() => handleDelete(transactionId)}
          >
            {isSubmitting ? 'Please wait...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
