import { z, ZodCoercedNumber } from 'zod';

export const AddNewTransactionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.coerce.number() as ZodCoercedNumber<number>,
  walletId: z.string(),
});

export type AddNewTransactionType = z.infer<typeof AddNewTransactionSchema>;
