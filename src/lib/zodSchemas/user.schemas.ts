import { z } from 'zod';

export const updateCurrencySchema = z.object({
  currency: z.enum(
    ['EUR', 'USD', 'BAM', 'AUD', 'GBP', 'RSD'],
    'Please choose currency'
  ),
});

export type UpdateCurrencyType = z.infer<typeof updateCurrencySchema>;
