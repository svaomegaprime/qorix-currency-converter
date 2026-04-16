import db from "../db.server";

const SWITCH_EVENT_TYPES = ["currency_switch_manual", "currency_switch_auto"];

let analyticsStoragePromise = null;

function normalizeCount(value) {
  return Number(value || 0);
}

async function queryFirst(query, ...params) {
  const rows = await db.$queryRawUnsafe(query, ...params);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function ensureAnalyticsStorage() {
  if (!analyticsStoragePromise) {
    analyticsStoragePromise = (async () => {
      await db.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "shop" TEXT NOT NULL,
          "visitorId" TEXT NOT NULL,
          "eventType" TEXT NOT NULL,
          "currencyCode" TEXT,
          "source" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "AnalyticsEvent_shop_createdAt_idx"
        ON "AnalyticsEvent"("shop", "createdAt")
      `);

      await db.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "AnalyticsEvent_shop_eventType_createdAt_idx"
        ON "AnalyticsEvent"("shop", "eventType", "createdAt")
      `);
    })().catch((error) => {
      analyticsStoragePromise = null;
      throw error;
    });
  }

  return analyticsStoragePromise;
}

export async function recordAnalyticsEvent({ shop, visitorId, eventType, currencyCode = null, source = null }) {
  await ensureAnalyticsStorage();

  await db.$executeRawUnsafe(
    `
      INSERT INTO "AnalyticsEvent" (
        "shop",
        "visitorId",
        "eventType",
        "currencyCode",
        "source",
        "createdAt"
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    shop,
    visitorId,
    eventType,
    currencyCode,
    source,
    new Date().toISOString(),
  );
}

export async function getAnalyticsSummary({ shop, currentWeekStart, previousWeekStart }) {
  await ensureAnalyticsStorage();

  const currentWeekStartIso = currentWeekStart.toISOString();
  const previousWeekStartIso = previousWeekStart.toISOString();

  const [
    sessionsRow,
    totalSwitchesRow,
    currentWeekSwitchesRow,
    previousWeekSwitchesRow,
    manualSwitchesRow,
    autoSwitchesRow,
    latestSwitchRow,
    topCurrencyRow,
  ] = await Promise.all([
    queryFirst(
      `
        SELECT COUNT(DISTINCT "visitorId") AS "count"
        FROM "AnalyticsEvent"
        WHERE "shop" = ? AND "createdAt" >= ?
      `,
      shop,
      currentWeekStartIso,
    ),
    queryFirst(
      `
        SELECT COUNT(*) AS "count"
        FROM "AnalyticsEvent"
        WHERE "shop" = ? AND "eventType" IN (?, ?)
      `,
      shop,
      ...SWITCH_EVENT_TYPES,
    ),
    queryFirst(
      `
        SELECT COUNT(*) AS "count"
        FROM "AnalyticsEvent"
        WHERE "shop" = ? AND "eventType" IN (?, ?) AND "createdAt" >= ?
      `,
      shop,
      ...SWITCH_EVENT_TYPES,
      currentWeekStartIso,
    ),
    queryFirst(
      `
        SELECT COUNT(*) AS "count"
        FROM "AnalyticsEvent"
        WHERE "shop" = ? AND "eventType" IN (?, ?) AND "createdAt" >= ? AND "createdAt" < ?
      `,
      shop,
      ...SWITCH_EVENT_TYPES,
      previousWeekStartIso,
      currentWeekStartIso,
    ),
    queryFirst(
      `
        SELECT COUNT(*) AS "count"
        FROM "AnalyticsEvent"
        WHERE "shop" = ? AND "eventType" = ?
      `,
      shop,
      "currency_switch_manual",
    ),
    queryFirst(
      `
        SELECT COUNT(*) AS "count"
        FROM "AnalyticsEvent"
        WHERE "shop" = ? AND "eventType" = ?
      `,
      shop,
      "currency_switch_auto",
    ),
    queryFirst(
      `
        SELECT "createdAt", "currencyCode", "source"
        FROM "AnalyticsEvent"
        WHERE "shop" = ? AND "eventType" IN (?, ?)
        ORDER BY "createdAt" DESC
        LIMIT 1
      `,
      shop,
      ...SWITCH_EVENT_TYPES,
    ),
    queryFirst(
      `
        SELECT "currencyCode", COUNT(*) AS "count"
        FROM "AnalyticsEvent"
        WHERE "shop" = ? AND "eventType" IN (?, ?) AND "currencyCode" IS NOT NULL
        GROUP BY "currencyCode"
        ORDER BY "count" DESC
        LIMIT 1
      `,
      shop,
      ...SWITCH_EVENT_TYPES,
    ),
  ]);

  return {
    sessionsThisWeek: normalizeCount(sessionsRow?.count),
    currencySwitches: normalizeCount(totalSwitchesRow?.count),
    currencySwitchesThisWeek: normalizeCount(currentWeekSwitchesRow?.count),
    currencySwitchesPreviousWeek: normalizeCount(previousWeekSwitchesRow?.count),
    manualSwitches: normalizeCount(manualSwitchesRow?.count),
    autoSwitches: normalizeCount(autoSwitchesRow?.count),
    topCurrency: topCurrencyRow?.currencyCode || null,
    lastSwitchAt: latestSwitchRow?.createdAt || null,
    lastSwitchCurrency: latestSwitchRow?.currencyCode || null,
    lastSwitchSource: latestSwitchRow?.source || null,
  };
}
