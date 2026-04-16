import CustomSection from "../../../essentials/CustomSection";
import CustomGridSection from "../../../essentials/CustomGridSection";
import { useState } from "react";
import displayModeOptions from "../../../../assets/data/display_mode_options.json";

export default function DisplayMode({ handleChange, data }) {
    const { displayMode } = data.designSettings;
    const [selectedDisplayMode, setSelectedDisplayMode] = useState(displayMode);
    const handleDisplayModeChange = (e) => {
        setSelectedDisplayMode(e.target.value);
        handleChange(
            {
                target: "design",
                subTarget: "displayMode",
                value: e.target.value
            }
        );
    }
    return (
        <CustomGridSection
            heading="Display mode"
            description="Select the currencies your store should support. Base currency is always included."
        >
            <CustomSection>
                <s-select onChange={handleDisplayModeChange}>
                    {displayModeOptions?.map((option) => (
                        <s-option key={option.value} value={option.value} selected={selectedDisplayMode === option.value}>{option.label}</s-option>
                    ))}
                </s-select>
            </CustomSection>
        </CustomGridSection>
    )
}