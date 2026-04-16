import Button from "../elements/Button"
import CustomSection from "../../../../essentials/CustomSection"
import { useState } from "react"

export default function Position({ data, handleChange }) {
    const [position, setPosition] = useState(data.widgetSettings.position);
    const [customSelector, setCustomSelector] = useState(data.widgetSettings.customSelector);
    const handlePositionChange = (event) => {
        setPosition(event);
        handleChange({
            target: "widget",
            subTarget: "position",
            value: event
        });
    }
    const handleCustomSelectorInput = (event) => {
        setCustomSelector(event.target.value);
        handleChange({
            target: "widget",
            subTarget: "customSelector",
            value: event.target.value
        });
    }
    return (
        <div style={{ display: "grid", gap: "7px" }}>
            <div style={{ display: "grid", gap: "5px" }}>
                <s-heading>Position</s-heading>
                <s-paragraph color="subdued">Where the widget floats on screen</s-paragraph>
            </div>
            <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="small">
                <Button isActive={position == "top_left"} onClick={() => handlePositionChange("top_left")}>
                    •
                </Button>
                <Button isActive={position == "top_center"} onClick={() => handlePositionChange("top_center")}>
                    •
                </Button>
                <Button isActive={position == "top_right"} onClick={() => handlePositionChange("top_right")}>
                    •
                </Button>
                <Button isActive={position == "middle_left"} onClick={() => handlePositionChange("middle_left")}>
                    •
                </Button>
                <Button disabled={true}>
                    •
                </Button>
                <Button isActive={position == "middle_right"} onClick={() => handlePositionChange("middle_right")}>
                    •
                </Button>
                <Button isActive={position == "bottom_left"} onClick={() => handlePositionChange("bottom_left")}>
                    •
                </Button>
                <Button isActive={position == "bottom_center"} onClick={() => handlePositionChange("bottom_center")}>
                    •
                </Button>
                <Button isActive={position == "bottom_right"} onClick={() => handlePositionChange("bottom_right")}>
                    •
                </Button>
            </s-grid>

            <s-stack paddingBlockStart="small">
                <CustomSection background="#F5F7F9">
                    <s-stack paddingBlockEnd="small">
                        <s-heading>Custom selector</s-heading>
                        <s-paragraph color="subdued">Inject into any element using a CSS selector</s-paragraph>
                    </s-stack>
                    <s-text-field placeholder="(e.g. #custom-selector)" value={customSelector} onInput={handleCustomSelectorInput} />
                </CustomSection>
            </s-stack>
        </div >
    )
}