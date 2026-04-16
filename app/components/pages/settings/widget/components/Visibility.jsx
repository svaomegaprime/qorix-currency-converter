import { useState } from "react";

export default function Visibility({ data, handleChange }) {
    const [enableOnDesktop, setEnableOnDesktop] = useState(data.widgetSettings.visibility.enableOnDesktop);
    const [enableOnMobile, setEnableOnMobile] = useState(data.widgetSettings.visibility.enableOnMobile);
    const handleEnableOnDesktop = () => {
        const updated = !enableOnDesktop;
        setEnableOnDesktop(updated);
        handleChange({
            target: "widget",
            subTarget: "visibility",
            value: {
                ...data.widgetSettings.visibility,
                enableOnDesktop: updated
            }
        });
    }
    const handleEnableOnMobile = () => {
        const updated = !enableOnMobile;
        setEnableOnMobile(updated);
        handleChange({
            target: "widget",
            subTarget: "visibility",
            value: {
                ...data.widgetSettings.visibility,
                enableOnMobile: updated
            }
        });
    }
    return (
        <div style={{ display: "grid", gap: "7px" }}>
            <div style={{ display: "grid", gap: "3px" }}>
                <s-heading>Visibility</s-heading>
                <s-paragraph color="subdued">
                    You can control the visibility of the widget on different devices.
                </s-paragraph>
            </div>
            <div style={{ display: "grid", gap: "5px" }}>
                <s-switch
                    label="Show on desktop"
                    details=""
                    checked={enableOnDesktop}
                    onChange={handleEnableOnDesktop}
                />
                <s-switch
                    label="Show on mobile"
                    details=""
                    checked={enableOnMobile}
                    onChange={handleEnableOnMobile}
                />
            </div>
        </div>
    )
}