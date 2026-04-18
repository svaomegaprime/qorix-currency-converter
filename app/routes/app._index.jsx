import { Text } from "@shopify/polaris";
import { boundary } from "@shopify/shopify-app-react-router/server";
import SetupGuide from "../components/pages/dashboard/SetupGuide.jsx";
import AppEmbedStatus from "../components/essentials/AppEmbedStatus.jsx";
import Analytics from "../components/essentials/Analytics.jsx";
import FAQ from "../components/pages/dashboard/FAQ.jsx";
import Help from "../components/pages/dashboard/Help.jsx";
import { useFetcher, useLoaderData, useRouteLoaderData } from "react-router";
import { useNavigation } from "react-router";
import { useRevalidator } from "react-router";
import Loader from "../components/essentials/Loader.jsx";

import { authenticate } from "../shopify.server";
import { getEmbedStatusForShop } from "../utils/embed.server";
import { getCurrencyFormats } from "../utils/currency.server";
import { ensureAppMetafields } from "../utils/metafields.server";
import { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  const { getAnalyticsSummary } = await import("../utils/analytics.server");
  const { admin } = await authenticate.admin(request);
  const { metafieldMap } = await ensureAppMetafields(admin, ["settings_general", "currency_general"]);
  const response = await admin.graphql(
    `#graphql
    query ShopShow {
      shop {
        myshopifyDomain
        name
        primaryDomain {
          host
        }
        url
      }
    }`,
  );

  const status = await getEmbedStatusForShop(admin, "app-embed");
  const currencyFormats = await getCurrencyFormats(admin);
  const json = await response.json();
  const shopDomain = json.data.shop.myshopifyDomain;
  const currentWeekStart = new Date();
  currentWeekStart.setHours(0, 0, 0, 0);
  currentWeekStart.setDate(currentWeekStart.getDate() - 6);
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  let analytics = {
    sessionsThisWeek: 0,
    currencySwitches: 0,
    currencySwitchesThisWeek: 0,
    currencySwitchesPreviousWeek: 0,
    manualSwitches: 0,
    autoSwitches: 0,
    topCurrency: null,
    lastSwitchAt: null,
    lastSwitchCurrency: null,
    lastSwitchSource: null,
  };

  try {
    analytics = await getAnalyticsSummary({
      shop: shopDomain,
      currentWeekStart,
      previousWeekStart,
    });
  } catch (error) {
    console.error("Analytics loader fallback triggered:", error);
  }

  return {
    shop: json.data.shop,
    embedStatus: status,
    currencyFormats: currencyFormats.shop,
    analytics,
    featureStatus: {
      enableCurrency: Boolean(metafieldMap.settings_general?.appBehavior?.enableCurrency),
      activeCurrenciesCount: metafieldMap.currency_general?.activeCurrencies?.length || 0,
      locationDetection: Boolean(metafieldMap.currency_general?.locationDetection),
    },
  };
}

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType !== "toggle_currency_status") {
    return Response.json({ ok: false }, { status: 400 });
  }

  const { currentAppInstallationId, metafieldMap } = await ensureAppMetafields(admin, ["settings_general"]);
  const nextEnabled = formData.get("enableCurrency") === "true";
  const currentSettingsGeneral = metafieldMap.settings_general || {};
  const updatedSettingsGeneral = {
    ...currentSettingsGeneral,
    appBehavior: {
      ...(currentSettingsGeneral.appBehavior || {}),
      enableCurrency: nextEnabled,
    },
  };

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
    {
      variables: {
        metafields: [
          {
            ownerId: currentAppInstallationId,
            namespace: "currency_converter",
            key: "settings_general",
            type: "json",
            value: JSON.stringify(updatedSettingsGeneral),
          },
        ],
      },
    },
  );

  const result = await response.json();
  const userErrors = result?.data?.metafieldsSet?.userErrors || [];

  if (userErrors.length) {
    return Response.json({ ok: false, userErrors }, { status: 400 });
  }

  return Response.json({ ok: true, enableCurrency: nextEnabled });
};

export default function Index() {
  // page loader start
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  if (isLoading) {
    return (
      <Loader />
    )
  }
  // page loader end

  // default loaders data start
  const { appName, apiKey } = useRouteLoaderData("routes/app");
  const loaderData = useLoaderData();
  const revalidator = useRevalidator();
  const toggleFetcher = useFetcher();
  // default loaders data end

  const [isAppEnabled, setIsAppEnabled] = useState(loaderData.embedStatus == "ENABLED");
  const activationUrl = `https://${loaderData?.shop?.myshopifyDomain}/admin/themes/current/editor?context=apps&template=index&activateAppId=${apiKey}/app-embed`;
  const optimisticEnableCurrency = toggleFetcher.formData
    ? toggleFetcher.formData.get("enableCurrency") === "true"
    : loaderData.featureStatus.enableCurrency;

  useEffect(() => {
    setIsAppEnabled(loaderData.embedStatus == "ENABLED");
  }, [loaderData.embedStatus]);

  useEffect(() => {
    if (toggleFetcher.state === "idle" && toggleFetcher.data?.ok) {
      revalidator.revalidate();
    }
  }, [toggleFetcher.state, toggleFetcher.data, revalidator]);

  // handle setup guide data start
  const setupGuideHandle = (event) => {
    setIsAppEnabled(event?.isAppEnabled);
  }
  // handle setup guide data end

  const handleVerifyEmbedStatus = () => {
    revalidator.revalidate();
  };

  const isVerifyingEmbedStatus = revalidator.state === "loading";
  const isTogglingCurrencyStatus = toggleFetcher.state !== "idle";

  const handleToggleCurrencyStatus = () => {
    toggleFetcher.submit(
      {
        actionType: "toggle_currency_status",
        enableCurrency: String(!optimisticEnableCurrency),
      },
      { method: "post" }
    );
  };

  return (
    <s-page heading={`${appName}`}>
      <s-stack direction="inline" alignItems="center" justifyContent="space-between" gap="base" paddingBlockEnd="base">
        <Text as="h2">Welcome, {loaderData?.shop?.name}</Text>
        <s-stack direction="inline" gap="small">
          <s-button variant="primary" icon="store" href={`https://${loaderData?.shop?.primaryDomain?.host}`} target="_blank">View store</s-button>
          {/* <s-button variant="secondary">Your plan: Free</s-button> */}
        </s-stack>
      </s-stack>

      {/* setup guide section start */}
      <SetupGuide
        data={{ loaderData, apiKey }}
        handleUpdate={setupGuideHandle}
      />
      {/* setup guide section end */}

      {/* app embed status section start */}
      <AppEmbedStatus
        isAppEnabled={isAppEnabled}
        activationUrl={activationUrl}
        onVerify={handleVerifyEmbedStatus}
        isVerifying={isVerifyingEmbedStatus}
      />
      {/* app embed status section end */}

      {/* analytics section start */}
      <Analytics
        data={{
          analytics: loaderData.analytics,
          featureStatus: {
            ...loaderData.featureStatus,
            enableCurrency: optimisticEnableCurrency,
          },
        }}
        onToggleCurrencyStatus={handleToggleCurrencyStatus}
        isTogglingCurrencyStatus={isTogglingCurrencyStatus}
      />
      {/* analytics section end */}

      {/* faq section start */}
      <FAQ data={{ appName }} />
      {/* faq section end */}

      {/* help section start */}
      <Help data={{ appName }} />
      {/* help section end */}
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
