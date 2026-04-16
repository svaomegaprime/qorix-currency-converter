import CustomGridSection from "../../../essentials/CustomGridSection";
import CustomSection from "../../../essentials/CustomSection";
import { useState } from "react";
import selectedCurrencies from "../../../../assets/data/selected_currencies.json";
import currencies from "../../../../assets/data/currencies.json";
export default function StoreDefaults({ data, handleChange }) {
    const { storeDefaults } = data.generalSettings;
    const [currency, setCurrency] = useState(storeDefaults.currency);

    const handleCurrency = (event) => {
        setCurrency(event.target.value);
        handleChange({
            target: "general",
            subTarget: "storeDefaults",
            value: {
                ...storeDefaults,
                currency: event.target.value
            }
        });
    }
    return (
        <CustomGridSection
            heading="Store defaults"
            description="Base language and currency your store is built on"
        >
            <CustomSection>
                <s-stack gap="small">
                    <s-stack>
                        <s-heading>Base currency</s-heading>
                        <s-paragraph color="subdued">
                            All prices convert from this currency
                        </s-paragraph>
                    </s-stack>
                    <s-select value={currency} onChange={handleCurrency}>
                        {selectedCurrencies.map((currency) => (
                            <s-option key={currency} value={currency}>
                                {currencies[currency].name} ({currencies[currency].code})
                            </s-option>
                        ))}
                    </s-select>
                </s-stack>
            </CustomSection>
        </CustomGridSection>
    )
}