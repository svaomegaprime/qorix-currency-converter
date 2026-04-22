import CustomGridSection from "../../../essentials/CustomGridSection";
import CustomSection from "../../../essentials/CustomSection";
import { useState } from "react";
import currencies from "../../../../assets/data/currencies.json";
export default function StoreDefaults({ data, handleChange }) {
    const { storeDefaults } = data.generalSettings;
    const storeDefaultCurrency = data.storeDefaultCurrency;
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
            description="Base currency your store is built on"
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
                        <s-option value={storeDefaultCurrency}>({currencies[storeDefaultCurrency]?.symbol}) {currencies[storeDefaultCurrency]?.name} (Store default)</s-option>
                    </s-select>
                </s-stack>
            </CustomSection>
        </CustomGridSection>
    )
}