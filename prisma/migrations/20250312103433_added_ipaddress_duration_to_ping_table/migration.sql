/*
  Warnings:

  - You are about to drop the column `responseTime` on the `Ping` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ping" DROP COLUMN "responseTime",
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "ipAddress" TEXT,
ALTER COLUMN "statusCode" DROP NOT NULL;
