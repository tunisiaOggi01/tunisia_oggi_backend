-- CreateTable
CREATE TABLE "ListingView" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingView_listingId_idx" ON "ListingView"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingView_ip_listingId_key" ON "ListingView"("ip", "listingId");

