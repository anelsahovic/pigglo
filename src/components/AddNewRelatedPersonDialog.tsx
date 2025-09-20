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
import { FaPlus, FaUserPlus } from 'react-icons/fa';
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
  AddNewRelatedPersonSchema,
  AddNewRelatedPersonType,
} from '@/lib/zodSchemas/relatedPerson.schemas';
import { createRelatedPerson } from '@/actions/relatedPerson.actions';
import { USER_ICONS } from '@/lib/constants/userIcons';
import Image from 'next/image';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Props {
  quickAction?: boolean;
}

export default function AddNewRelatedPersonDialog({ quickAction }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddNewRelatedPersonType>({
    resolver: zodResolver(AddNewRelatedPersonSchema),
    defaultValues: {
      name: '',
      icon: 'USER_ICON1',
    },
  });

  async function onSubmit(values: AddNewRelatedPersonType) {
    setIsSubmitting(true);

    const result = await createRelatedPerson(values);

    if (result.success) {
      toast.success(result.message);
      form.reset();
      setOpen(false);
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {quickAction ? (
          <div className="flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <FaUserPlus className="size-7" />
            <span>Person </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 cursor-pointer ">
            <Avatar className="size-14 shadow">
              <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
                <FaPlus />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">New</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Related Person</DialogTitle>
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
