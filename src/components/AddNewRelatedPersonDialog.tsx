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
import { FaPlus } from 'react-icons/fa';
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

export default function AddNewRelatedPersonDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddNewRelatedPersonType>({
    resolver: zodResolver(AddNewRelatedPersonSchema),
    defaultValues: {
      name: '',
      iconUrl: '/images/user_icons/user_icon1.png',
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
        <div className="flex flex-col items-center gap-1 cursor-pointer ">
          <Avatar className="size-14 shadow">
            <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
              <FaPlus />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground">New</span>
        </div>
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
              name="iconUrl"
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
                              src={field.value}
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
                      {USER_ICONS.map((url, index) => (
                        <SelectItem key={index} value={url}>
                          <div className="flex items-center justify-center">
                            <Image
                              src={url}
                              alt={`User icon ${index}`}
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
