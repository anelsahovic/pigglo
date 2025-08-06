import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { prisma } from './prisma';
import { Currency, Wallet } from '@prisma/client';
import Decimal from 'decimal.js';
import { LoanTransaction } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function exchangeCurrencyRate(
  toCurrency: Currency,
  fromCurrency: Currency,
  balance: Decimal
) {
  const rate = await prisma.exchangeRate.findFirst({
    where: { baseCurrency: fromCurrency, targetCurrency: toCurrency },
  });

  if (!rate) {
    console.error('No rate found.');
    return Decimal(0);
  }

  return balance.mul(rate.rate);
}

export async function getTotalBalanceFromWallets(
  wallets: Wallet[],
  userCurrency: Currency
) {
  const convertedBalances = await Promise.all(
    wallets.map((wallet) =>
      wallet.currency === userCurrency
        ? wallet.balance
        : exchangeCurrencyRate(userCurrency, wallet.currency, wallet.balance)
    )
  );

  const totalBalance = convertedBalances.reduce((acc: Decimal, balance) => {
    const value = balance instanceof Decimal ? balance : new Decimal(balance);
    return acc.plus(value);
  }, Decimal(0));

  return totalBalance;
}

export function formatCurrency(
  amount: number | string | bigint,
  currency: Currency = 'EUR'
) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

export function transformWalletForClient(wallet: Wallet) {
  return {
    id: wallet.id,
    name: wallet.name,
    balance: Number(wallet.balance),
    currency: wallet.currency,
    icon: wallet.icon,
  };
}

export async function getTotalLoanAmountInMainCurrency(
  transactions: LoanTransaction[],
  userMainCurrency: Currency
): Promise<number> {
  // map through the transaction amounts, if the same as users return it else exchange the rate to users main currency
  const convertedAmounts = await Promise.all(
    transactions.map(async (tx) => {
      const fromCurrency = tx.wallet.currency;
      const amount = Number(tx.amount);

      if (fromCurrency === userMainCurrency) {
        return amount;
      }

      const converted = await exchangeCurrencyRate(
        userMainCurrency,
        fromCurrency,
        new Decimal(amount)
      );
      return Number(converted);
    })
  );

  return convertedAmounts.reduce((acc, amount) => acc + amount, 0);
}
