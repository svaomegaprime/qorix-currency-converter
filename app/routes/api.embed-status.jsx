import { authenticate } from "../shopify.server";
import { getEmbedStatusForShop } from "../utils/embed.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
        `#graphql
      query ShopShow {
        shop {
          currencyCode
          currencyFormats {
            moneyFormat
            moneyInEmailsFormat
            moneyWithCurrencyFormat
            moneyWithCurrencyInEmailsFormat
        }
        myshopifyDomain
        name
        primaryDomain {
          host
        }
        setupRequired
        url
      }
    }`,
    );

    const status = await getEmbedStatusForShop(admin, "app-embed");
    console.log("status", status);
    const json = await response.json();
    return { shop: json.data.shop, embedStatus: status };
}