import { useState } from "react";
import CustomGridSection from "../../../essentials/CustomGridSection";
import CustomSection from "../../../essentials/CustomSection";
import exchangeFrequency from "../../../../assets/data/exchange_frequency.json";

export default function AppBehavior({ data, handleChange }) {
    const { appBehavior } = data.generalSettings;
    const [enableCurrency, setEnableCurrency] = useState(appBehavior.enableCurrency);
    const [enableVisitorPreference, setEnableVisitorPreference] = useState(appBehavior.enableVisitorPreference);
    const [enableWidgetOnAllPages, setEnableWidgetOnAllPages] = useState(appBehavior.enableWidgetOnAllPages);
    const [exchangeRateFrequency, setExchangeRateFrequency] = useState(appBehavior.exchangeRateFrequency);

    const handleEnableCurrency = () => {
        const updated = !enableCurrency;
        setEnableCurrency(updated);
        handleChange({
            target: "general",
            subTarget: "appBehavior",
            value: {
                ...appBehavior,
                enableCurrency: updated
            }
        });
    }
    const handleEnableVisitorPreference = () => {
        const updated = !enableVisitorPreference;
        setEnableVisitorPreference(updated);
        handleChange({
            target: "general",
            subTarget: "appBehavior",
            value: {
                ...appBehavior,
                enableVisitorPreference: updated
            }
        });
    }
    const handleEnableWidgetOnAllPages = () => {
        const updated = !enableWidgetOnAllPages;
        setEnableWidgetOnAllPages(updated);
        handleChange({
            target: "general",
            subTarget: "appBehavior",
            value: {
                ...appBehavior,
                enableWidgetOnAllPages: updated
            }
        });
    }
    const handleExchangeRateFrequency = (event) => {
        const updated = event.target.value;
        setExchangeRateFrequency(updated);
        handleChange({
            target: "general",
            subTarget: "appBehavior",
            value: {
                ...appBehavior,
                exchangeRateFrequency: updated
            }
        });
    }
    return (
        <CustomGridSection
            heading="App behavior"
            description="Master controls for how the app runs on your storefront"
        >
            <CustomSection>
                <s-stack gap="small">
                    <s-switch
                        label="Enable currency conversion"
                        details="Shows the currency switcher widget to your visitors"
                        checked={enableCurrency}
                        onChange={handleEnableCurrency}
                    />
                    <s-switch
                        label="Remember visitor preference"
                        details="Saves chosen currency preferences in a browser cookie across sessions"
                        checked={enableVisitorPreference}
                        onChange={handleEnableVisitorPreference}
                    />
                    {/* <s-switch
                        label="Show widget on all pages"
                        details="Uncheck to control placement manually via Shopify theme editor"
                        checked={enableWidgetOnAllPages}
                        onChange={handleEnableWidgetOnAllPages}
                    /> */}
                </s-stack>
                <s-stack gap="small" paddingBlockStart="base">
                    <s-stack>
                        <s-heading>Exchange rate update frequency</s-heading>
                        <s-paragraph color="subdued">
                            How often currency rates are automatically refreshed
                        </s-paragraph>
                    </s-stack>
                    <s-select value={exchangeRateFrequency} onChange={handleExchangeRateFrequency}>
                        {exchangeFrequency.map((item) => (
                            <s-option key={item.value} value={item.value} selected={exchangeRateFrequency === item.value}>
                                {item.label}
                            </s-option>
                        ))}
                    </s-select>
                </s-stack>
            </CustomSection>
        </CustomGridSection>
    )
}