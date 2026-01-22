import { eq } from "drizzle-orm";
import { getDb, users } from "../../utils/db";

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
