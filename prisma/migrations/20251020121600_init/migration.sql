/*
  Warnings:

  - You are about to drop the column `populationEst` on the `Geofence` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Geofence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "statusOverride" TEXT,
    "properties" TEXT,
    "geometry" TEXT NOT NULL,
    "effectiveFrom" DATETIME,
    "effectiveTo" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Geofence_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Geofence" ("createdAt", "geometry", "id", "level", "name", "properties", "serviceId", "statusOverride", "updatedAt") SELECT "createdAt", "geometry", "id", "level", "name", "properties", "serviceId", "statusOverride", "updatedAt" FROM "Geofence";
DROP TABLE "Geofence";
ALTER TABLE "new_Geofence" RENAME TO "Geofence";
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "website" TEXT,
    "colorHex" TEXT NOT NULL DEFAULT '#00E5FF',
    "status" TEXT NOT NULL,
    "launchedAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Service" ("colorHex", "createdAt", "id", "launchedAt", "name", "notes", "operator", "status", "updatedAt", "website") SELECT "colorHex", "createdAt", "id", "launchedAt", "name", "notes", "operator", "status", "updatedAt", "website" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "passwordHash", "role") SELECT "createdAt", "email", "id", "passwordHash", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
