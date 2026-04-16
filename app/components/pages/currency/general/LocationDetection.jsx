import { useState } from "react";
import CustomSection from "../../../essentials/CustomSection";
import CustomGridSection from "../../../essentials/CustomGridSection";
export default function LocationDetection({ data, handleChange }) {
    const { locationDetection, restrictedAutoSwitch, activeCurrencies, fallBackCurrency } = data.generalSettings;
    const { currencies } = data;
    const [isAddRestrictionPopoverOpen, setIsAddRestrictionPopoverOpen] = useState(false);
    const [isLocationDetection, setIsLocationDetection] = useState(locationDetection);
    const [isRestrictAutoSwitch, setIsRestrictAutoSwitch] = useState(restrictedAutoSwitch?.isEnabled);
    const [restrictedCountries, setRestrictedCountries] = useState(restrictedAutoSwitch?.restrictedCurrencies || []);
    const [fallBack, setFallBack] = useState(fallBackCurrency);
    // Tracks the user's typed search text and dynamically toggles the dropdown popover's visibility
    const [searchQuery, setSearchQuery] = useState("");
    const handleAddRestrictionInput = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsAddRestrictionPopoverOpen(query.length > 0);
    }

    // Toggles whether IP-based auto-detection is enabled globally, and bubbles the simple boolean update to the parent
    const handleLocationDetection = () => {
        setIsLocationDetection(!isLocationDetection);
        handleChange({
            target: "general",
            subTarget: "locationDetection",
            value: !isLocationDetection
        });
    }

    // Toggles the sub-setting to block auto-switch for specified currencies, while preserving the array of excluded countries in the payload
    const handleRestrictAutoSwitch = () => {
        const updated = !isRestrictAutoSwitch;
        setIsRestrictAutoSwitch(updated);
        handleChange({
            target: "general",
            subTarget: "restrictedAutoSwitch",
            value: {
                isEnabled: updated,
                restrictedCurrencies: restrictedCountries
            }
        });
    }

    // Adds a newly selected currency key (e.g. 'usd') from the search dropdown to the restricted list
    const handleAddRestrictedCountry = (currencyCode) => {
        const updated = [...restrictedCountries, currencyCode];
        setRestrictedCountries(updated);
        handleChange({
            target: "general",
            subTarget: "restrictedAutoSwitch",
            value: {
                isEnabled: isRestrictAutoSwitch,
                restrictedCurrencies: updated
            }
        });
    }

    // Removes an existing currency key from the restricted list via the UI chip's "X" or unchecking in the popover
    const handleRemoveRestrictedCountry = (currencyCode) => {
        const updated = restrictedCountries.filter((item) => item !== currencyCode);
        setRestrictedCountries(updated);
        handleChange({
            target: "general",
            subTarget: "restrictedAutoSwitch",
            value: {
                isEnabled: isRestrictAutoSwitch,
                restrictedCurrencies: updated
            }
        });
    }

    // Handles the change of the fallback currency
    const handleFallBackChange = (e) => {
        setFallBack(e.target.value);
        handleChange({
            target: "general",
            subTarget: "fallBackCurrency",
            value: e.target.value
        });
    }
    return (
        <CustomGridSection
            heading="Location-based currency switching"
            description="Automatically switch currencies based on visitor's location"
        >
            <CustomSection>
                <s-stack paddingBlockEnd="small">
                    <s-switch
                        label="Auto-detect visitor location"
                        details="Switches currency automatically based on IP region"
                        checked={isLocationDetection}
                        onChange={handleLocationDetection}
                    />
                </s-stack>
                <s-stack gap="small">
                    <s-switch
                        label="Exclude specific regions from auto-switch"
                        details="Do not auto-switch for selected countries, show fallback for them instead"
                        checked={isRestrictAutoSwitch}
                        onChange={handleRestrictAutoSwitch}
                    />
                    {isRestrictAutoSwitch && (
                        <s-stack>
                            <div style={{ position: "relative" }}>
                                <s-search-field placeholder="Search countries..." onInput={handleAddRestrictionInput} label="Filter countries" />
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 6px", alignItems: "center", paddingTop: "10px" }}>
                                    {/* map restricted countries */}
                                    {restrictedCountries?.map((currencyCode) => {
                                        const countryObj = currencies[currencyCode];
                                        if (!countryObj) return null;
                                        return (
                                            <s-clickable-chip
                                                key={currencyCode}
                                                color="strong"
                                                accessibilityLabel={`${countryObj.country} (${countryObj.code})`}
                                                removable
                                                tone="success"
                                                onRemove={() => handleRemoveRestrictedCountry(currencyCode)}
                                            >
                                                {countryObj.country} ({countryObj.code})
                                            </s-clickable-chip>
                                        );
                                    })}
                                </div>
                                {isAddRestrictionPopoverOpen && (
                                    <div id="add-currency-popover" style={{ position: "absolute", top: "65px", left: "0", maxHeight: "350px", overflowY: "auto", width: "calc(100% - 32px)", backgroundColor: "white", border: "1px solid #d8d8d8ff", borderRadius: "10px", padding: "8px 15px", zIndex: "999" }}>
                                        {/* map all active currencies to pick restrictions from */}
                                        {activeCurrencies
                                            .filter((currencyCode) => {
                                                const countryObj = currencies[currencyCode];
                                                return countryObj.country.toLowerCase().includes(searchQuery.toLowerCase()) || countryObj.code.toLowerCase().includes(searchQuery.toLowerCase());
                                            })
                                            .map((currencyCode) => {
                                                const countryObj = currencies[currencyCode];
                                                const isRestricted = restrictedCountries.includes(currencyCode);
                                                return (
                                                    <s-stack key={currencyCode} direction="inline" justifyContent="space-between" alignItems="center">
                                                        <s-checkbox checked={isRestricted} label={countryObj.country} onChange={() => {
                                                            if (isRestricted) handleRemoveRestrictedCountry(currencyCode);
                                                            else handleAddRestrictedCountry(currencyCode);
                                                        }} />
                                                        <s-text>{countryObj.code}</s-text>
                                                    </s-stack>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </s-stack>
                    )}
                </s-stack>
                <s-stack paddingBlockStart="base">
                    <s-select label="Fallback currency" details="Used when visitor's region has no matching currency" onChange={handleFallBackChange}>
                        {activeCurrencies?.map((currencyCode) => {
                            const countryObj = currencies[currencyCode];
                            return (
                                <s-option key={currencyCode} value={currencyCode} selected={fallBack === currencyCode}>{countryObj.country} ({countryObj.code})</s-option>
                            );
                        })}
                    </s-select>
                </s-stack>
            </CustomSection>
        </CustomGridSection>
    )
}
