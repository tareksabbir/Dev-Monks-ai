/* eslint-disable @typescript-eslint/no-unused-vars */
import { getStoryIds, getItem } from "@/lib/hn-api";

export async function GET() {
  try {
    const ids = await getStoryIds("top");
    if (!ids || ids.length === 0) {
      return Response.json({ error: "No stories found" }, { status: 404 });
    }

    const story = await getItem(ids[0]);
    if (!story) {
      return Response.json(
        { error: "Story details not found" },
        { status: 404 },
      );
    }

    return Response.json(story);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch featured story" },
      { status: 500 },
    );
  }
}
