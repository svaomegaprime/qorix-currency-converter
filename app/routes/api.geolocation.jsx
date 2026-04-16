import { authenticate } from "../shopify.server";
import { getGeolocationForRequest } from "../utils/geolocation.server";

export const loader = async ({ request }) => {
  await authenticate.public.appProxy(request);

  try {
    const geolocation = await getGeolocationForRequest(request);
    console.log("Geolocation data:", geolocation);
    return Response.json(
      {
        ok: true,
        locationDetection: {
          countryCode: geolocation?.location?.country_code2 || null,
          currencyCode: geolocation?.currency?.code || null,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching geolocation:", error);

    return Response.json(
      {
        ok: false,
        locationDetection: {
          countryCode: null,
          currencyCode: null,
        },
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
};
