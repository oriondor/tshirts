import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb, users } from "../../db";
import { sendVerificationEmail } from "../../utils/email";

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

  // Hash password and generate verification token
  const passwordHash = await hashPassword(password);
  const verificationToken = nanoid(32);
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Create user
  const [user] = await db
    .insert(users)
    .values({
      email,
      name: name || email.split("@")[0],
      passwordHash,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry,
    })
    .returning();

  // Send verification email
  await sendVerificationEmail(email, verificationToken);

  return {
    success: true,
    message: "Please check your email to verify your account",
  };
});
