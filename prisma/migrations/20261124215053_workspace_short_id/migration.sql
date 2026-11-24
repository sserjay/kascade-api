/*
  Warnings:

  - A unique constraint covering the columns `[shortId]` on the table `workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortId` to the `workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workspace" ADD COLUMN     "shortId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workspace_shortId_key" ON "workspace"("shortId");
