-- Sync Sprint 1 schema drift: models present in schema.prisma but never migrated (were applied via db push on dev only).
-- Recreates PendingUpload, PublicationView, PublicationReaction and User/Publication columns so fresh replay matches the datamodel.

-- AlterTable
ALTER TABLE "Publication" ADD COLUMN     "rankScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT,
ADD COLUMN     "heardAbout" TEXT,
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PendingUpload" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationReaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicationReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PendingUpload_createdAt_idx" ON "PendingUpload"("createdAt");

-- CreateIndex
CREATE INDEX "PublicationView_publicationId_idx" ON "PublicationView"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationView_userId_publicationId_key" ON "PublicationView"("userId", "publicationId");

-- CreateIndex
CREATE INDEX "PublicationReaction_publicationId_idx" ON "PublicationReaction"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationReaction_userId_publicationId_key" ON "PublicationReaction"("userId", "publicationId");

-- AddForeignKey
ALTER TABLE "PendingUpload" ADD CONSTRAINT "PendingUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationView" ADD CONSTRAINT "PublicationView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationView" ADD CONSTRAINT "PublicationView_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationReaction" ADD CONSTRAINT "PublicationReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationReaction" ADD CONSTRAINT "PublicationReaction_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "Publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;