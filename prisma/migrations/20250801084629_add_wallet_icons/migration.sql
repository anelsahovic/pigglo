-- CreateEnum
CREATE TYPE "public"."WalletIcon" AS ENUM ('WALLET', 'BANK', 'CASH', 'SAFE', 'CARD', 'WISE', 'PAYONEER', 'PAYPAL', 'REVOLUT', 'PIGGYBANK', 'INVESTMENT', 'EMERGENCY');

-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "icon" "public"."WalletIcon" NOT NULL DEFAULT 'WALLET';
