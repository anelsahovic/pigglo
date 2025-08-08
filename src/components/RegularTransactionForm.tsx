'use client';

import { createTransaction } from '@/actions/transaction.actions';
import {
  AddNewTransactionSchema,
  AddNewTransactionType,
} from '@/lib/zodSchemas/transaction.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionType } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import SubmitButton from './SubmitButton';
import { walletIconMap } from '@/lib/constants/ walletIcons';
import { WalletClient } from '@/types';

type Props = {
  wallets: WalletClient[];
  defaultWalletId?: string;
  defaultTransactionType?: TransactionType;

  handleCloseDialog: () => void;
};

export default function RegularTransactionForm({
  wallets,
  defaultTransactionType,
  defaultWalletId,
  handleCloseDialog,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // transaction form without loan
  const transactionForm = useForm<AddNewTransactionType>({
    resolver: zodResolver(AddNewTransactionSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      type: defaultTransactionType ? defaultTransactionType : 'INCOME',
      walletId: defaultWalletId ? defaultWalletId : '',
    },
  });

  // transaction without loan submit function
  async function transactionOnSubmit(values: AddNewTransactionType) {
    setIsSubmitting(true);

    const result = await createTransaction(values);

    if (result.success) {
      toast.success(result.message);
      transactionForm.reset();
      handleCloseDialog();
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  }
  return (
    <Form {...transactionForm}>
      <form
        onSubmit={transactionForm.handleSubmit(transactionOnSubmit)}
        className="space-y-8"
      >
        <FormField
          control={transactionForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input required placeholder="Rent" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={transactionForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Paying monthly rent" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={transactionForm.control}
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

          <FormField
            control={transactionForm.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input required type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={transactionForm.control}
          name="walletId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                required
                disabled={!!defaultWalletId}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center gap-2">
                        {walletIconMap[wallet.icon]}
                        <span>{wallet.name}</span>
                      </div>
                    </SelectItem>
                  ))}
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
  );
}
