import { eq } from "drizzle-orm";
import { getDb, users } from "../../utils/db";

export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user: googleUser }) {
    const db = getDb();

    // Find or create user
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleUser.sub))
      .limit(1);

    if (!user) {
      // Check if user exists with same email
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, googleUser.email))
        .limit(1);

      if (existingUser) {
        // Link Google account to existing user
        [user] = await db
          .update(users)
          .set({ googleId: googleUser.sub, updatedAt: new Date() })
          .where(eq(users.id, existingUser.id))
          .returning();
      } else {
        // Create new user
        [user] = await db
          .insert(users)
          .values({
            email: googleUser.email,
            name: googleUser.name,
            googleId: googleUser.sub,
          })
          .returning();
      }
    }

    // Set session
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    return sendRedirect(event, "/profile");
  },
  onError(event, error) {
    console.error("Google OAuth error:", error);
    return sendRedirect(event, "/profile?error=oauth_failed");
  },
});
