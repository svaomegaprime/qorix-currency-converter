import CustomSection from "../../../essentials/CustomSection";
import CustomGridSection from "../../../essentials/CustomGridSection";
import { useState } from "react";
import FlagStyles from "../../../essentials/elements/FlagStyles";
import flagStyleOptions from "../../../../assets/data/flag_style_options.json";

export default function FlagStyle({ handleChange, data }) {
    const { flagStyle } = data.designSettings;
    const [selectedFlagStyle, setSelectedFlagStyle] = useState(flagStyle);
    const handleFlagStyleChange = (e) => {
        setSelectedFlagStyle(e.value);
        handleChange(
            {
                target: "design",
                subTarget: "flagStyle",
                value: e.value
            }
        );
    }
    return (
        <CustomGridSection
            heading="Flag style"
            description="Visual style of country flags shown in the widget"
        >
            <CustomSection>
                <div style={{ position: "relative" }}>
                    <s-grid gridTemplateColumns='repeat(3, 80px)' gap='base'>
                        {flagStyleOptions?.map((option) => (
                            <s-clickable
                                borderRadius='base'
                                overflow='hidden'
                                onClick={() => handleFlagStyleChange(option)}
                            >
                                <div className={`
                                    flag-style-option 
                                    ${selectedFlagStyle === option.value ? "selected" : ""}
                                `}>
                                    <FlagStyles style={option.value} />
                                    <s-text>
                                        {option.label}
                                    </s-text>
                                </div>
                            </s-clickable>
                        ))}
                    </s-grid>
                </div>
                <style>
                    {`
                        .flag-style-option{
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 10px;
                            flex-direction: column;
                            gap: 5px;
                            background-color: transparent;
                            width: calc(100% - 22px);
                            height: calc(100% - 22px);
                            transition: all 0.3s ease;
                            border: 1px solid #ddddddff;
                            border-radius: 9px;
                        }
                        .flag-style-option.selected{
                            background-color: #CDFED4;
                        }
                    `}
                </style>
            </CustomSection>
        </CustomGridSection>
    )
}