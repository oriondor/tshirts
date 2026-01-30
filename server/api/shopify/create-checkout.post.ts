import { eq, and } from "drizzle-orm";
import { getDb, orders, orderItems, addresses } from "../../db";

interface CartCreateResponse {
  data?: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event);
  const body = await readBody<{ orderId: string }>(event);

  if (!body?.orderId) {
    throw createError({
      statusCode: 400,
      message: "Order ID is required",
    });
  }

  const config = useRuntimeConfig();
  const { storeDomain, storefrontAccessToken } = config.shopify;

  if (!storeDomain || !storefrontAccessToken) {
    throw createError({
      statusCode: 500,
      message: "Shopify configuration is missing",
    });
  }

  const db = getDb();

  // Get order (only if it belongs to this user and is unpaid)
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, body.orderId), eq(orders.userId, userId)))
    .limit(1);

  if (!order) {
    throw createError({
      statusCode: 404,
      message: "Order not found",
    });
  }

  if (order.status !== "unpaid") {
    throw createError({
      statusCode: 400,
      message: "Order is not in unpaid status",
    });
  }

  // Get order items
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, body.orderId));

  if (items.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Order has no items",
    });
  }

  // Validate that all items have merchandiseId
  const itemsWithoutMerchandiseId = items.filter((item) => !item.merchandiseId);
  if (itemsWithoutMerchandiseId.length > 0) {
    throw createError({
      statusCode: 400,
      message:
        "Some order items are missing Shopify product reference (merchandiseId)",
    });
  }

  // Get shipping address if exists
  let address = null;
  if (order.addressId) {
    const [orderAddress] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, order.addressId))
      .limit(1);
    address = orderAddress || null;
  }

  const shopifyEndpoint = `https://${storeDomain}/api/2024-10/graphql.json`;

  // Build cart lines from order items using stored merchandiseId
  const cartLines = items.map((item) => {
    // Build attributes from item properties
    const attributes = [
      { key: "Order ID", value: order.id },
      { key: "Design ID", value: item.designId },
    ];

    if (item.size) attributes.push({ key: "Size", value: item.size });
    if (item.productColor)
      attributes.push({ key: "Color", value: item.productColor });
    if (item.designColor)
      attributes.push({ key: "Design Color", value: item.designColor });
    if (item.name) attributes.push({ key: "Name", value: item.name });
    if (item.secondaryText)
      attributes.push({ key: "Secondary Text", value: item.secondaryText });
    if (item.specialRequest)
      attributes.push({ key: "Special Request", value: item.specialRequest });

    // Use the stored merchandiseId, formatted as Shopify Global ID
    const merchandiseId = `gid://shopify/ProductVariant/${item.merchandiseId}`;

    return {
      merchandiseId,
      quantity: item.quantity,
      attributes,
    };
  });

  // Build the cartCreate mutation
  const cartCreateMutation = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  let variables: Record<string, unknown>;

  if (address) {
    // With delivery address
    variables = {
      input: {
        lines: cartLines,
        attributes: [
          { key: "Local Order ID", value: order.id },
          { key: "Notes", value: order.notes || "" },
        ],
        buyerIdentity: {
          deliveryAddressPreferences: [
            {
              deliveryAddress: {
                firstName:
                  address.recipientName.split(" ")[0] || address.recipientName,
                lastName:
                  address.recipientName.split(" ").slice(1).join(" ") || "",
                address1: `${address.street} ${address.streetNumber}`,
                address2: address.additionalInfo || "",
                city: address.city,
                province: "",
                country: address.country,
                zip: address.postalCode,
                phone: address.phone || "",
              },
            },
          ],
        },
      },
    };
  } else {
    // Without delivery address
    variables = {
      input: {
        lines: cartLines,
        attributes: [
          { key: "Local Order ID", value: order.id },
          { key: "Notes", value: order.notes || "" },
        ],
      },
    };
  }

  const cartResponse = await $fetch<CartCreateResponse>(shopifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": storefrontAccessToken,
    },
    body: {
      query: cartCreateMutation,
      variables,
    },
  });

  if (cartResponse.errors && cartResponse.errors.length > 0) {
    throw createError({
      statusCode: 500,
      message: `Shopify cart creation error: ${cartResponse.errors[0]?.message || "Unknown error"}`,
    });
  }

  const cartData = cartResponse.data?.cartCreate;

  if (cartData?.userErrors && cartData.userErrors.length > 0) {
    throw createError({
      statusCode: 400,
      message: `Shopify validation error: ${cartData.userErrors[0]?.message || "Unknown error"}`,
    });
  }

  if (!cartData?.cart?.checkoutUrl) {
    throw createError({
      statusCode: 500,
      message: "Failed to create Shopify checkout",
    });
  }

  return {
    success: true,
    checkoutUrl: cartData.cart.checkoutUrl,
    cartId: cartData.cart.id,
  };
});
