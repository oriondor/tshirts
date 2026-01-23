import { eq, and, gt } from "drizzle-orm";
import { getDb, users } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const { token } = getQuery(event);

  if (!token || typeof token !== "string") {
    return sendRedirect(event, "/profile?error=missing_token");
  }

  const db = getDb();

  // Find user with valid token (not expired)
  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.verificationToken, token),
        gt(users.verificationTokenExpiry, new Date()),
      ),
    )
    .limit(1);

  if (!user) {
    return sendRedirect(event, "/profile?error=invalid_or_expired_token");
  }

  // Mark email as verified and clear token
  await db
    .update(users)
    .set({
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  // Auto-login after verification
  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });

  return sendRedirect(event, "/profile?verified=true");
});
