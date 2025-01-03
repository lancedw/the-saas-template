/*
  Warnings:

  - A unique constraint covering the columns `[carId,companyId]` on the table `timepods` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[timepodNr,companyId]` on the table `timepods` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `AutoClose` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AutoClose" DROP CONSTRAINT "AutoClose_employeeId_fkey";

-- AlterTable
ALTER TABLE "AutoClose" ADD COLUMN     "companyId" TEXT NOT NULL,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "companyId" TEXT NOT NULL,
ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TimeRecordRaw" (
    "id" TEXT NOT NULL,
    "timepodId" TEXT NOT NULL,
    "badgeUid" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "extra" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeRecordRaw_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "timepods_carId_companyId_key" ON "timepods"("carId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "timepods_timepodNr_companyId_key" ON "timepods"("timepodNr", "companyId");

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoClose" ADD CONSTRAINT "AutoClose_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoClose" ADD CONSTRAINT "AutoClose_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
