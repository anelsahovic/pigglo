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
  EditTransactionTypeSchema,
  EditTransactionTypeType,
} from '@/lib/zodSchemas/transaction.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateTransactionType } from '@/actions/transaction.actions';
import SubmitButton from './SubmitButton';
import { Pencil } from 'lucide-react';
import { TransactionType } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type Props = {
  transaction: { type: TransactionType; id: string };
};

export default function EditTransactionTypeDialog({ transaction }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditTransactionTypeType>({
    resolver: zodResolver(EditTransactionTypeSchema),
    defaultValues: {
      type: transaction.type,
    },
  });

  async function onSubmit(values: EditTransactionTypeType) {
    setIsSubmitting(true);

    const result = await updateTransactionType(values, transaction.id);

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
          <DialogTitle>Edit Wallet</DialogTitle>
          <DialogDescription>
            Changing the data in these fields will update the wallet data in
            database
          </DialogDescription>
        </DialogHeader>

        {/* edit dialog form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>

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
