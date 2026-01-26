import { eq, and } from "drizzle-orm";
import { getDb, orders, orderItems, orderItemImages } from "../../db";

export default defineEventHandler(async (event) => {
  // Require authentication
  const session = await getUserSession(event);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }
  const orderId = getRouterParam(event, "id");

  if (!orderId) {
    throw createError({
      statusCode: 400,
      message: "Order ID is required",
    });
  }

  const db = getDb();

  // Get order (only if it belongs to this user)
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1);

  if (!order) {
    throw createError({
      statusCode: 404,
      message: "Order not found",
    });
  }

  // Get order items
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  // Get images for each item
  const itemsWithImages = await Promise.all(
    items.map(async (item) => {
      const images = await db
        .select({
          id: orderItemImages.id,
          filename: orderItemImages.filename,
          originalFilename: orderItemImages.originalFilename,
          mimeType: orderItemImages.mimeType,
          fileSize: orderItemImages.fileSize,
          storagePath: orderItemImages.storagePath,
          sortOrder: orderItemImages.sortOrder,
        })
        .from(orderItemImages)
        .where(eq(orderItemImages.orderItemId, item.id));

      return {
        ...item,
        images,
      };
    }),
  );

  return {
    order: {
      id: order.id,
      status: order.status,
      totalPrice: order.totalPrice,
      currency: order.currency,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: itemsWithImages,
    },
  };
});
