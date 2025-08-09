import z from 'zod';
import { AddNewTransactionSchema } from './transaction.schemas';

export const AddNewLoanTransactionSchema = AddNewTransactionSchema.omit({
  type: true,
}).extend({
  personId: z.string(),
  direction: z.enum(['TO_SOMEONE', 'FROM_SOMEONE']),
});

export type AddNewLoanTransactionType = z.infer<
  typeof AddNewLoanTransactionSchema
>;

export const EditLoanRelatedPersonSchema = z.object({
  personId: z.string().min(1, 'Related Person is required'),
});

export type EditLoanRelatedPersonType = z.infer<
  typeof EditLoanRelatedPersonSchema
>;
