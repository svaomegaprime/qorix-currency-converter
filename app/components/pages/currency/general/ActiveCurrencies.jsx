import { useState } from "react";
import CustomSection from "../../../essentials/CustomSection";
import CustomGridSection from "../../../essentials/CustomGridSection";

export default function ActiveCurrencies({ data, handleChange }) {
    const { generalSettings, currencies } = data;
    const [isAddCurrencyPopoverOpen, setIsAddCurrencyPopoverOpen] = useState(false);

    const [activeCurrencies, setActiveCurrencies] = useState(generalSettings.activeCurrencies);
    const [searchQuery, setSearchQuery] = useState("");

    // handling open search modal & input start
    const handleAddCurrencyInput = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
            setIsAddCurrencyPopoverOpen(true);
        } else {
            setIsAddCurrencyPopoverOpen(false);
        }
    }
    // handling open search modal & input end

    // handling add currency start
    const handleAddCurrency = (currency) => {
        setActiveCurrencies([...activeCurrencies, currency]);
        handleChange({
            target: "general",
            subTarget: "activeCurrencies",
            value: [...activeCurrencies, currency]
        });
    }
    // handling add currency end

    // handling remove currency start
    const handleRemoveCurrency = (currency) => {
        setActiveCurrencies(activeCurrencies.filter((item) => item !== currency));
        handleChange({
            target: "general",
            subTarget: "activeCurrencies",
            value: activeCurrencies.filter((item) => item !== currency)
        });
    }
    // handling remove currency end

    return (
        <CustomGridSection
            heading="Active currencies"
            description="Select the currencies your store should support. Base currency is always included."
        >
            <CustomSection>
                <div style={{ position: "relative" }}>
                    <s-search-field placeholder="Add currency..." onInput={handleAddCurrencyInput} value={searchQuery} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 6px", alignItems: "center", paddingTop: "10px" }}>
                        {activeCurrencies.map((currency) => (
                            <s-clickable-chip
                                key={currency}
                                color="strong"
                                accessibilityLabel={`${currencies[currency].name} (${currencies[currency].code})`}
                                removable
                                tone="success"
                                onRemove={() => handleRemoveCurrency(currency)}
                            >
                                {currencies[currency].name} ({currencies[currency].code})
                            </s-clickable-chip>
                        ))}
                    </div>
                    {isAddCurrencyPopoverOpen && (
                        <div id="add-currency-popover" style={{ position: "absolute", top: "40px", left: "0", width: "calc(100% - 32px)", maxHeight: "400px", overflowY: "auto", backgroundColor: "white", border: "1px solid #d8d8d8ff", borderRadius: "10px", padding: "8px 15px", zIndex: "999" }}>
                            {Object.entries(currencies)
                                .filter(([key, value]) =>
                                    value.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    value.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (value.country && value.country.toLowerCase().includes(searchQuery.toLowerCase()))
                                )
                                .map(([key, value]) => (
                                    activeCurrencies.includes(key) ? (
                                        <s-stack key={key} direction="inline" justifyContent="space-between" alignItems="center">
                                            <s-checkbox checked label={value.name} onChange={() => handleRemoveCurrency(key)} />
                                            <s-text>{value.code}</s-text>
                                        </s-stack>
                                    ) : (
                                        <s-stack key={key} direction="inline" justifyContent="space-between" alignItems="center">
                                            <s-checkbox label={value.name} onChange={() => handleAddCurrency(key)} />
                                            <s-text>{value.code}</s-text>
                                        </s-stack>
                                    )
                                ))}
                        </div>
                    )}
                </div>
            </CustomSection>
        </CustomGridSection>
    )
}