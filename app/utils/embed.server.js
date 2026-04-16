// app/services/shopify/embed.server.js

/**
 * Get MAIN (active) theme ID
 */
export async function getMainThemeId(admin) {
  const response = await admin.graphql(`
    #graphql
    {
      themes(first: 10, roles: [MAIN]) {
        edges {
          node {
            id
          }
        }
      }
    }
  `);

  const data = await response.json();

  return data?.data?.themes?.edges?.[0]?.node?.id || null;
}

/**
 * Clean JSON string (remove comments, control chars)
 */
function cleanJsonString(jsonString) {
  return jsonString.replace(
    /\/\*[\s\S]*?\*\/|(^|[^:\\])\/\/.*$/gm,
    "$1"
  );
}

/**
 * Get settings_data.json
 */
async function getThemeSettings(admin, themeId) {
  const response = await admin.graphql(
    `#graphql
    query GetThemeSettings($id: ID!) {
      theme(id: $id) {
        files(filenames: ["config/settings_data.json"]) {
          edges {
            node {
              body {
                ... on OnlineStoreThemeFileBodyText {
                  content
                }
              }
            }
          }
        }
      }
    }`,
    { variables: { id: themeId } }
  );

  const data = await response.json();

  const cleanJson = cleanJsonString(data.data.theme.files.edges[0].node.body.content);
  const parsedJson = JSON.parse(cleanJson);

  return parsedJson;
}

/**
 * Find your app embed block
 */
function findEmbedBlock(settings, appHandle) {
  const blocks = settings?.current?.blocks || {};
  const embedBlock = Object.values(blocks).find(
    (block) =>
      block.type.includes(`shopify://apps/currency-converter/blocks/${appHandle}`)
  );
  if (!embedBlock) return null;
  return embedBlock.disabled ? "DISABLED" : "ENABLED";
}

/**
 * MAIN FUNCTION (reuse everywhere)
 */
export async function getEmbedStatusForShop(admin, appHandle) {
  const themeId = await getMainThemeId(admin);
  if (!themeId) return "NOT_INSTALLED 1";

  const settings = await getThemeSettings(admin, themeId);
  if (!settings) return "NOT_INSTALLED 2";

  const embedBlock = findEmbedBlock(settings, appHandle);
  if (!embedBlock) return "NOT_INSTALLED 3";

  return embedBlock;
}