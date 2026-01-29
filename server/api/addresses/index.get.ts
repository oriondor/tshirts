import { eq, desc } from "drizzle-orm";
import { getDb, addresses } from "../../db";

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event);
  const db = getDb();

  const userAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));

  return {
    addresses: userAddresses,
  };
});
