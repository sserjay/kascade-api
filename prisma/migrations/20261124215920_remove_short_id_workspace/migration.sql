/*
  Warnings:

  - You are about to drop the column `shortId` on the `workspace` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "workspace_shortId_key";

-- AlterTable
ALTER TABLE "workspace" DROP COLUMN "shortId";
