import { eq } from "drizzle-orm";
import { getDb, orders, users } from "../../../db";
import type { OrderStatus } from "../../../db/schema/orders";
import { sendOrderStatusEmail } from "../../../utils/email";

const validStatuses: OrderStatus[] = [
  "unpaid",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const orderId = getRouterParam(event, "id");
  if (!orderId) {
    throw createError({
      statusCode: 400,
      message: "Order ID is required",
    });
  }

  const body = await readBody<{ status: OrderStatus }>(event);

  if (!body.status || !validStatuses.includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: "Invalid status",
    });
  }

  const db = getDb();

  // Get current order with user info
  const [order] = await db
    .select({
      id: orders.id,
      status: orders.status,
      userId: orders.userId,
    })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!order) {
    throw createError({
      statusCode: 404,
      message: "Order not found",
    });
  }

  const previousStatus = order.status;
  const newStatus = body.status;

  // Update order status
  const [updatedOrder] = await db
    .update(orders)
    .set({
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  // Send notification emails for specific transitions
  if (previousStatus === "paid" && newStatus === "processing") {
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, order.userId))
      .limit(1);

    if (user?.email) {
      await sendOrderStatusEmail(user.email, orderId, "processing");
    }
  }

  if (previousStatus === "processing" && newStatus === "shipped") {
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, order.userId))
      .limit(1);

    if (user?.email) {
      await sendOrderStatusEmail(user.email, orderId, "shipped");
    }
  }

  return {
    success: true,
    order: {
      id: updatedOrder!.id,
      status: updatedOrder!.status,
    },
  };
});
