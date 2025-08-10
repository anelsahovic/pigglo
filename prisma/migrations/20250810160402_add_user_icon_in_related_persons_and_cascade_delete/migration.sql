/*
  Warnings:

  - Made the column `title` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."RelatedPersonIcons" AS ENUM ('USER_ICON1', 'USER_ICON2', 'USER_ICON3', 'USER_ICON4', 'USER_ICON5', 'USER_ICON6', 'USER_ICON7', 'USER_ICON8', 'USER_ICON9', 'USER_ICON10');

-- DropForeignKey
ALTER TABLE "public"."Loan" DROP CONSTRAINT "Loan_personId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_loanId_fkey";

-- AlterTable
ALTER TABLE "public"."RelatedPerson" ADD COLUMN     "icon" "public"."RelatedPersonIcons" NOT NULL DEFAULT 'USER_ICON1';

-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "title" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "public"."Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."RelatedPerson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
