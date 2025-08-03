import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { prisma } from './prisma';
import { Currency, Wallet } from '@prisma/client';
import Decimal from 'decimal.js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function exchangeCurrencyRate(
  userCurrency: Currency,
  otherCurrency: Currency,
  balance: Decimal
) {
  const rate = await prisma.exchangeRate.findFirst({
    where: { baseCurrency: otherCurrency, targetCurrency: userCurrency },
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
