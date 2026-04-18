import { useRouteLoaderData, useNavigation, useLoaderData, useFetcher } from "react-router";
import { Text } from "@shopify/polaris";
import { useEffect, useState } from "react";
import TabButton from "../components/essentials/TabButton";
import CustomSection from "../components/essentials/CustomSection";
import Loader from "../components/essentials/Loader";
import ActiveCurrencies from "../components/pages/currency/general/ActiveCurrencies.jsx";
import ExchangeRates from "../components/pages/currency/general/ExchangeRates.jsx";
import LocationDetection from "../components/pages/currency/general/LocationDetection.jsx";
import PriceDisplayFormat from "../components/pages/currency/general/PriceDisplayFormat.jsx";
import DisplayMode from "../components/pages/currency/design/DisplayMode.jsx";
import FlagStyle from "../components/pages/currency/design/FlagStyle.jsx";
import Behavior from "../components/pages/currency/design/Behavior.jsx";
import { useAppBridge, SaveBar } from '@shopify/app-bridge-react';
import currencies from "../assets/data/currencies.json";
import { authenticate } from "../shopify.server";
import {
    defaultCurrencyDesign,
    defaultCurrencyGeneral,
    defaultSettingsGeneral,
} from "../utils/default-settings";
import { ensureAppMetafields } from "../utils/metafields.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const { currentAppInstallationId, metafieldMap } = await ensureAppMetafields(admin, [
        "currency_general",
        "currency_design",
        "settings_general"
    ]);

    return {
        currentAppInstallationId,
        currencyGeneral: metafieldMap.currency_general || defaultCurrencyGeneral,
        currencyDesign: metafieldMap.currency_design || defaultCurrencyDesign,
        settingsGeneral: metafieldMap.settings_general || defaultSettingsGeneral,
        exchangeMeta: metafieldMap.exchange_meta || null
    };
};

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();

    const currentAppInstallationId = formData.get("currentAppInstallationId");
    const generalSettings = formData.get("generalSettings");
    const designSettings = formData.get("designSettings");
    const appSettings = formData.get("appSettings");

    const metafields = [];
    if (generalSettings && currentAppInstallationId) {
        metafields.push({
            ownerId: currentAppInstallationId,
            namespace: "currency_converter",
            key: "currency_general",
            type: "json",
            value: generalSettings
        });
    }
    if (designSettings && currentAppInstallationId) {
        metafields.push({
            ownerId: currentAppInstallationId,
            namespace: "currency_converter",
            key: "currency_design",
            type: "json",
            value: designSettings
        });
    }
    if (appSettings && currentAppInstallationId) {
        metafields.push({
            ownerId: currentAppInstallationId,
            namespace: "currency_converter",
            key: "settings_general",
            type: "json",
            value: appSettings
        });
    }

    if (metafields.length === 0) return null;

    const response = await admin.graphql(
        `#graphql
        mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
            metafieldsSet(metafields: $metafields) {
                userErrors {
                    field
                    message
                }
            }
        }`,
        { variables: { metafields } }
    );

    return await response.json();
};

