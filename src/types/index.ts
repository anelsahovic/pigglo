import {
  Currency,
  LoanDirection,
  Transaction,
  WalletIcon,
} from '@prisma/client';

export interface WalletClient {
  id: string;
  name: string;
  balance: number;
  currency: Currency;
  icon: WalletIcon;
}

export interface TransactionExtended extends Transaction {
  loan: {
    direction: LoanDirection;
    person: {
      id: string;
      name: string;
    };
  } | null;
}

export interface LoanTransaction extends TransactionExtended {
  wallet: {
    currency: Currency;
  };
}
