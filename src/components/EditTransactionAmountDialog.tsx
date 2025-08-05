'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import {
  EditTransactionAmountSchema,
  EditTransactionAmountType,
} from '@/lib/zodSchemas/transaction.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateTransactionAmount } from '@/actions/transaction.actions';
import { Input } from './ui/input';
import SubmitButton from './SubmitButton';
import { Pencil } from 'lucide-react';

type Props = {
  transaction: { amount: number; id: string };
};

export default function EditTransactionAmountDialog({ transaction }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditTransactionAmountType>({
    resolver: zodResolver(EditTransactionAmountSchema),
    defaultValues: {
      amount: transaction.amount,
    },
  });

  async function onSubmit(values: EditTransactionAmountType) {
    setIsSubmitting(true);

    const result = await updateTransactionAmount(values, transaction.id);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction Amount</DialogTitle>
          <DialogDescription>
            Changing the data in these fields will update the transaction amount
            and update the wallet balance accordingly
          </DialogDescription>
        </DialogHeader>

        {/* edit dialog form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      required
                      placeholder="Rent"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <SubmitButton pending={isSubmitting} />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
