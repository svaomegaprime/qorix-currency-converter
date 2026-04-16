import CustomGridSection from "../../../essentials/CustomGridSection";
import { Text } from "@shopify/polaris";

function getLastSyncDisplay(lastSyncedAt) {
    if (!lastSyncedAt) {
        return {
            headline: "Not synced yet",
            detail: "No storefront exchange-rate sync has been recorded yet."
        };
    }

    const syncDate = new Date(lastSyncedAt);
    if (Number.isNaN(syncDate.getTime())) {
        return {
            headline: "Invalid sync time",
            detail: "The stored sync timestamp could not be parsed."
        };
    }

    const diffInMs = Date.now() - syncDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    let headline = "Just now";
    if (diffInHours > 0) {
        headline = `${diffInHours} hr${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInMinutes > 0) {
        headline = `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    return {
        headline,
        detail: syncDate.toLocaleString()
    };
}

export default function ExchangeRates({ data }) {
    const lastSync = getLastSyncDisplay(data?.exchangeMeta?.lastSyncedAt);

    return (
        <CustomGridSection
            heading="Exchange rates"
            description="Last storefront-triggered exchange-rate sync"
        >
            <s-stack gap="base">
                <s-banner tone={data?.exchangeMeta?.lastSyncedAt ? "success" : "warning"}>
                    <s-stack gap="none">
                        <Text as="h2">{lastSync.headline}</Text>
                        <s-paragraph>{lastSync.detail}</s-paragraph>
                    </s-stack>
                </s-banner>
                <s-paragraph color="subdued">
                    This updates only when a storefront visitor triggers a fresh exchange-rate request.
                </s-paragraph>
            </s-stack>
        </CustomGridSection>
    )
}
