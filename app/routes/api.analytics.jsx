import { authenticate } from "../shopify.server";

const ALLOWED_EVENT_TYPES = new Set([
  "widget_view",
  "currency_switch_manual",
  "currency_switch_auto",
]);

const ALLOWED_SOURCES = new Set([
  "manual",
  "auto_detect",
  "fallback",
  "default",
  "restored_preference",
]);

export const action = async ({ request }) => {
  const { recordAnalyticsEvent } = await import("../utils/analytics.server");
  const { session } = await authenticate.public.appProxy(request);

  if (!session?.shop) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (_error) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const visitorId = typeof payload?.visitorId === "string" ? payload.visitorId.trim() : "";
  const eventType = typeof payload?.eventType === "string" ? payload.eventType.trim() : "";
  const currencyCode = typeof payload?.currencyCode === "string" ? payload.currencyCode.trim().toUpperCase() : null;
  const source = typeof payload?.source === "string" ? payload.source.trim() : null;

  if (!visitorId || !eventType || !ALLOWED_EVENT_TYPES.has(eventType)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (source && !ALLOWED_SOURCES.has(source)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    await recordAnalyticsEvent({
      shop: session.shop,
      visitorId,
      eventType,
      currencyCode,
      source,
    });
  } catch (error) {
    console.error("Analytics ingestion fallback triggered:", error);
    return Response.json({ ok: false, reason: "analytics_unavailable" }, { status: 202 });
  }

  return Response.json({ ok: true });
};
