import { getCurrencyFormats } from "./currency.server";

export async function defaultSettingsGeneral(admin) {
  const currencyFormats = await getCurrencyFormats(admin);

  const defaultCurrency =
    currencyFormats?.shop?.currencyCode?.toLowerCase() || "usd";

  return {
    storeDefaults: { currency: defaultCurrency },
    appBehavior: {
      enableCurrency: true,
      enableVisitorPreference: true,
      enableWidgetOnAllPages: true,
      exchangeRateFrequency: "12_hours",
      visitorPreferenceVersion: 1,
    },
  };
}