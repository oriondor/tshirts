import { desc, eq, sql, count } from "drizzle-orm";
import { getDb, orders, orderItems } from "../../../db";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const db = getDb();

  // Get all orders with item count, sorted by status (paid first) then by date (newest first)
  const allOrders = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      status: orders.status,
      totalPrice: orders.totalPrice,
      currency: orders.currency,
      notes: orders.notes,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      itemCount: count(orderItems.id),
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .groupBy(orders.id)
    .orderBy(
      sql`CASE WHEN ${orders.status} = 'paid' THEN 0 ELSE 1 END`,
      desc(orders.createdAt)
    );

  // Get count of paid orders
  const [paidCountResult] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.status, "paid"));

  return {
    orders: allOrders,
    paidCount: paidCountResult?.count || 0,
  };
});
