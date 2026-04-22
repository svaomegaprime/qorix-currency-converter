export const defaultSettingsWidget = {
  widgetType: "combined",
  position: "bottom_left",
  customSelector: "",
  offsetFromEdge: { horizontal: 0, vertical: 0 },
  themeCustomisation: {
    backgroundColor: "#ffffff",
    hoverBackground: "#e7e7e7",
    textColor: "#303030",
    borderColor: "#B8B8B8",
    hoverColor: "#202020",
    borderRadius: 8,
    shadow: "none",
  },
  visibility: { enableOnDesktop: true, enableOnMobile: true },
};

// export const defaultCurrencyGeneral = {
//   activeCurrencies: ["usd", "eur", "bdt"],
//   locationDetection: false,
//   priceDisplayFormat: "without_currency_code",
//   restrictedAutoSwitch: {
//     isEnabled: false,
//     restrictedCurrencies: ["jpy", "cny", "inr", "bdt"],
//   },
//   fallBackCurrency: "usd",
// };

export const defaultCurrencyDesign = {
  displayMode: "currency_code",
  flagStyle: "2d_flag",
  behavior: {
    darkModeSupport: false,
    showCurrencyNameOnHover: true,
    showOriginalPriceOnHover: false,
  },
};