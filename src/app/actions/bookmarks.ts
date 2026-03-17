"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateUserId, setUserIdCookie } from "@/lib/auth-utils";
import { HNItem } from "@/lib/hn-api";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

const USER_ID_COOKIE = "dev_monks_user_id";

async function ensureUserId() {
  const cookieStore = await cookies();
  let userId = cookieStore.get(USER_ID_COOKIE)?.value;
  if (!userId) {
    userId = uuidv4();
    cookieStore.set(USER_ID_COOKIE, userId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  return userId;
}

export async function toggleBookmark(item: HNItem) {
  const userId = await ensureUserId();
  const storyId = Number(item.id);
  
  const existing = await prisma.bookmark.findUnique({
    where: {
      storyId_userId: {
        storyId,
        userId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.bookmark.create({
      data: {
        storyId,
        userId,
        title: item.title || "Untitled",
        url: item.url,
        author: item.by,
        score: item.score || 0,
        time: item.time,
        descendants: item.descendants || 0,
        type: item.type || "story",
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/bookmarks");
  revalidatePath(`/story/${storyId}`);
}

export async function isBookmarked(storyId: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;
  if (!userId) return false;

  const bookmark = await prisma.bookmark.findUnique({
    where: {
      storyId_userId: {
        storyId: Number(storyId),
        userId,
      },
    },
  });

  return !!bookmark;
}

export async function getBookmarks() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;
  if (!userId) return [];

  return prisma.bookmark.findMany({
    where: { userId },
    orderBy: { savedAt: "desc" },
  });
}

export async function getBookmarkIds() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;
  if (!userId) return [];

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    select: { storyId: true },
  });

  return bookmarks.map((b: any) => b.storyId);
}
