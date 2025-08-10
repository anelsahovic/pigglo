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
import { toast } from 'sonner';
import { FaRegTrashAlt } from 'react-icons/fa';
import { deleteRelatedPerson } from '@/actions/relatedPerson.actions';

type Props = {
  personId: string;
};

export default function DeleteRelatedPersonDialog({ personId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDelete(id: string) {
    setIsSubmitting(true);

    const result = await deleteRelatedPerson(id);

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
        <Button variant="destructive">
          <FaRegTrashAlt />
          <span className="hidden sm:flex">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            related person and all transactions and loans associated with them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={() => handleDelete(personId)}
          >
            {isSubmitting ? 'Please wait...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
