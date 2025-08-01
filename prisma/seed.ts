import { Currency, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exchangeRates: Record<Currency, Record<Currency, number>> = {
  USD: { EUR: 0.8659, BAM: 1.694, RSD: 101.4, AUD: 1.548, GBP: 0.7539, USD: 0 },
  EUR: { USD: 1.155, BAM: 1.955, RSD: 117.2, AUD: 1.788, GBP: 0.871, EUR: 0 },
  BAM: {
    USD: 0.5904,
    EUR: 0.5114,
    RSD: 59.91,
    AUD: 0.9143,
    GBP: 0.4454,
    BAM: 0,
  },
  RSD: {
    USD: 0.0098,
    EUR: 0.008535,
    BAM: 0.01669,
    AUD: 0.01526,
    GBP: 0.007435,
    RSD: 0,
  },
  AUD: { USD: 1.57, EUR: 0.5596, BAM: 1.094, RSD: 65.55, GBP: 0.4871, AUD: 0 },
  GBP: { USD: 1.325, EUR: 1.148, BAM: 2.246, RSD: 134.5, AUD: 2.053, GBP: 0 },
};

async function main() {
  const now = new Date();

  for (const base of Object.keys(exchangeRates) as Currency[]) {
    const targets = exchangeRates[base];
    for (const target of Object.keys(targets) as Currency[]) {
      const rate = targets[target];

      await prisma.exchangeRate.upsert({
        where: {
          baseCurrency_targetCurrency_fetchedAt: {
            baseCurrency: base,
            targetCurrency: target,
            fetchedAt: now,
          },
        },
        update: {
          rate,
        },
        create: {
          baseCurrency: base,
          targetCurrency: target,
          rate,
          fetchedAt: now,
        },
      });
    }
  }

  console.log('✅ Exchange rates seeded.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding exchange rates:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
