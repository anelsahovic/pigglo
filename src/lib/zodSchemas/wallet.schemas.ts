import { z, ZodCoercedNumber } from 'zod';

export const AddNewWalletSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(1, 'Name is required')
    .max(50, 'Max name length is 50 characters'),
  balance: z.coerce.number() as ZodCoercedNumber<number>,

  currency: z.enum(['EUR', 'USD', 'BAM', 'AUD', 'GBP', 'RSD']),
  icon: z.enum([
    'WALLET',
    'BANK',
    'CASH',
    'SAFE',
    'CARD',
    'WISE',
    'PAYONEER',
    'PAYPAL',
    'REVOLUT',
    'PIGGYBANK',
    'INVESTMENT',
    'EMERGENCY',
  ]),
});
export type AddNewWalletType = z.infer<typeof AddNewWalletSchema>;

export const EditWalletSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(1, 'Name is required')
    .max(50, 'Max name length is 50 characters'),
  balance: z.coerce.number() as ZodCoercedNumber<number>,
  currency: z.enum(['EUR', 'USD', 'BAM', 'AUD', 'GBP', 'RSD']),

  icon: z.enum([
    'WALLET',
    'BANK',
    'CASH',
    'SAFE',
    'CARD',
    'WISE',
    'PAYONEER',
    'PAYPAL',
    'REVOLUT',
    'PIGGYBANK',
    'INVESTMENT',
    'EMERGENCY',
  ]),
});

export type EditWalletType = z.infer<typeof EditWalletSchema>;
