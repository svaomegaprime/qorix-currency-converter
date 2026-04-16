import CustomSection from "../../../../essentials/CustomSection";
import CustomColor from "../elements/CustomColor";
import CustomRange from "../elements/CustomRange";
import Button from "../elements/Button";
import { useState } from "react";

export default function ThemeCustomisation({ data, handleChange }) {
    const themeCustomisation = data.widgetSettings.themeCustomisation || {};
    const [shadow, setShadow] = useState(themeCustomisation.shadow || "none");
    const [backgroundColor, setBackgroundColor] = useState(themeCustomisation.backgroundColor || "#ffffff");
    const [hoverBackground, setHoverBackground] = useState(themeCustomisation.hoverBackground || "#f3f3f3");
    const [textColor, setTextColor] = useState(themeCustomisation.textColor || "#303030");
    const [borderColor, setBorderColor] = useState(themeCustomisation.borderColor || "#b8b8b8");
    const [hoverColor, setHoverColor] = useState(themeCustomisation.hoverColor || "#202020");
    const [borderRadius, setBorderRadius] = useState(themeCustomisation.borderRadius || 8);
    const handleBackgroundColor = (color) => {
        setBackgroundColor(color);
        handleChange({
            target: "widget",
            subTarget: "themeCustomisation",
            value: {
                ...themeCustomisation,
                backgroundColor: color
            }
        });
    }
    const handleHoverBackground = (color) => {
        setHoverBackground(color);
        handleChange({
            target: "widget",
            subTarget: "themeCustomisation",
            value: {
                ...themeCustomisation,
                hoverBackground: color
            }
        });
    }
    const handleTextColor = (color) => {
        setTextColor(color);
        handleChange({
            target: "widget",
            subTarget: "themeCustomisation",
            value: {
                ...themeCustomisation,
                textColor: color
            }
        });
    }
    const handleBorderColor = (color) => {
        setBorderColor(color);
        handleChange({
            target: "widget",
            subTarget: "themeCustomisation",
            value: {
                ...themeCustomisation,
                borderColor: color
            }
        });
    }
    const handleHoverColor = (color) => {
        setHoverColor(color);
        handleChange({
            target: "widget",
            subTarget: "themeCustomisation",
            value: {
                ...themeCustomisation,
                hoverColor: color
            }
        });
    }
    const handleBorderRadius = (value) => {
        setBorderRadius(value);
        handleChange({
            target: "widget",
            subTarget: "themeCustomisation",
            value: {
                ...themeCustomisation,
                borderRadius: Number(value)
            }
        });
    }
    const handleShadowChange = (shadow) => {
        setShadow(shadow);
        handleChange({
            target: "widget",
            subTarget: "themeCustomisation",
            value: {
                ...themeCustomisation,
                shadow
            }
        });
    }
    return (
        <s-stack gap="small">
            <s-heading>Theme customisation</s-heading>
            <s-stack gap="base">
                <CustomSection>
                    <CustomColor
                        label="Background color"
                        defaultValue={backgroundColor}
                        onChange={handleBackgroundColor}
                    />
                </CustomSection>
                <CustomSection>
                    <CustomColor
                        label="Hover background color"
                        defaultValue={hoverBackground}
                        onChange={handleHoverBackground}
                    />
                </CustomSection>
                <CustomSection>
                    <CustomColor
                        label="Text color"
                        defaultValue={textColor}
                        onChange={handleTextColor}
                    />
                </CustomSection>
                <CustomSection>
                    <CustomColor
                        label="Hover text color"
                        defaultValue={hoverColor}
                        onChange={handleHoverColor}
                    />
                </CustomSection>
                <CustomSection>
                    <CustomColor
                        label="Border color"
                        defaultValue={borderColor}
                        onChange={handleBorderColor}
                    />
                </CustomSection>
                <CustomSection>
                    <CustomRange
                        label="Border radius"
                        max={40}
                        defaultValue={borderRadius}
                        onChange={handleBorderRadius}
                    />
                </CustomSection>
                <CustomSection>
                    <s-stack gap="small">
                        <s-heading>Shadow</s-heading>
                        <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="small">
                            <Button onClick={() => handleShadowChange("none")} isActive={shadow === "none"}>None</Button>
                            <Button onClick={() => handleShadowChange("subtle")} isActive={shadow === "subtle"}>Subtle</Button>
                            <Button onClick={() => handleShadowChange("strong")} isActive={shadow === "strong"}>Strong</Button>
                        </s-grid>
                    </s-stack>
                </CustomSection>
            </s-stack>
        </s-stack>
    )
}
