import { useState } from "react";
import CustomSection from "../../../../essentials/CustomSection";
import CustomRange from "../elements/CustomRange";

export default function OffsetFromEdge({ data, handleChange }) {
    const [horizontal, setHorizontal] = useState(data.widgetSettings.offsetFromEdge.horizontal);
    const [vertical, setVertical] = useState(data.widgetSettings.offsetFromEdge.vertical);
    const handleHorizontal = (event) => {
        setHorizontal(event);
        handleChange({
            target: "widget",
            subTarget: "offsetFromEdge",
            value: {
                horizontal: event,
                vertical: vertical
            }
        });
    }
    const handleVertical = (event) => {
        setVertical(event);
        handleChange({
            target: "widget",
            subTarget: "offsetFromEdge",
            value: {
                horizontal: horizontal,
                vertical: event
            }
        });
    }
    return (
        <s-stack gap="small">
            <s-heading>Offset from edge</s-heading>
            <s-stack gap="base">
                <CustomSection>
                    <CustomRange
                        label="Horizontal"
                        max={200}
                        defaultValue={horizontal}
                        onChange={handleHorizontal}
                    />
                </CustomSection>
                <CustomSection>
                    <CustomRange
                        label="Vertical"
                        max={200}
                        defaultValue={vertical}
                        onChange={handleVertical}
                    />
                </CustomSection>
            </s-stack>
        </s-stack>
    )
}