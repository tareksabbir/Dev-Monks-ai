import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const USER_ID_COOKIE = "dev_monks_user_id";

/**
 * Gets the current anonymous user ID from cookies,
 * or creates a new one if it doesn't exist.
 * This should only be used in Server Components or API routes.
 */
export async function getOrCreateUserId() {
  const cookieStore = await cookies();
  let userId = cookieStore.get(USER_ID_COOKIE)?.value;

  if (!userId) {
    userId = uuidv4();
    // Note: In Server Actions or Route Handlers, use cookieStore.set()
    // Otherwise, this function should be used to retrieve the ID,
    // and the client-side/middleware should ensure it's set.
  }

  return userId;
}

export async function setUserIdCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(USER_ID_COOKIE, userId, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
