-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('USD', 'EUR', 'BAM', 'RSD', 'AUD', 'GBP');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'EUR';

-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'EUR';

-- CreateTable
CREATE TABLE "public"."ExchangeRate" (
    "id" TEXT NOT NULL,
    "baseCurrency" "public"."Currency" NOT NULL,
    "targetCurrency" "public"."Currency" NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_baseCurrency_targetCurrency_fetchedAt_key" ON "public"."ExchangeRate"("baseCurrency", "targetCurrency", "fetchedAt");
