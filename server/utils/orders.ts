import { eq, and } from "drizzle-orm";
import { getDb, orders, orderItems, orderItemImages, addresses, users } from "../db";

interface GetOrderOptions {
  includeUser?: boolean;
  userId?: string; // If provided, verifies ownership
}

export async function getOrderById(orderId: string, options?: GetOrderOptions) {
  const db = getDb();

  // Build where clause
  const whereClause = options?.userId
    ? and(eq(orders.id, orderId), eq(orders.userId, options.userId))
    : eq(orders.id, orderId);

  // Get order
  const [order] = await db
    .select()
    .from(orders)
    .where(whereClause)
    .limit(1);

  if (!order) {
    return null;
  }

  // Get user info (for admin view)
  let user = null;
  if (options?.includeUser && order.userId) {
    const [orderUser] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, order.userId))
      .limit(1);
    user = orderUser || null;
  }

  // Get address if exists
  let address = null;
  if (order.addressId) {
    const [orderAddress] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, order.addressId))
      .limit(1);
    address = orderAddress || null;
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

      return { ...item, images };
    })
  );

  return {
    id: order.id,
    userId: order.userId,
    status: order.status,
    totalPrice: order.totalPrice,
    currency: order.currency,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: itemsWithImages,
    address,
    user,
  };
}
