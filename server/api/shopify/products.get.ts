interface ProductsQueryResponse {
  data?: {
    products: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          variants: {
            edges: Array<{
              node: {
                id: string;
                title: string;
                price: {
                  amount: string;
                  currencyCode: string;
                };
              };
            }>;
          };
        };
      }>;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const { storeDomain, storefrontAccessToken } = config.shopify;

  if (!storeDomain || !storefrontAccessToken) {
    throw createError({
      statusCode: 500,
      message: "Shopify configuration is missing",
    });
  }

  const shopifyEndpoint = `https://${storeDomain}/api/2024-10/graphql.json`;

  const productsQuery = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await $fetch<ProductsQueryResponse>(shopifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": storefrontAccessToken,
    },
    body: {
      query: productsQuery,
    },
  });

  if (response.errors && response.errors.length > 0) {
    throw createError({
      statusCode: 500,
      message: `Shopify API error: ${response.errors[0]?.message || "Unknown error"}`,
    });
  }

  // Format the response for easier reading
  const products = response.data?.products.edges.map((edge) => {
    // Extract numeric ID from gid://shopify/Product/123456
    const productId = edge.node.id.split("/").pop();

    return {
      id: productId,
      gid: edge.node.id,
      title: edge.node.title,
      variants: edge.node.variants.edges.map((v) => {
        // Extract numeric ID from gid://shopify/ProductVariant/123456
        const variantId = v.node.id.split("/").pop();

        return {
          id: variantId,
          gid: v.node.id,
          title: v.node.title,
          price: `${v.node.price.amount} ${v.node.price.currencyCode}`,
        };
      }),
    };
  });

  return { products };
});
