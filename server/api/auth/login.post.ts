import { eq } from "drizzle-orm";
import { getDb, users } from "../../db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  const db = getDb();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !user.passwordHash) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  const isValid = await verifyPassword(user.passwordHash, password);
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: "Invalid email or password",
    });
  }

  // Check if email is verified
  if (!user.emailVerified) {
    throw createError({
      statusCode: 403,
      message: "Please verify your email first",
    });
  }

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
