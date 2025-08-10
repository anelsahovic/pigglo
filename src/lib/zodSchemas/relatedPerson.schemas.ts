import { RelatedPersonIcons } from '@prisma/client';
import z from 'zod';

export const AddNewRelatedPersonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.enum(RelatedPersonIcons),
});

export type AddNewRelatedPersonType = z.infer<typeof AddNewRelatedPersonSchema>;

export const EditRelatedPersonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.enum(RelatedPersonIcons),
});

export type EditRelatedPersonType = z.infer<typeof EditRelatedPersonSchema>;