export default function Currency() {
    const shopify = useAppBridge();
    const { appName } = useRouteLoaderData("routes/app");
    const loaderData = useLoaderData();
    const { currentAppInstallationId, currencyGeneral, currencyDesign, settingsGeneral, exchangeMeta } = loaderData;
    const fetcher = useFetcher();
    const [activeTab, setActiveTab] = useState("general");

    function showSaveBar() {
        shopify.saveBar.show('save-bar');
    }
    const [generalSettings, setGeneralSettings] = useState(currencyGeneral);
    const [designSettings, setDesignSettings] = useState(currencyDesign);
    const [appSettings, setAppSettings] = useState(settingsGeneral);

    const handleSave = () => {
        fetcher.submit(
            {
                generalSettings: JSON.stringify(generalSettings),
                designSettings: JSON.stringify(designSettings),
                currentAppInstallationId
            },
            { method: "post" }
        );
        shopify.saveBar.hide('save-bar');
        shopify.toast.show({
            message: "Settings saved",
            duration: 2000,
        });
    };

    const handleDiscard = () => {
        setGeneralSettings(currencyGeneral);
        setDesignSettings(currencyDesign);
        setAppSettings(settingsGeneral);
        shopify.saveBar.hide('save-bar');
        shopify.toast.show({
            message: "Changes discarded",
            duration: 2000,
        });
    };
    const handleChange = (event) => {
        if (event.target === "general") {
            setGeneralSettings((prev) => ({
                ...prev,
                [event.subTarget]: event.value
            }));
        } else if (event.target === "design") {
            setDesignSettings((prev) => ({
                ...prev,
                [event.subTarget]: event.value
            }));
        } else {
            console.log("Something went wrong with the assigned target:", event.target);
        }

        // Let the user know changes have been made and need saving
        showSaveBar();
    }

    const isCurrencyEnabled = appSettings?.appBehavior?.enableCurrency;

    const handleToggleCurrencyStatus = () => {
        const updatedAppSettings = {
            ...appSettings,
            appBehavior: {
                ...appSettings.appBehavior,
                enableCurrency: !isCurrencyEnabled
            }
        };

        setAppSettings(updatedAppSettings);
        fetcher.submit(
            {
                appSettings: JSON.stringify(updatedAppSettings),
                currentAppInstallationId
            },
            { method: "post" }
        );
        shopify.toast.show({
            message: "Currency status updated",
            duration: 2000,
        });
    };

    return (
        <s-page heading={`${appName}`}>
            <SaveBar id="save-bar">
                <button variant="primary" onClick={handleSave}>Save</button>
                <button onClick={handleDiscard}>Discard</button>
            </SaveBar>
            <s-stack direction="inline" gap="base" alignItems="center" justifyContent="space-between" paddingBlockEnd="base">
                <Text as="h2">Currency</Text>
                <s-box>
                    <s-stack direction="inline" gap="small" alignItems="center">
                        <s-box>
                            <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                                <s-text>Currency status</s-text>
                                <s-badge tone={isCurrencyEnabled ? "success" : "neutral"}>{isCurrencyEnabled ? "On" : "Off"}</s-badge>
                                <s-icon type="question-circle" interestFor="currency-status-info--tooltip" />
                                <s-tooltip id="currency-status-info--tooltip">
                                    Turn currency conversion on or off for the storefront widget
                                </s-tooltip>
                            </div>
                        </s-box>
                        <div style={{ width: "2px", height: "16px", backgroundColor: "#d8d8d8ff", marginRight: "3px" }}></div>
                        <s-button variant="primary" onClick={handleToggleCurrencyStatus}>
                            {isCurrencyEnabled ? "Turn off" : "Turn on"}
                        </s-button>
                    </s-stack>
                </s-box>
            </s-stack>

            <s-section>
                <s-grid gridTemplateColumns="180px 180px" gap="small">
                    <TabButton onClick={() => setActiveTab("general")} isActive={activeTab === "general"}>
                        General
                    </TabButton>
                    <TabButton onClick={() => setActiveTab("design")} isActive={activeTab === "design"}>
                        Design
                    </TabButton>
                </s-grid>
                {/* this is for empty space start */}
                <s-stack paddingBlock="large">
                </s-stack>
                {/* this is for empty space end */}

                {/* general section start */}
                {activeTab === "general" && (
                    <CustomSection padding="none">
                        <ActiveCurrencies handleChange={handleChange} data={{ generalSettings, currencies }} />
                        <s-stack paddingInlineEnd="large"><s-divider /></s-stack>
                        <LocationDetection handleChange={handleChange} data={{ generalSettings, currencies }} />
                        <s-stack paddingInlineEnd="large"><s-divider /></s-stack>
                        <PriceDisplayFormat handleChange={handleChange} data={{ generalSettings, currencies }} />
                        {/* <s-stack paddingInlineEnd="large"><s-divider /></s-stack> 
                        <ExchangeRates data={{ exchangeMeta }} />*/}
                    </CustomSection>
                )}
                {/* general section end */}

                {/* design section start */}
                {activeTab === "design" && (
                    <CustomSection padding="none">
                        <DisplayMode handleChange={handleChange} data={{ designSettings }} />
                        <s-stack paddingInlineEnd="large"><s-divider /></s-stack>
                        <FlagStyle handleChange={handleChange} data={{ designSettings }} />
                        <s-stack paddingInlineEnd="large"><s-divider /></s-stack>
                        <Behavior handleChange={handleChange} data={{ designSettings }} />
                    </CustomSection>
                )}
                {/* design section end */}
            </s-section>
        </s-page>
    );
}
