import { eq } from "drizzle-orm";
import { getDb, users } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, name } = body;

  // Basic validation
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      message: "Password must be at least 8 characters",
    });
  }

  const db = getDb();

  // Check if user exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: "User with this email already exists",
    });
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const [user] = await db
    .insert(users)
    .values({
      email,
      name: name || email.split("@")[0],
      passwordHash,
    })
    .returning();

  // Set session
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });

  return { success: true, user: { id: user.id, email: user.email, name: user.name } };
});
