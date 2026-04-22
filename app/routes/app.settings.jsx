import { useRouteLoaderData, useNavigation, useLoaderData, useFetcher, useActionData } from "react-router";
import { Text } from "@shopify/polaris";
import { useEffect, useState } from "react";
import Loader from "../components/essentials/Loader";
import TabButton from "../components/essentials/TabButton";
import CustomSection from "../components/essentials/CustomSection";
import StoreDefaults from "../components/pages/settings/general/StoreDefaults.jsx";
import AppBehavior from "../components/pages/settings/general/AppBehavior.jsx";
import ExchangeRates from "../components/pages/settings/general/ExchangeRates.jsx";
import WidgetPreview from "../components/pages/settings/widget/WidgetPreview.jsx";
import { useAppBridge, SaveBar } from '@shopify/app-bridge-react';
import { authenticate } from "../shopify.server";
import {
    defaultCurrencyDesign,
    defaultCurrencyGeneral,
    defaultSettingsWidget,
} from "../utils/default-settings";
import { defaultSettingsGeneral } from "../utils/store-default.server";
import { ensureAppMetafields } from "../utils/metafields.server";
import { getCurrencyFormats } from "../utils/currency.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    
    const currencyFormats = await getCurrencyFormats(admin);

    const { currentAppInstallationId, metafieldMap } = await ensureAppMetafields(admin, [
        "settings_general",
        "settings_widget"
    ]);
    const response = await admin.graphql(
        `#graphql
        query ShopAndAppMetafields {
            shop {
                myshopifyDomain
                name
                primaryDomain {
                    host
                }
                url
            }
        }`
    );
    const json = await response.json();
    const shop = json.data.shop;

    return {
        shop,
        currentAppInstallationId,
        settingsGeneral: metafieldMap.settings_general || await defaultSettingsGeneral(admin),
        settingsWidget: metafieldMap.settings_widget || defaultSettingsWidget,
        exchangeMeta: metafieldMap.exchange_meta || null,
        currencyFormats
    };
};

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();

    const currentAppInstallationId = formData.get("currentAppInstallationId");
    const generalSettings = formData.get("generalSettings");
    const widgetSettings = formData.get("widgetSettings");
    const actionType = formData.get("actionType");
    const metafields = [];

    const defaultGeneralSettings = await defaultSettingsGeneral(admin);
    if (actionType === "reset_all_settings" && currentAppInstallationId) {

        metafields.push(
            {
                ownerId: currentAppInstallationId,
                namespace: "currency_converter",
                key: "settings_general",
                type: "json",
                value: JSON.stringify(defaultGeneralSettings)
            },
            {
                ownerId: currentAppInstallationId,
                namespace: "currency_converter",
                key: "settings_widget",
                type: "json",
                value: JSON.stringify(defaultSettingsWidget)
            },
            {
                ownerId: currentAppInstallationId,
                namespace: "currency_converter",
                key: "currency_general",
                type: "json",
                value: JSON.stringify(defaultCurrencyGeneral)
            },
            {
                ownerId: currentAppInstallationId,
                namespace: "currency_converter",
                key: "currency_design",
                type: "json",
                value: JSON.stringify(defaultCurrencyDesign)
            }
        );
    }

    if (generalSettings && currentAppInstallationId) {
        metafields.push({
            ownerId: currentAppInstallationId,
            namespace: "currency_converter",
            key: "settings_general",
            type: "json",
            value: generalSettings
        });
    }
    if (widgetSettings && currentAppInstallationId) {
        metafields.push({
            ownerId: currentAppInstallationId,
            namespace: "currency_converter",
            key: "settings_widget",
            type: "json",
            value: widgetSettings
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

    return defaultGeneralSettings;
};

export default function Settings() {
    const { appName } = useRouteLoaderData("routes/app");
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const { shop, currentAppInstallationId, settingsGeneral, settingsWidget, exchangeMeta, currencyFormats } = loaderData;
    const fetcher = useFetcher();
    const [activeTab, setActiveTab] = useState("general");
    const shopify = useAppBridge();

    function showSaveBar() {
        shopify.saveBar.show('save-bar');
    }

    const [generalSettings, setGeneralSettings] = useState(settingsGeneral);
    const [widgetSettings, setWidgetSettings] = useState(settingsWidget);

    const handleSave = () => {
        fetcher.submit(
            {
                generalSettings: JSON.stringify(generalSettings),
                widgetSettings: JSON.stringify(widgetSettings),
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

    const handleClearVisitorPreferences = () => {
        const updatedGeneralSettings = {
            ...generalSettings,
            appBehavior: {
                ...generalSettings.appBehavior,
                visitorPreferenceVersion: (generalSettings.appBehavior?.visitorPreferenceVersion || 1) + 1
            }
        };

        setGeneralSettings(updatedGeneralSettings);
        fetcher.submit(
            {
                actionType: "clear_visitor_preferences",
                generalSettings: JSON.stringify(updatedGeneralSettings),
                currentAppInstallationId
            },
            { method: "post" }
        );
        shopify.saveBar.hide('save-bar');
        shopify.toast.show({
            message: "Visitor preferences cleared",
            duration: 2000,
        });
    };

    const handleResetAllSettings = () => {
        fetcher.submit(
            {
                actionType: "reset_all_settings",
                currentAppInstallationId
            },
            { method: "post" }
        );
        shopify.saveBar.hide('save-bar');
        shopify.toast.show({
            message: "All settings reset to default",
            duration: 2000,
        });
    };

    useEffect(() => {
        if(fetcher.data) {
            setGeneralSettings(fetcher.data);
            setWidgetSettings(defaultSettingsWidget);
        }
    }, [fetcher.data]);

    const handleDiscard = () => {
        setGeneralSettings(settingsGeneral);
        setWidgetSettings(settingsWidget);
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
        } else if (event.target === "widget") {
            setWidgetSettings((prev) => ({
                ...prev,
                [event.subTarget]: event.value
            }));
        } else {
            console.log("Something went wrong with the assigned target:", event.target);
        }

        // Let the user know changes have been made and need saving
        showSaveBar();
    }
    const storeDefaultCurrency = currencyFormats?.shop?.currencyCode?.toLowerCase();
    return (
        <s-page heading={`${appName}`}>
            <SaveBar id="save-bar">
                <button variant="primary" onClick={handleSave}>Save</button>
                <button onClick={handleDiscard}>Discard</button>
            </SaveBar>
            <s-stack direction="inline" gap="base" alignItems="center" justifyContent="space-between" paddingBlockEnd="base">
                <Text as="h2">Settings</Text>
                <s-button variant="primary" icon="store" href={`https://${shop?.primaryDomain?.host}`} target="_blank">View store</s-button>
            </s-stack>

            <s-section>
                <s-grid gridTemplateColumns="180px 180px" gap="small">
                    <TabButton onClick={() => setActiveTab("general")} isActive={activeTab === "general"}>
                        General
                    </TabButton>
                    <TabButton onClick={() => setActiveTab("widget")} isActive={activeTab === "widget"}>
                        Widget preview
                    </TabButton>
                </s-grid>
                {/* this is for empty space start */}
                <s-stack paddingBlock="large">
                </s-stack>
                {/* this is for empty space end */}

                {/* general section start */}
                {activeTab === "general" && (
                    <CustomSection padding="none">
                        <StoreDefaults data={{ generalSettings, storeDefaultCurrency }} handleChange={handleChange} />
                        <s-stack paddingInlineEnd="large"><s-divider /></s-stack>
                        <AppBehavior data={{ generalSettings }} handleChange={handleChange} />
                        <s-stack paddingInlineEnd="large"><s-divider /></s-stack>
                        <ExchangeRates data={{ generalSettings, exchangeMeta }} handleChange={handleChange} />
                        <s-stack paddingInlineEnd="large"><s-divider /></s-stack>

                        <s-stack padding="large">
                            <CustomSection>
                                <s-stack gap="base">
                                    <div style={{ background: "#FF4C6E", color: "#fff", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
                                        Danger Zone
                                    </div>

                                    <CustomSection>
                                        <s-query-container>
                                            <s-grid gridTemplateColumns="@container (inline-size > 560px) 1fr auto, 1fr" gap="base" alignItems="center">
                                                <s-stack gap="small">
                                                    <s-heading>Reset all settings</s-heading>
                                                    <s-paragraph color="subdued">
                                                        Restores all currency, and widget settings to their defaults. Your active currency selections will be cleared.
                                                    </s-paragraph>
                                                </s-stack>
                                                <s-button variant="primary" onClick={handleResetAllSettings}>
                                                    Reset settings
                                                </s-button>
                                            </s-grid>
                                        </s-query-container>
                                    </CustomSection>

                                    <CustomSection>
                                        <s-query-container>
                                            <s-grid gridTemplateColumns="@container (inline-size > 560px) 1fr auto, 1fr" gap="base" alignItems="center">
                                                <s-stack gap="small">
                                                    <s-heading>Clear visitor preference cookies</s-heading>
                                                    <s-paragraph color="subdued">
                                                        Removes all saved currency preferences from visitor browsers on next page load.
                                                    </s-paragraph>
                                                </s-stack>
                                                <s-button variant="primary" onClick={handleClearVisitorPreferences}>
                                                    Clear cookies
                                                </s-button>
                                            </s-grid>
                                        </s-query-container>
                                    </CustomSection>

                                    {/*<CustomSection>
                                        <s-query-container>
                                            <s-grid gridTemplateColumns="@container (inline-size > 560px) 1fr auto, 1fr" gap="base" alignItems="center">
                                                <s-stack gap="small">
                                                    <s-heading>Uninstall app data</s-heading>
                                                    <s-paragraph color="subdued">
                                                        This action is currently disabled to prevent app-breaking metafield deletion.
                                                    </s-paragraph>
                                                </s-stack>
                                                <s-button variant="primary" disabled>
                                                    Coming soon
                                                </s-button>
                                            </s-grid>
                                        </s-query-container>
                                    </CustomSection>*/}

                                    <s-stack>
                                        <div style={{ display: "flex", flexWrap: "nowrap", gap: "6px", background: "#FFF7EB", borderRadius: "8px", overflow: "hidden", padding: "8px" }}>
                                            <s-icon type="alert-circle" tone="critical" />
                                            <s-paragraph tone="critical">
                                                Please proceed with caution. Actions are permanent and cannot be undone. Double-check before proceeding, especially when deleting data.
                                            </s-paragraph>
                                        </div>
                                    </s-stack>
                                </s-stack>
                            </CustomSection>
                        </s-stack>
                    </CustomSection>
                )}
                {/* general section end */}

                {/* widget preview section start */}
                {activeTab === "widget" && (
                    <CustomSection>
                        <WidgetPreview data={{ generalSettings, widgetSettings }} handleChange={handleChange} />
                    </CustomSection>
                )}
                {/* widget preview section end */}
            </s-section>
        </s-page>
    );
}
