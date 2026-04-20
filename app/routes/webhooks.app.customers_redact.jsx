
import { authenticate } from "../shopify.server";


export const action = async ({ request }) => {
  try {
    const { payload } = await authenticate.webhook(request);

    console.log("Customers Redact", payload);

    return new Response("OK", {
      status: 200,
      statusText: "OK",
    });
  } catch (error) {
    return new Response("Unauthorized", { status: 401 });
  }
};
