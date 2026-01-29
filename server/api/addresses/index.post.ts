import { eq, and } from "drizzle-orm";
import { getDb, addresses } from "../../db";
import { validateAddressInput } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event);
  const body = await readBody(event);
  const validatedData = validateAddressInput(body);

  const db = getDb();

  // If this address is being set as default, unset any existing default
  if (validatedData.isDefault) {
    await db
      .update(addresses)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(and(eq(addresses.userId, userId), eq(addresses.isDefault, true)));
  }

  const [newAddress] = await db
    .insert(addresses)
    .values({
      userId,
      recipientName: validatedData.recipientName,
      phone: validatedData.phone,
      street: validatedData.street,
      streetNumber: validatedData.streetNumber,
      additionalInfo: validatedData.additionalInfo,
      postalCode: validatedData.postalCode,
      city: validatedData.city,
      country: validatedData.country,
      label: validatedData.label,
      isDefault: validatedData.isDefault,
    })
    .returning();

  return {
    success: true,
    address: newAddress,
  };
});
