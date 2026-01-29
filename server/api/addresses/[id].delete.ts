import { eq, and } from "drizzle-orm";
import { getDb, addresses } from "../../db";

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event);
  const addressId = getRouterParam(event, "id");

  if (!addressId) {
    throw createError({
      statusCode: 400,
      message: "Address ID is required",
    });
  }

  const db = getDb();

  // Verify the address belongs to the user
  const [existingAddress] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
    .limit(1);

  if (!existingAddress) {
    throw createError({
      statusCode: 404,
      message: "Address not found",
    });
  }

  await db
    .delete(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));

  return {
    success: true,
  };
});
