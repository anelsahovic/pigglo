'use client';

import { LuRefreshCcw } from 'react-icons/lu';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { CiCircleInfo } from 'react-icons/ci';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useForm } from 'react-hook-form';
import {
  updateCurrencySchema,
  UpdateCurrencyType,
} from '@/lib/zodSchemas/user.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { updateUserCurrency } from '@/actions/user.actions';
import { User } from '@prisma/client';
import { toast } from 'sonner';
import { useState } from 'react';
import SubmitButton from './SubmitButton';

interface Props {
  user: User;
}

export default function ChangeUserCurrencyDialog({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateCurrencyType>({
    resolver: zodResolver(updateCurrencySchema),
    defaultValues: {
      currency: user.currency,
    },
  });

  async function onSubmit(values: UpdateCurrencyType) {
    setIsSubmitting(true);

    const result = await updateUserCurrency(values, user.id);

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
          onClick={() => setOpen(true)}
          variant="outline"
          className="flex items-center gap-2 "
        >
          <LuRefreshCcw />
          <span className="hidden sm:flex">Change Currency</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col justify-center items-center">
          <DialogTitle>Change Currency</DialogTitle>
          <DialogDescription className="flex items-center justify-center gap-2">
            <CiCircleInfo />
            <span>This is your main currency</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col justify-center items-center mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-center w-full uppercase">
                      Select the currency
                    </FormLabel>
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
                        <SelectItem value="USD">
                          American Dollar (USD)
                        </SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="BAM">Bosnian Mark (BAM)</SelectItem>
                        <SelectItem value="RSD">Serbian Dinar (RSD)</SelectItem>
                        <SelectItem value="AUD">
                          Australian Dollar (AUD)
                        </SelectItem>
                        <SelectItem value="GBP">
                          Great British Pound (GBP)
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center gap-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <SubmitButton pending={isSubmitting} />
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
