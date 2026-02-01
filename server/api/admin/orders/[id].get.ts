export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const orderId = getRouterParam(event, "id");

  if (!orderId) {
    throw createError({
      statusCode: 400,
      message: "Order ID is required",
    });
  }

  const order = await getOrderById(orderId, { includeUser: true });

  if (!order) {
    throw createError({
      statusCode: 404,
      message: "Order not found",
    });
  }

  return { order };
});
