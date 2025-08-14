/*
  Warnings:

  - You are about to drop the column `title` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `description` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventName` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standName` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "title",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "eventName" TEXT NOT NULL,
ADD COLUMN     "standAddress" TEXT,
ADD COLUMN     "standName" TEXT NOT NULL;
