-- CreateTable
CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "currencyCode" TEXT,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_shop_createdAt_idx" ON "AnalyticsEvent"("shop", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_shop_eventType_createdAt_idx" ON "AnalyticsEvent"("shop", "eventType", "createdAt");
