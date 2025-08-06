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
import { useForm } from 'react-hook-form';
import {
  EditWalletSchema,
  EditWalletType,
} from '@/lib/zodSchemas/wallet.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { updateWallet } from '@/actions/wallet.actions';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { MdEdit } from 'react-icons/md';
import { WalletClient } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { walletIconMap } from '@/lib/constants/ walletIcons';
import SubmitButton from './SubmitButton';

type Props = {
  wallet: WalletClient;
};

export default function EditWalletDialog({ wallet }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditWalletType>({
    resolver: zodResolver(EditWalletSchema),
    defaultValues: {
      name: wallet.name,
      balance: Number(wallet.balance),
      currency: wallet.currency,
      icon: wallet.icon,
    },
  });

  async function onSubmit(values: EditWalletType) {
    setIsSubmitting(true);

    const result = await updateWallet(values, wallet.id);

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
        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
          className="flex items-center justify-start gap-2 w-full h-full"
        >
          <MdEdit />
          <span>Edit Wallet</span>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input required placeholder="Personal Wallet" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance</FormLabel>
                  <span className="text-xs italic text-neutral-500">
                    *Modifying the balance manually will ignore the transactions
                    until now.
                  </span>
                  <FormControl>
                    <Input required type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
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
                      {Object.entries(walletIconMap).map(([key, Icon]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {Icon}
                            <span>
                              {key.charAt(0) + key.slice(1).toLowerCase()}
                            </span>
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
