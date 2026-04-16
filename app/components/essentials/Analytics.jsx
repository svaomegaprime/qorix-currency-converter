import Li from "./elements/Li";
import { Text } from "@shopify/polaris";

export default function Analytics({ data, onToggleCurrencyStatus, isTogglingCurrencyStatus = false }) {
    const analytics = data?.analytics || {};
    const featureStatus = data?.featureStatus || {};
    const formattedSessions = new Intl.NumberFormat("en-US").format(analytics.sessionsThisWeek || 0);
    const formattedSwitches = new Intl.NumberFormat("en-US").format(analytics.currencySwitches || 0);
    const currentWeekSwitches = analytics.currencySwitchesThisWeek || 0;
    const previousWeekSwitches = analytics.currencySwitchesPreviousWeek || 0;

    let switchTrendLabel = "No switches yet";
    let switchTrendTone = "subdued";

    if (previousWeekSwitches > 0) {
        const percentageChange = Math.round(((currentWeekSwitches - previousWeekSwitches) / previousWeekSwitches) * 100);

        if (percentageChange > 0) {
            switchTrendLabel = `+ ${percentageChange}% vs last week`;
            switchTrendTone = "success";
        } else if (percentageChange < 0) {
            switchTrendLabel = `- ${Math.abs(percentageChange)}% vs last week`;
            switchTrendTone = "critical";
        } else {
            switchTrendLabel = "No change vs last week";
        }
    } else if (currentWeekSwitches > 0) {
        switchTrendLabel = `${currentWeekSwitches} switch${currentWeekSwitches > 1 ? "es" : ""} this week`;
        switchTrendTone = "success";
    }

    return (
        <s-stack paddingBlockEnd="base">
            <s-query-container>
                <s-grid gap="base" gridTemplateColumns="@container (inline-size > 500px) '2fr 2fr 3fr', '1fr'">
                    <s-grid-item>
                        <s-box>
                            <s-section>
                                <s-stack
                                    direction="inline"
                                    gap="small"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <s-heading>Sessions this week</s-heading>
                                    <s-icon type="eye-check-mark" />
                                </s-stack>
                                <Text as="h2">{formattedSessions}</Text>
                                <s-paragraph color="subdued">
                                    Unique storefront visitors who triggered the converter this week
                                </s-paragraph>
                            </s-section>
                        </s-box>
                    </s-grid-item>

                    <s-grid-item>
                        <s-box>
                            <s-section>
                                <s-stack
                                    direction="inline"
                                    gap="small"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <s-heading>Currency switches</s-heading>
                                    <s-icon type="currency-convert" />
                                </s-stack>
                                <Text as="h2">{formattedSwitches}</Text>
                                <s-paragraph tone={switchTrendTone}>{switchTrendLabel}</s-paragraph>
                            </s-section>
                        </s-box>
                    </s-grid-item>

                    <s-grid-item>
                        <s-box>
                            <s-section>
                                <s-heading>Feature status</s-heading>
                                <s-stack gap="base" paddingBlockStart="small">
                                    <s-grid gridTemplateColumns="50px 1fr auto" gap="small">
                                        <s-stack
                                            alignItems="center"
                                            justifyContent="center"
                                            background="subdued"
                                            borderRadius="base"
                                        >
                                            <s-icon type="currency-convert" />
                                        </s-stack>
                                        <s-stack>
                                            <s-heading>Currency conversion</s-heading>
                                            <s-stack
                                                direction="inline"
                                                alignItems="center"
                                                gap="none large"
                                            >
                                                {featureStatus.activeCurrenciesCount || 0} currencies
                                                <Li>{featureStatus.locationDetection ? "Auto detect on" : "Auto detect off"}</Li>
                                            </s-stack>
                                        </s-stack>
                                        <s-switch
                                            checked={Boolean(featureStatus.enableCurrency)}
                                            disabled={isTogglingCurrencyStatus}
                                            onChange={onToggleCurrencyStatus}
                                        />
                                    </s-grid>
                                </s-stack>
                            </s-section>
                        </s-box>
                    </s-grid-item>
                </s-grid>
            </s-query-container>
        </s-stack>
    );
}
