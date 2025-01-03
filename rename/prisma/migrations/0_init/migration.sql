-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'CONTRIBUTOR', 'SUPPORT', 'READER');

-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('DEMO', 'TEST', 'REAL');

-- CreateEnum
CREATE TYPE "License" AS ENUM ('TRAIL', 'PRO', 'PREMIUM', 'ENTERPRISE', 'SUSPENDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('CLOSED', 'AUTO_CLOSE', 'MANUAL_CLOSE', 'PENDING', 'MANUAL_CREATION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "countryCode" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "meta" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "type" "OrgType" NOT NULL,
    "addressId" TEXT,
    "name" TEXT NOT NULL,
    "taxNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "subscriptionStart" TIMESTAMP(3),
    "renewedAt" TIMESTAMP(3),
    "nextRenewalAt" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "trailStart" TIMESTAMP(3),
    "license" "License",
    "canceledAt" TIMESTAMP(3),
    "canceledReason" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addressId" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "settings" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role" "Roles" NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Discipline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "color" TEXT,
    "cost" INTEGER,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "timepodId" TEXT,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeRecords" (
    "id" TEXT NOT NULL,
    "BadgeUid" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "CompanyId" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "timepodId" TEXT NOT NULL,
    "status" "LogStatus",
    "badgeIn" TIMESTAMP(3) NOT NULL,
    "badgeOut" TIMESTAMP(3),
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "defaultDiscId" TEXT,
    "schedule" JSONB NOT NULL DEFAULT '{}',
    "latestRecordId" TEXT,
    "badgeUid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "hourlyRate" INTEGER,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "uid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "timepodId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "AutoClose" (
    "id" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "AutoClose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timepods" (
    "id" TEXT NOT NULL,
    "IPAddress" TEXT NOT NULL,
    "activeSince" TIMESTAMP(3) NOT NULL,
    "bootCount" INTEGER NOT NULL,
    "carId" TEXT,
    "companyId" TEXT,
    "disciplines" TEXT[],
    "failedRequests" INTEGER NOT NULL,
    "firebaseClient" TEXT NOT NULL,
    "gatewayIp" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "lastPingTime" TIMESTAMP(3) NOT NULL,
    "macAddress" TEXT NOT NULL,
    "networkId" TEXT NOT NULL,
    "restarts" INTEGER NOT NULL,
    "succeededRequests" INTEGER NOT NULL,
    "timepodNr" INTEGER NOT NULL,
    "totalPings" INTEGER NOT NULL,
    "wifiMac" TEXT NOT NULL,
    "signalStrength" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timepods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_addressId_key" ON "Organization"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_addressId_key" ON "Company"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_userId_organizationId_key" ON "Role"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Discipline_companyId_name_key" ON "Discipline"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Car_timepodId_key" ON "Car"("timepodId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_defaultDiscId_key" ON "Employee"("defaultDiscId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_latestRecordId_key" ON "Employee"("latestRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_badgeUid_key" ON "Employee"("badgeUid");

-- CreateIndex
CREATE UNIQUE INDEX "timepods_id_key" ON "timepods"("id");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_timepodId_fkey" FOREIGN KEY ("timepodId") REFERENCES "timepods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeRecords" ADD CONSTRAINT "TimeRecords_BadgeUid_fkey" FOREIGN KEY ("BadgeUid") REFERENCES "Badge"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeRecords" ADD CONSTRAINT "TimeRecords_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeRecords" ADD CONSTRAINT "TimeRecords_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeRecords" ADD CONSTRAINT "TimeRecords_timepodId_fkey" FOREIGN KEY ("timepodId") REFERENCES "timepods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_defaultDiscId_fkey" FOREIGN KEY ("defaultDiscId") REFERENCES "Discipline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_latestRecordId_fkey" FOREIGN KEY ("latestRecordId") REFERENCES "TimeRecords"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_badgeUid_fkey" FOREIGN KEY ("badgeUid") REFERENCES "Badge"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_timepodId_fkey" FOREIGN KEY ("timepodId") REFERENCES "timepods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutoClose" ADD CONSTRAINT "AutoClose_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timepods" ADD CONSTRAINT "timepods_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

