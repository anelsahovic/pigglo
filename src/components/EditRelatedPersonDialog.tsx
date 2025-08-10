'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import SubmitButton from './SubmitButton';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import {
  EditRelatedPersonSchema,
  EditRelatedPersonType,
} from '@/lib/zodSchemas/relatedPerson.schemas';
import { updateRelatedPerson } from '@/actions/relatedPerson.actions';
import { USER_ICONS } from '@/lib/constants/userIcons';
import Image from 'next/image';
import { RelatedPerson } from '@prisma/client';
import { MdEdit } from 'react-icons/md';

interface Props {
  relatedPerson: RelatedPerson;
}

export default function EditRelatedPersonDialog({ relatedPerson }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditRelatedPersonType>({
    resolver: zodResolver(EditRelatedPersonSchema),
    defaultValues: {
      name: relatedPerson.name,
      icon: relatedPerson.icon,
    },
  });

  async function onSubmit(values: EditRelatedPersonType) {
    setIsSubmitting(true);

    const result = await updateRelatedPerson(values, relatedPerson.id);

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
        <Button variant="outline">
          <MdEdit />
          <span className="hidden sm:flex">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Related Person</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input required placeholder="John Doe" {...field} />
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
                    value={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger className="h-[70px] min-h-[70px] p-4">
                        <div className="flex items-center gap-3">
                          {field.value ? (
                            <Image
                              src={USER_ICONS[field.value]}
                              alt="Selected icon"
                              width={60}
                              height={60}
                              className="rounded object-contain"
                            />
                          ) : (
                            <span className="text-muted-foreground text-lg">
                              Select
                            </span>
                          )}
                        </div>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.entries(USER_ICONS).map(([key, Icon]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center justify-center">
                            <Image
                              src={Icon}
                              alt={Icon}
                              width={60}
                              height={60}
                              className="rounded object-contain"
                            />
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
