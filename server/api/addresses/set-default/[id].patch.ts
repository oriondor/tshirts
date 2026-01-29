import { getDb, addresses } from "../../../db";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event);
  const addressId = getRouterParam(event, "id") as string;

  const db = getDb();

  await db.transaction(async (tx) => {
    await tx
      .update(addresses)
      .set({ isDefault: false })
      .where(eq(addresses.userId, userId));

    await tx
      .update(addresses)
      .set({ isDefault: true })
      .where(eq(addresses.id, addressId));
  });
});
