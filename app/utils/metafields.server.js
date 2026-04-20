import isoCurrencies from "../assets/data/iso_currency.json";
import {
  defaultCurrencyDesign,
  defaultCurrencyGeneral,
  defaultSettingsWidget,
} from "./default-settings";
import { defaultSettingsGeneral } from "./store-default.server";

const DEFAULT_APP_METAFIELD_KEYS = [
  "settings_general",
  "settings_widget",
  "currency_general",
  "currency_design",
  "iso_currencies",
];

const STATIC_DEFAULT_APP_METAFIELDS = {
  settings_widget: defaultSettingsWidget,
  currency_general: defaultCurrencyGeneral,
  currency_design: defaultCurrencyDesign,
  iso_currencies: isoCurrencies,
};

async function getDefaultMetafieldValue(admin, key) {
  if (key === "settings_general") {
    return await defaultSettingsGeneral(admin);
  }

  return STATIC_DEFAULT_APP_METAFIELDS[key];
}

export async function getAppInstallationMetafields(admin) {
  const response = await admin.graphql(
    `#graphql
    query AppMetafields {
      currentAppInstallation {
        id
        metafields(namespace: "currency_converter", first: 10) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }`
  );

  const json = await response.json();
  const currentAppInstallationId = json.data.currentAppInstallation.id;
  const metafields = json.data.currentAppInstallation.metafields.edges;
  const metafieldMap = {};

  metafields.forEach(({ node }) => {
    try {
      metafieldMap[node.key] = JSON.parse(node.value);
    } catch (_error) {
      metafieldMap[node.key] = null;
    }
  });
  return { currentAppInstallationId, metafieldMap };
}

export async function ensureAppMetafields(admin, requiredKeys = DEFAULT_APP_METAFIELD_KEYS) {
  const { currentAppInstallationId, metafieldMap } = await getAppInstallationMetafields(admin);
  const missingMetafields = requiredKeys.filter((key) => metafieldMap[key] == null);

  if (missingMetafields.length) {
    const resolvedMetafields = await Promise.all(
      missingMetafields.map(async (key) => {
        const value = await getDefaultMetafieldValue(admin, key);

        if (typeof value === "undefined") {
          throw new Error(`No default app metafield configured for key "${key}"`);
        }

        return { key, value };
      })
    );

    const metafieldsToSet = resolvedMetafields.map(({ key, value }) => ({
      ownerId: currentAppInstallationId,
      namespace: "currency_converter",
      key,
      type: "json",
      value: JSON.stringify(value),
    }));

    await admin.graphql(
      `#graphql
      mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors {
            field
            message
          }
        }
      }`,
      { variables: { metafields: metafieldsToSet } }
    );

    resolvedMetafields.forEach(({ key, value }) => {
      metafieldMap[key] = value;
    });
  }

  return { currentAppInstallationId, metafieldMap };
}
