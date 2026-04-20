import { useState, useEffect } from "react";
import { useRevalidator } from "react-router";
import ProgressiveBar from "./elements/ProgressiveBar";
import SetupGuideItem from "./elements/SetupGuideItem";
import CopyCurrencyEmbed from "./elements/CopyCurrencyEmbed";

export default function SetupGuide({ data, handleUpdate }) {
    const { loaderData, apiKey } = data;
    const embedStatus = loaderData.embedStatus;
    const currencyFormats = loaderData.currencyFormats;
    const [isActivated, setIsActivated] = useState("item1");
    const revalidator = useRevalidator();
    const [activationProgress, setActivationProgress] = useState(false);

    // default values from app start
    const defaultMoneyFormat = `<span class='money' data-amount='{{amount}}'>${`{{amount}}`}</span>`;
    const defaultMoneyWithCurrencyFormat = `<span class='money' data-amount='{{amount}}'>${`{{amount}}`} ${currencyFormats?.currencyCode}</span>`;
    // default values from app end

    // handling revalidate start
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && activationProgress) {
                revalidator.revalidate();
                setActivationProgress(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [activationProgress, revalidator]);
    // handling revalidate end

    // toggling items start
    const handleToggle = (item) => {
        setIsActivated(item);
    }
    // toggling items end

    // handling money format start
    function decodeHtml(html) {
        if (typeof document === "undefined") return html || "";
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const [isMoneyFormatUpdated, setIsMoneyFormatUpdated] = useState(() => {
        if (typeof document === "undefined") return false;
        return decodeHtml(currencyFormats?.currencyFormats?.moneyFormat) === defaultMoneyFormat && decodeHtml(currencyFormats?.currencyFormats?.moneyWithCurrencyFormat) === defaultMoneyWithCurrencyFormat;
    });

    useEffect(() => {
        setIsMoneyFormatUpdated(decodeHtml(currencyFormats?.currencyFormats?.moneyFormat) === defaultMoneyFormat && decodeHtml(currencyFormats?.currencyFormats?.moneyWithCurrencyFormat) === defaultMoneyWithCurrencyFormat);
    }, [currencyFormats, defaultMoneyFormat, defaultMoneyWithCurrencyFormat]);

    const [checkPhase, setCheckPhase] = useState("idle");
    const isCheckingMoneyFormat = checkPhase !== "idle";
    const [hasCheckedMoneyFormat, setHasCheckedMoneyFormat] = useState(false);

    const handleCheckMoneyFormat = () => {
        setHasCheckedMoneyFormat(false);
        setCheckPhase("starting");
        revalidator.revalidate();
    };

    useEffect(() => {
        if (checkPhase === "starting" && revalidator.state === "loading") {
            setCheckPhase("loading");
        } else if (checkPhase === "loading" && revalidator.state === "idle") {
            setCheckPhase("idle");
            if (decodeHtml(currencyFormats?.currencyFormats?.moneyFormat) === defaultMoneyFormat && decodeHtml(currencyFormats?.currencyFormats?.moneyWithCurrencyFormat) === defaultMoneyWithCurrencyFormat) {
                setIsMoneyFormatUpdated(true);
                setIsActivated("item3");
            } else {
                setIsMoneyFormatUpdated(false);
            }
            setHasCheckedMoneyFormat(true);
        }
    }, [checkPhase, revalidator.state, currencyFormats, defaultMoneyFormat, defaultMoneyWithCurrencyFormat]);
    // handling money format end

    // handling count of steps completed start
    let completedStesp = embedStatus === "ENABLED" ? 1 : 0;
    if (isMoneyFormatUpdated) {
        completedStesp += 1;
    }
    useEffect(() => {
        if (embedStatus === "ENABLED") {
            handleUpdate({ isAppEnabled: true });
        } else {
            handleUpdate({ isAppEnabled: false });
        }
    }, [embedStatus, handleUpdate, completedStesp]);
    // handling count of steps completed end
    const [step3Completed, setStep3Completed] = useState(false);
    const [step3CheckPhase, setStep3CheckPhase] = useState("idle");

    useEffect(() => {
        const getLocalStorage = localStorage.getItem("step3Completed");
        if (getLocalStorage) {
            setStep3Completed(true);
        }
    }, []);

    if (step3Completed) {
        completedStesp += 1;
    }

    const handleStep3Completed = () => {
        setStep3CheckPhase("starting");
        revalidator.revalidate();
    }

    useEffect(() => {
        if (step3CheckPhase === "starting" && revalidator.state === "loading") {
            setStep3CheckPhase("loading");
        } else if (step3CheckPhase === "loading" && revalidator.state === "idle") {
            setStep3CheckPhase("idle");
            localStorage.setItem("step3Completed", "true");
            setStep3Completed(true);
        }
    }, [step3CheckPhase, revalidator.state]);

    useEffect(() => {
        if (embedStatus !== "ENABLED") {
            setIsActivated("item1");
        } else if (!isMoneyFormatUpdated) {
            setIsActivated("item2");
        } else if (!step3Completed) {
            setIsActivated("item3");
        } else {
            setIsActivated("item4");
        }
    }, [embedStatus, isMoneyFormatUpdated, step3Completed]);

    const url = `https://${loaderData?.shop?.myshopifyDomain}/admin/themes/current/editor?context=apps&template=index&activateAppId=${apiKey}/qorix-currency-converter-embed`;
    return (
        <>
            <s-section>
                <s-stack gap="base">
                    <ProgressiveBar step={completedStesp} totalSteps={3} />
                    <SetupGuideItem
                        title="Activate app"
                        description="Enable app features by clicking the Activate button below."
                        isActivated={isActivated === "item1"}
                        onToggle={() => handleToggle("item1")}
                        isCompleted={embedStatus === "ENABLED"}
                    >
                        <s-stack direction="inline" alignItems="center" gap="base">
                            <s-button
                                variant="primary"
                                href={url}
                                target="_blank"
                                disabled={embedStatus === "ENABLED"}
                                onClick={() => setActivationProgress(true)}
                            >
                                {embedStatus === "ENABLED" ? "Activated" : "Activate"}
                            </s-button>
                            {embedStatus !== "ENABLED" && (
                                <s-button
                                    variant="secondary"
                                    loading={revalidator.state === "loading" ? "true" : undefined}
                                    onClick={() => revalidator.revalidate()}
                                >
                                    Verify Status
                                </s-button>
                            )}
                        </s-stack>
                    </SetupGuideItem>
                    <SetupGuideItem
                        title="Set up money format"
                        description="Update your Shopify theme's price format so currency conversion works correctly."
                        isActivated={isActivated === "item2"}
                        onToggle={() => handleToggle("item2")}
                        isCompleted={isMoneyFormatUpdated}
                    >
                        <s-ordered-list>
                            <s-list-item>
                                Go to <b>Shopify Admin → Settings → General</b>
                            </s-list-item>
                            <s-list-item>
                                Under <b>Store defaults, click Change formatting</b>
                            </s-list-item>
                            <s-list-item>
                                Copy and paste the formats below into the respective fields
                            </s-list-item>
                            <s-list-item>
                                Click <b>Save</b> to apply changes
                            </s-list-item>
                        </s-ordered-list>
                        <s-grid paddingBlockStart="small" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap="base large">
                            <CopyCurrencyEmbed title="HTML with currency" value={`<span class='money' data-amount='{{amount}}'>${`{{amount}}`} ${currencyFormats?.currencyCode}</span>`} />
                            <CopyCurrencyEmbed title="HTML without currency" value={`<span class='money' data-amount='{{amount}}'>${`{{amount}}`}</span>`} />
                        </s-grid>
                        <s-stack paddingBlockStart="small">
                            {hasCheckedMoneyFormat && !isMoneyFormatUpdated && (
                                <s-stack>
                                    <s-query-container>
                                        <s-grid gridTemplateColumns="@container (inline-size > 490px) '1fr 1fr', 1fr" gap="@container (inline-size > 490px) 'base large', small">
                                            <s-banner heading="Current money format" tone="critical">
                                                <div style={{ display: "grid", gap: "5px", padding: "7px 0" }}>
                                                    <s-text-field readOnly label="HTML with currency" value={`${decodeHtml(currencyFormats?.currencyFormats?.moneyWithCurrencyFormat) || ''}`} />
                                                    <s-text-field readOnly label="HTML without currency" value={`${decodeHtml(currencyFormats?.currencyFormats?.moneyFormat) || ''}`} />
                                                </div>
                                            </s-banner>
                                            <s-banner heading="Change to this money format" tone="success">
                                                <div style={{ display: "grid", gap: "5px", padding: "7px 0" }}>
                                                    <s-text-field readOnly label="HTML with currency" value="<span class='money' data-amount='{{amount}}'>{{amount}} USD</span>" />
                                                    <s-text-field readOnly label="HTML without currency" value="<span class='money' data-amount='{{amount}}'>{{amount}}</span>" />
                                                </div>
                                            </s-banner>
                                        </s-grid>
                                    </s-query-container>
                                </s-stack>
                            )}
                            <s-button variant="secondary" loading={isCheckingMoneyFormat} onClick={handleCheckMoneyFormat} disabled={isMoneyFormatUpdated}>
                                Next, I have done this
                            </s-button>
                        </s-stack>
                    </SetupGuideItem>
                    <SetupGuideItem
                        title="Select currencies"
                        description="Choose which currencies your store should support."
                        isActivated={isActivated === "item3"}
                        onToggle={() => handleToggle("item3")}
                        isCompleted={step3Completed}
                    >
                        <s-stack direction="inline" gap="small" alignItems="center" paddingBlockEnd="small">
                            <s-button variant="primary" icon="currency-convert" href="/app/currency">Go to currency</s-button>
                        </s-stack>
                        <s-button onClick={handleStep3Completed} loading={step3CheckPhase !== "idle"} disabled={step3Completed} variant="secondary">
                            Next, I have done this
                        </s-button>
                    </SetupGuideItem>
                </s-stack>
            </s-section>
        </>
    );
}