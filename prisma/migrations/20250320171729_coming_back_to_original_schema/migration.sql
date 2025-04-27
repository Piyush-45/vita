/*
  Warnings:

  - You are about to drop the column `clerkUserId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `PdfSummary` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_clerkUserId_key";

-- AlterTable
ALTER TABLE "PdfSummary" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkUserId",
ADD COLUMN     "customerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_customerId_key" ON "User"("customerId");
