import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.public.appProxy(request);

  if (!admin) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (_error) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const lastSyncedAt = payload?.lastSyncedAt;

  if (!lastSyncedAt) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const appInstallationResponse = await admin.graphql(
    `#graphql
    query CurrentAppInstallationId {
      currentAppInstallation {
        id
      }
    }`
  );
  const appInstallationJson = await appInstallationResponse.json();
  const ownerId = appInstallationJson?.data?.currentAppInstallation?.id;

  if (!ownerId) {
    return Response.json({ ok: false }, { status: 500 });
  }

  const metafieldsResponse = await admin.graphql(
    `#graphql
    mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        metafields: [
          {
            ownerId,
            namespace: "currency_converter",
            key: "exchange_meta",
            type: "json",
            value: JSON.stringify({ lastSyncedAt }),
          },
        ],
      },
    }
  );

  const metafieldsJson = await metafieldsResponse.json();
  const userErrors = metafieldsJson?.data?.metafieldsSet?.userErrors || [];

  if (userErrors.length) {
    return Response.json({ ok: false, userErrors }, { status: 400 });
  }

  return Response.json({ ok: true });
};
