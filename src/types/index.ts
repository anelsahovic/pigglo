import { Currency, WalletIcon } from '@prisma/client';

export interface WalletClient {
  id: string;
  name: string;
  balance: number;
  currency: Currency;
  icon: WalletIcon;
}
