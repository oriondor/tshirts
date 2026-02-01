import type { H3Event } from "h3";

interface SessionUser {
  id?: string;
  isAdmin?: boolean;
}

export async function requireAuth(event: H3Event): Promise<string> {
  const session = await getUserSession(event);
  const userId = (session?.user as SessionUser | undefined)?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  return userId;
}

export async function requireAdmin(event: H3Event): Promise<string> {
  const session = await getUserSession(event);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: "Authentication required",
    });
  }

  if (!user.isAdmin) {
    throw createError({
      statusCode: 403,
      message: "Admin access required",
    });
  }

  return user.id;
}
