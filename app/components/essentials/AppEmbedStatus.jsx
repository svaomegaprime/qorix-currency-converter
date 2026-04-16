export default function AppEmbedStatus({ isAppEnabled, activationUrl, onVerify, isVerifying }) {
    return (
        <s-section>
            <s-stack padding="small" direction="inline" gap="base" alignItems="center" justifyContent="space-between">
                <s-stack gap="small">
                    <s-stack direction="inline" gap="small" alignItems="center">
                        <s-heading>App embed status</s-heading>
                        <s-badge tone={isAppEnabled ? "success" : "warning"}>{isAppEnabled ? "Enabled" : "Setup required"}</s-badge>
                    </s-stack>
                    <s-paragraph color="subdued">Allow the app to display popups on your storefront</s-paragraph>
                </s-stack>
                <s-stack>
                    <s-stack direction="inline" gap="small">
                        <s-button
                            variant="secondary"
                            disabled={isAppEnabled}
                            href={!isAppEnabled ? activationUrl : undefined}
                            target={!isAppEnabled ? "_blank" : undefined}
                        >
                            {isAppEnabled ? "Enabled" : "Enable now"}
                        </s-button>
                        {!isAppEnabled && (
                            <s-button variant="tertiary" onClick={onVerify} loading={isVerifying ? "true" : undefined}>
                                Verify status
                            </s-button>
                        )}
                    </s-stack>
                </s-stack>
            </s-stack>
        </s-section>
    )
}
