import { eq, desc } from "drizzle-orm";
import { getDb, orders, orderItems } from "../../db";

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
  const db = getDb();

  // Get all orders for this user
  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  // Get item counts for each order
  const ordersWithCounts = await Promise.all(
    userOrders.map(async (order) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

      return {
        id: order.id,
        status: order.status,
        totalPrice: order.totalPrice,
        currency: order.currency,
        itemCount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    }),
  );

  return {
    orders: ordersWithCounts,
  };
});
