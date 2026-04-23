import CustomSection from "../../../essentials/CustomSection";
import CustomGridSection from "../../../essentials/CustomGridSection";
import { useState } from "react";

export default function Behavior({ handleChange, data }) {
    const { behavior } = data.designSettings;
    const [darkModeSupport, setDarkModeSupport] = useState(behavior?.darkModeSupport);
    const [showCurrencyNameOnHover, setShowCurrencyNameOnHover] = useState(behavior?.showCurrencyNameOnHover);
    const [showOriginalPriceOnHover, setShowOriginalPriceOnHover] = useState(behavior?.showOriginalPriceOnHover);
    // handling dark mode support
    const handleDarkModeSupportChange = (e) => {
        const updated = !darkModeSupport;
        setDarkModeSupport(updated);
        handleChange(
            {
                target: "design",
                subTarget: "behavior",
                value: {
                    ...behavior,
                    darkModeSupport: updated
                }
            }
        );
    }
    // handling show currency name on hover
    const handleShowCurrencyNameOnHoverChange = (e) => {
        const updated = !showCurrencyNameOnHover;
        setShowCurrencyNameOnHover(updated);
        handleChange(
            {
                target: "design",
                subTarget: "behavior",
                value: {
                    ...behavior,
                    showCurrencyNameOnHover: updated
                }
            }
        );
    }
    // handling show original price on hover
    const handleShowOriginalPriceOnHoverChange = (e) => {
        const updated = !showOriginalPriceOnHover;
        setShowOriginalPriceOnHover(updated);
        handleChange(
            {
                target: "design",
                subTarget: "behavior",
                value: {
                    ...behavior,
                    showOriginalPriceOnHover: updated
                }
            }
        );
    }
    return (
        <CustomGridSection
            heading="Behavior"
            description="Additional display options for the widget"
        >
            <CustomSection>
                <s-stack gap="small">
                    <s-switch checked={darkModeSupport} onChange={handleDarkModeSupportChange} label="Dark mode support" details="Auto-matches store dark theme" />
                    {/* <s-switch checked={showCurrencyNameOnHover} onChange={handleShowCurrencyNameOnHoverChange} label="Show currency name on hover" details="Tooltip showing full currency name" /> */}
                    <s-switch checked={showOriginalPriceOnHover} onChange={handleShowOriginalPriceOnHoverChange} label="Show original price on hover" details="Displays base price on mouseover on product page only" />
                </s-stack>
            </CustomSection>
        </CustomGridSection>
    )
}