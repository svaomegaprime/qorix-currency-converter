import CustomGridSection from "../../../essentials/CustomGridSection";
import CustomSection from "../../../essentials/CustomSection";
import { Text } from "@shopify/polaris";

function getLastSyncDisplay(lastSyncedAt) {
    if (!lastSyncedAt) {
        return {
            headline: "Not synced yet",
            detail: "No storefront exchange-rate sync has been recorded yet.",
            badge: { tone: "warning", text: "Waiting" }
        };
    }

    const syncDate = new Date(lastSyncedAt);
    if (Number.isNaN(syncDate.getTime())) {
        return {
            headline: "Invalid sync time",
            detail: "The stored sync timestamp could not be parsed.",
            badge: { tone: "warning", text: "Unknown" }
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
        detail: syncDate.toLocaleString(),
        badge: { tone: "success", text: "Synced" }
    };
}

export default function ExchangeRates({ data }) {
    const lastSync = getLastSyncDisplay(data?.exchangeMeta?.lastSyncedAt);

    return (
        <CustomGridSection
            heading="Exchange rates"
            description="Last storefront-triggered exchange-rate sync"
            badge={lastSync.badge}
        >
            <CustomSection>
                <s-stack gap="base">
                    <CustomSection>
                        <s-paragraph color="subdued">Last synced</s-paragraph>
                        <s-stack>
                            <Text as="h2">{lastSync.headline}</Text>
                            <p style={{ color: "#00BF7A", padding: "0", margin: "0", marginTop: "-8px" }}>
                                {lastSync.detail}
                            </p>
                        </s-stack>
                    </CustomSection>
                    <s-stack borderRadius="base" overflow="hidden" background="subdued" padding="small">
                        <s-grid gridTemplateColumns="auto 1fr" gap="small">
                            <s-icon type="alert-circle" tone="critical" />
                            <s-paragraph>
                                This timestamp updates when a storefront visitor triggers a fresh exchange-rate request.
                            </s-paragraph>
                        </s-grid>
                    </s-stack>
                </s-stack>
            </CustomSection>
        </CustomGridSection>
    )
}
