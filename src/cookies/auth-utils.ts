import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const USER_ID_COOKIE = "dev_monks_user_id";

/**
 * Ensures a user ID exists in the cookies, creating one if it doesn't.
 * This function should ONLY be used in Server Actions or Route Handlers,
 * as it attempts to set a cookie.
 */
export async function ensureUserId() {
  const cookieStore = await cookies();
  let userId = cookieStore.get(USER_ID_COOKIE)?.value;

  if (!userId) {
    userId = uuidv4();
    await setUserIdCookie(userId);
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
