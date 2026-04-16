import { useState } from "react";

export default function CustomColor({
    label = "",
    defaultValue = "#000000",
    onChange
}) {
    const [color, setColor] = useState(defaultValue);
    const handleColorChange = (e) => {
        setColor(e.target.value);
        onChange(e.target.value);
    }
    const id = label !== "" ? label.toLowerCase().replace(" ", "-") : `custom-color-${Math.random().toString(36).substring(2, 9)}`;
    return (
        <div style={{ display: "grid", gap: "8px" }}>
            {label !== "" && <s-heading>{label}</s-heading>}
            <s-grid gridTemplateColumns="60px 1fr" gap="small" alignItems="stretch">
                <s-clickable borderRadius="base" overflow="hidden" border="base" commandFor={id}>
                    <div style={{ background: "#fff", padding: "3px", height: "calc(100% - 6px)" }}>
                        <div style={{ background: color, border: "1px solid #ddf", height: "calc(100% - 2px)", borderRadius: "5px" }}></div>
                    </div>
                </s-clickable>
                <s-popover id={id}>
                    <s-box padding="small">
                        <s-color-picker defaultValue={color} onInput={handleColorChange} onChange={handleColorChange} />
                    </s-box>
                </s-popover>
                <s-text-field defaultValue={color} onInput={handleColorChange} onChange={handleColorChange} />
            </s-grid>
        </div>
    )
}