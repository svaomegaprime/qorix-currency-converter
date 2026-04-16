import { useState } from "react";
import CustomSection from "../../../essentials/CustomSection";
import CustomGridSection from "../../../essentials/CustomGridSection";

export default function PriceDisplayFormat({ data, handleChange }) {
    const { priceDisplayFormat } = data.generalSettings;
    const [format, setFormat] = useState(priceDisplayFormat);

    const handleFormatChange = (value) => {
        setFormat(value);
        handleChange({
            target: "general",
            subTarget: "priceDisplayFormat",
            value
        });
    };

    return (
        <CustomGridSection
            heading="Price display format"
            description="Choose how converted prices appear to your customers."
        >
            <CustomSection>
                <s-stack gap="small">
                    <s-stack>
                        <s-grid gridTemplateColumns="1fr auto" placeItems="center">
                            <s-stack inlineSize="100%">
                                <s-checkbox onChange={() => handleFormatChange("without_currency_code")} label="Without currency code" details="Cleaner look for single-region stores" checked={format === "without_currency_code"} />
                            </s-stack>
                            <s-stack>
                                <s-badge tone="success">$9.99</s-badge>
                            </s-stack>
                        </s-grid>
                    </s-stack>

                    <s-stack>
                        <s-grid gridTemplateColumns="1fr auto" placeItems="center">
                            <s-stack inlineSize="100%">
                                <s-checkbox onChange={() => handleFormatChange("with_currency_code")} label="With currency code" details="Better for global stores with multiple currencies" checked={format === "with_currency_code"} />
                            </s-stack>
                            <s-stack>
                                <s-badge tone="success">$9.99 USD</s-badge>
                            </s-stack>
                        </s-grid>
                    </s-stack>

                    <s-stack>
                        <s-grid gridTemplateColumns="1fr auto" placeItems="center">
                            <s-stack inlineSize="100%">
                                <s-checkbox onChange={() => handleFormatChange("currency_code_only")} label="Currency code only" details="Minimal style, no symbol, just code" checked={format === "currency_code_only"} />
                            </s-stack>
                            <s-stack>
                                <s-badge tone="success">9.99 USD</s-badge>
                            </s-stack>
                        </s-grid>
                    </s-stack>
                </s-stack>
            </CustomSection>
        </CustomGridSection>
    );
}