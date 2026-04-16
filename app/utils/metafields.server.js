import isoCurrencies from "../assets/data/iso_currency.json";
import {
  defaultCurrencyDesign,
  defaultCurrencyGeneral,
  defaultSettingsGeneral,
  defaultSettingsWidget,
} from "./default-settings";

const DEFAULT_APP_METAFIELDS = {
  settings_general: defaultSettingsGeneral,
  settings_widget: defaultSettingsWidget,
  currency_general: defaultCurrencyGeneral,
  currency_design: defaultCurrencyDesign,
  iso_currencies: isoCurrencies,
};

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

export async function ensureAppMetafields(admin, requiredKeys = Object.keys(DEFAULT_APP_METAFIELDS)) {
  const { currentAppInstallationId, metafieldMap } = await getAppInstallationMetafields(admin);
  const missingMetafields = requiredKeys.filter((key) => metafieldMap[key] == null);

  if (missingMetafields.length) {
    const metafieldsToSet = missingMetafields.map((key) => ({
      ownerId: currentAppInstallationId,
      namespace: "currency_converter",
      key,
      type: "json",
      value: JSON.stringify(DEFAULT_APP_METAFIELDS[key]),
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

    missingMetafields.forEach((key) => {
      metafieldMap[key] = DEFAULT_APP_METAFIELDS[key];
    });
  }

  return { currentAppInstallationId, metafieldMap };
}
