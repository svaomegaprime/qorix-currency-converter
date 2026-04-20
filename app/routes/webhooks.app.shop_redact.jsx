

import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  try {
    const { payload } = await authenticate.webhook(request);

    console.log("Shop Redact", payload);

    await db.AnalyticsEvent.deleteMany({ where: { shop: payload.shop } });

    return new Response("OK", {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
};
