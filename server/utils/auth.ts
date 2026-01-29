import type { H3Event } from "h3";

export async function requireAuth(event: H3Event): Promise<string> {
  const session = await getUserSession(event);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  return userId;
}
