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
  EditTransactionWalletSchema,
  EditTransactionWalletType,
} from '@/lib/zodSchemas/transaction.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateTransactionWallet } from '@/actions/transaction.actions';
import SubmitButton from './SubmitButton';
import { Pencil } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { WalletClient } from '@/types';
import { walletIconMap } from '@/lib/ walletIcons';

type Props = {
  transaction: { walletId: string; id: string };
  wallets: WalletClient[];
};

export default function EditTransactionWalletDialog({
  transaction,
  wallets,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditTransactionWalletType>({
    resolver: zodResolver(EditTransactionWalletSchema),
    defaultValues: {
      walletId: transaction.walletId,
    },
  });

  async function onSubmit(values: EditTransactionWalletType) {
    setIsSubmitting(true);

    const result = await updateTransactionWallet(values, transaction.id);

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
          <DialogTitle>Edit Transaction Wallet</DialogTitle>
          <DialogDescription>
            Changing these fields will update the transaction and reflect the
            changes in both wallets balances
          </DialogDescription>
        </DialogHeader>

        {/* edit dialog form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet</FormLabel>
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
      </DialogContent>
    </Dialog>
  );
}
