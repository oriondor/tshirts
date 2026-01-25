import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, users } from "../../db";
import { sendVerificationEmail } from "../../utils/email";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      message: "Email is required",
    });
  }

  const db = getDb();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  // Don't reveal if user exists or not
  if (!user || user.emailVerified) {
    return {
      success: true,
      message:
        "If the email exists and is not verified, a new link has been sent",
    };
  }

  // Generate new token
  const verificationToken = nanoid(32);
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db
    .update(users)
    .set({
      verificationToken,
      verificationTokenExpiry,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  await sendVerificationEmail(email, verificationToken);

  return {
    success: true,
    message:
      "If the email exists and is not verified, a new link has been sent",
  };
});
