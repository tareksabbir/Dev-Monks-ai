-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "storyId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "author" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "descendants" INTEGER NOT NULL DEFAULT 0,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL,
    "storyId" INTEGER NOT NULL,
    "keyPoints" TEXT NOT NULL,
    "sentiment" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_storyId_key" ON "Bookmark"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "Summary_storyId_key" ON "Summary"("storyId");
