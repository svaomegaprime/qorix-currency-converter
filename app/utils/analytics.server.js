import db from "../db.server";

const SWITCH_EVENT_TYPES = ["currency_switch_manual", "currency_switch_auto"];

function normalizeCount(value) {
  return Number(value ?? 0);
}

export async function ensureAnalyticsStorage() {
  // Prisma migrations manage table/index creation for all supported databases.
}

export async function recordAnalyticsEvent({ shop, visitorId, eventType, currencyCode = null, source = null }) {
  await ensureAnalyticsStorage();

  await db.analyticsEvent.create({
    data: {
      shop,
      visitorId,
      eventType,
      currencyCode,
      source,
    },
  });
}

export async function getAnalyticsSummary({ shop, currentWeekStart, previousWeekStart }) {
  await ensureAnalyticsStorage();

  const [
    sessionsThisWeekRows,
    totalSwitches,
    currentWeekSwitches,
    previousWeekSwitches,
    manualSwitches,
    autoSwitches,
    latestSwitch,
    currencyGroups,
  ] = await Promise.all([
    db.analyticsEvent.groupBy({
      by: ["visitorId"],
      where: {
        shop,
        createdAt: {
          gte: currentWeekStart,
        },
      },
    }),
    db.analyticsEvent.count({
      where: {
        shop,
        eventType: {
          in: SWITCH_EVENT_TYPES,
        },
      },
    }),
    db.analyticsEvent.count({
      where: {
        shop,
        eventType: {
          in: SWITCH_EVENT_TYPES,
        },
        createdAt: {
          gte: currentWeekStart,
        },
      },
    }),
    db.analyticsEvent.count({
      where: {
        shop,
        eventType: {
          in: SWITCH_EVENT_TYPES,
        },
        createdAt: {
          gte: previousWeekStart,
          lt: currentWeekStart,
        },
      },
    }),
    db.analyticsEvent.count({
      where: {
        shop,
        eventType: "currency_switch_manual",
      },
    }),
    db.analyticsEvent.count({
      where: {
        shop,
        eventType: "currency_switch_auto",
      },
    }),
    db.analyticsEvent.findFirst({
      where: {
        shop,
        eventType: {
          in: SWITCH_EVENT_TYPES,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
        currencyCode: true,
        source: true,
      },
    }),
    db.analyticsEvent.groupBy({
      by: ["currencyCode"],
      where: {
        shop,
        eventType: {
          in: SWITCH_EVENT_TYPES,
        },
        currencyCode: {
          not: null,
        },
      },
      _count: {
        currencyCode: true,
      },
    }),
  ]);

  const topCurrencyGroup = currencyGroups
    .filter((group) => group.currencyCode)
    .sort((a, b) => {
      const countDiff = normalizeCount(b?._count?.currencyCode) - normalizeCount(a?._count?.currencyCode);

      if (countDiff !== 0) {
        return countDiff;
      }

      return String(a.currencyCode).localeCompare(String(b.currencyCode));
    })[0];

  return {
    sessionsThisWeek: normalizeCount(sessionsThisWeekRows.length),
    currencySwitches: normalizeCount(totalSwitches),
    currencySwitchesThisWeek: normalizeCount(currentWeekSwitches),
    currencySwitchesPreviousWeek: normalizeCount(previousWeekSwitches),
    manualSwitches: normalizeCount(manualSwitches),
    autoSwitches: normalizeCount(autoSwitches),
    topCurrency: topCurrencyGroup?.currencyCode || null,
    lastSwitchAt: latestSwitch?.createdAt ? latestSwitch.createdAt.toISOString() : null,
    lastSwitchCurrency: latestSwitch?.currencyCode || null,
    lastSwitchSource: latestSwitch?.source || null,
  };
}
