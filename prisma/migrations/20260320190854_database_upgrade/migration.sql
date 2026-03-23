/*
  Warnings:

  - A unique constraint covering the columns `[storyId,userId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Bookmark_storyId_key";

-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'story',
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_storyId_userId_key" ON "Bookmark"("storyId", "userId");
