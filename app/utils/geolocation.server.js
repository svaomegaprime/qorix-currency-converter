const GEOLOCATION_API_URL = "https://api.ipgeolocation.io/v3/ipgeo";
const IP_ADDRESS_PATTERN = /^[0-9a-fA-F:.]+$/;

function getClientIpFromRequest(request) {
  const headerCandidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("fly-client-ip"),
  ];

  for (const headerValue of headerCandidates) {
    if (!headerValue) {
      continue;
    }

    const clientIp = headerValue.split(",")[0]?.trim();
    if (clientIp) {
      return clientIp;
    }
  }

  return null;
}

export async function getGeolocationForRequest(request) {
  const apiKey = process.env.IPGEOLOCATION_API_KEY;

  if (!apiKey) {
    throw new Error("Missing IPGEOLOCATION_API_KEY environment variable");
  }

  const requestUrl = new URL(GEOLOCATION_API_URL);
  requestUrl.searchParams.set("apiKey", apiKey);

  const explicitIp = new URL(request.url).searchParams.get("ip");
  const safeExplicitIp = explicitIp && IP_ADDRESS_PATTERN.test(explicitIp) ? explicitIp : null;
  const clientIp = safeExplicitIp || getClientIpFromRequest(request);
  if (clientIp) {
    requestUrl.searchParams.set("ip", clientIp);
  }

  const response = await fetch(requestUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Geolocation request failed with status ${response.status}`);
  }

  return await response.json();
}
