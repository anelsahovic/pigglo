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
  EditTransactionMetadataSchema,
  EditTransactionMetadataType,
} from '@/lib/zodSchemas/transaction.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updateTransactionMetadata } from '@/actions/transaction.actions';
import { Input } from './ui/input';
import SubmitButton from './SubmitButton';
import { Textarea } from './ui/textarea';
import { Pencil } from 'lucide-react';

type Props = {
  transaction: { title: string; description?: string; id: string };
};

export default function EditTransactionMetadataDialog({ transaction }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditTransactionMetadataType>({
    resolver: zodResolver(EditTransactionMetadataSchema),
    defaultValues: {
      title: transaction.title || '',
      description: transaction.description || '',
    },
  });

  async function onSubmit(values: EditTransactionMetadataType) {
    setIsSubmitting(true);

    const result = await updateTransactionMetadata(values, transaction.id);

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
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
