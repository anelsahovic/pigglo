'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoanDirection, RelatedPerson } from '@prisma/client';
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
import {
  AddNewLoanTransactionSchema,
  AddNewLoanTransactionType,
} from '@/lib/zodSchemas/loan.schemas';
import { createLoanTransaction } from '@/actions/loan.actions';

type Props = {
  wallets: WalletClient[];
  relatedPersons: RelatedPerson[];
  defaultDirection?: LoanDirection;
  defaultWalletId?: string;

  handleCloseDialog: () => void;
};

export default function LoanTransactionForm({
  wallets,
  relatedPersons,
  defaultWalletId,
  defaultDirection,
  handleCloseDialog,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // transaction form without loan
  const loanForm = useForm<AddNewLoanTransactionType>({
    resolver: zodResolver(AddNewLoanTransactionSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      walletId: defaultWalletId ? defaultWalletId : '',
      direction: defaultDirection ? defaultDirection : 'TO_SOMEONE',
    },
  });

  // transaction without loan submit function
  async function loanOnSubmit(values: AddNewLoanTransactionType) {
    setIsSubmitting(true);

    const result = await createLoanTransaction(values);

    if (result.success) {
      toast.success(result.message);
      loanForm.reset();
      handleCloseDialog();
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  }
  return (
    <Form {...loanForm}>
      <form
        onSubmit={loanForm.handleSubmit(loanOnSubmit)}
        className="space-y-8"
      >
        <FormField
          control={loanForm.control}
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
          control={loanForm.control}
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
            control={loanForm.control}
            name="direction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  required
                  disabled={!!defaultDirection}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TO_SOMEONE">Lend Money</SelectItem>
                    <SelectItem value="FROM_SOMEONE">Borrow Money</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loanForm.control}
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={loanForm.control}
            name="personId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Related Person</FormLabel>
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
                    {relatedPersons.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        <div className="flex items-center gap-2">
                          <span>{person.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loanForm.control}
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
        </div>

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
