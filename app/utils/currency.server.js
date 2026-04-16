export async function getCurrencyFormats(admin) {
    const response = await admin.graphql(
        `#graphql
        query {
            shop {
                currencyCode
                currencyFormats {
                    moneyFormat
                    moneyInEmailsFormat
                    moneyWithCurrencyFormat
                    moneyWithCurrencyInEmailsFormat
                }
            }
        }`
    );


    const json = await response.json();

    return json.data;
}