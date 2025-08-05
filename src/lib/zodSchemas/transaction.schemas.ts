import { z, ZodCoercedNumber } from 'zod';

export const AddNewTransactionSchema = z.object({
  title: z
    .string()
    .min(1, 'Transaction is required')
    .max(50, 'Max Transaction length is 50 characters'),
  description: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.coerce.number() as ZodCoercedNumber<number>,
  walletId: z.string(),
});

export type AddNewTransactionType = z.infer<typeof AddNewTransactionSchema>;

export const EditTransactionMetadataSchema = z.object({
  title: z
    .string()
    .min(1, 'Transaction is required')
    .max(50, 'Max Transaction length is 50 characters'),
  description: z.string().optional(),
});

export type EditTransactionMetadataType = z.infer<
  typeof EditTransactionMetadataSchema
>;

export const EditTransactionAmountSchema = z.object({
  amount: z.coerce.number() as ZodCoercedNumber<number>,
});

export type EditTransactionAmountType = z.infer<
  typeof EditTransactionAmountSchema
>;

export const EditTransactionTypeSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
});

export type EditTransactionTypeType = z.infer<typeof EditTransactionTypeSchema>;

export const EditTransactionWalletSchema = z.object({
  walletId: z.string(),
});

export type EditTransactionWalletType = z.infer<
  typeof EditTransactionWalletSchema
>;
