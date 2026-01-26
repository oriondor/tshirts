import { eq } from "drizzle-orm";
import { getDb, users } from "../db";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  const body = await readBody(event);
  const { name } = body;

  if (typeof name !== "string" || name.length > 255) {
    throw createError({
      statusCode: 400,
      message: "Invalid name",
    });
  }

  const db = getDb();

  const [updatedUser] = await db
    .update(users)
    .set({
      name: name.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

  if (!updatedUser) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  // Update session with new user data
  await setUserSession(event, {
    user: updatedUser,
  });

  return { success: true, user: updatedUser };
});
