import { getStoriesByType } from "@/lib/hn-api";

export async function GET() {
  try {
    const stories = await getStoriesByType("top", 0, 1);
    
    if (!stories || stories.length === 0) {
      return Response.json({ error: "No stories found" }, { status: 404 });
    }

    return Response.json(stories[0]);
  } catch (error) {
    console.error("Failed to fetch featured story:", error);
    return Response.json(
      { error: "Failed to fetch featured story" },
      { status: 500 },
    );
  }
}
