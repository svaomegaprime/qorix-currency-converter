import * as Flags from "country-flag-icons/react/3x2";
import { useState } from "react";

export default function Checkbox({
    label,
    checked = false,
    onChange = () => { },
    flag,
}) {
    const [isChecked, setIsChecked] = useState(checked);
    const handleUpdateCheckbox = () => {
        setIsChecked(!isChecked);
        onChange();
    }
    const FlagComponent = Flags[flag];
    return (
        <div>
            <div style={{
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "center",
                gap: "7px",
                maxWidth: "fit-content",
                width: "100%"
            }}>
                <s-checkbox checked={isChecked} onChange={handleUpdateCheckbox} />
                <div onClick={handleUpdateCheckbox} style={{ maxWidth: "fit-content", display: "flex", alignItems: "center", gap: "7px", flexWrap: "nowrap", cursor: "pointer" }}>
                    {flag && (
                        <div style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FlagComponent />
                        </div>
                    )}
                    {label && (
                        <s-text>{label}</s-text>
                    )}
                </div>
            </div>
        </div>
    );
}