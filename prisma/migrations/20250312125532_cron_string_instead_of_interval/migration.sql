/*
  Warnings:

  - You are about to drop the column `interval` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "interval",
ADD COLUMN     "cronSchedule" TEXT;
