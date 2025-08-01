import { Currency } from '@prisma/client';

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  BAM: 'KM',
  RSD: 'дин',
  AUD: 'AU$',
  GBP: '£',
};
