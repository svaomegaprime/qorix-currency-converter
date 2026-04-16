import Button from "../elements/Button";
import { useState } from "react";

export default function WidgetType({ data, handleChange }) {
    const [widgetType, setWidgetType] = useState(data.widgetSettings.widgetType);
    const handleWidgetTypeChange = (event) => {
        setWidgetType(event);
        handleChange({
            target: "widget",
            subTarget: "widgetType",
            value: event
        });
    }
    return (
        <div style={{ display: "grid", gap: "7px" }}>
            <div style={{ display: "grid", gap: "5px" }}>
                <s-heading>Widget type</s-heading>
                <s-paragraph color="subdued">Show both switchers together or separately</s-paragraph>
            </div>
            <s-grid gridTemplateColumns="100px 100px" gap="small">
                <Button isActive={widgetType == "combined"} onClick={() => handleWidgetTypeChange("combined")}>
                    Combined
                </Button>
                <Button isActive={widgetType == "separate"} onClick={() => handleWidgetTypeChange("separate")}>
                    Separate
                </Button>
            </s-grid>
        </div>
    )
}