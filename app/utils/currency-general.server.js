import { getCurrencyFormats } from "./currency.server";
export async function getDefaultCurrencyGeneral(admin){
    const currencyFormats = await getCurrencyFormats(admin);
    const defaultCurrency = currencyFormats?.shop?.currencyCode?.toLowerCase() || "usd";
    return {
        activeCurrencies: [defaultCurrency, "eur", "bdt"],
        locationDetection: false,
        priceDisplayFormat: "without_currency_code",
        restrictedAutoSwitch: {
            isEnabled: false,
            restrictedCurrencies: ["inr"],
        },
        fallBackCurrency: defaultCurrency,
    }
}