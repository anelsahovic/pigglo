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
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import SubmitButton from './SubmitButton';
import { Pencil } from 'lucide-react';
import { RelatedPerson } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  EditLoanRelatedPersonSchema,
  EditLoanRelatedPersonType,
} from '@/lib/zodSchemas/loan.schemas';
import { updateLoanRelatedPerson } from '@/actions/loan.actions';

type Props = {
  transaction: { personId: string; id: string };
  relatedPersons: RelatedPerson[];
};

export default function EditLoanPersonDialog({
  transaction,
  relatedPersons,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditLoanRelatedPersonType>({
    resolver: zodResolver(EditLoanRelatedPersonSchema),
    defaultValues: {
      personId: transaction.personId,
    },
  });

  async function onSubmit(values: EditLoanRelatedPersonType) {
    setIsSubmitting(true);

    const result = await updateLoanRelatedPerson(values, transaction.id);

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
          <DialogTitle>Change Related Person</DialogTitle>
          <DialogDescription>
            Changing the data in this field will change the person that is
            related to this loan transaction
          </DialogDescription>
        </DialogHeader>

        {/* edit dialog form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
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
