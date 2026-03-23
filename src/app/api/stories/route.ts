import { getStoriesByType } from "@/lib/hn-api";
import { AlgoliaHit } from "@/types";
import { mapAlgoliaHits } from "@/utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") as
      | "top"
      | "new"
      | "best"
      | "ask"
      | "show"
      | "job"
      | "all";
    const query = req.nextUrl.searchParams.get("query") || "";
    const page = Number(req.nextUrl.searchParams.get("page") || 0);

    // Basic validation
    if (isNaN(page) || page < 0) {
      return Response.json({ error: "Invalid page number" }, { status: 400 });
    }

    // Case 1: Search query provided
    if (query) {
      let tags = type === "all" || !type ? "(story,job)" : "story";
      if (type === "ask") tags = "ask_hn";
      else if (type === "show") tags = "show_hn";
      else if (type === "job") tags = "job";

      const algoliaUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=${tags}&page=${page}&hitsPerPage=12`;
      const res = await fetch(algoliaUrl);
      
      if (!res.ok) {
        throw new Error(`Algolia search failed with status ${res.status}`);
      }
      
      const data: { hits: AlgoliaHit[] } = await res.json();
      return Response.json(mapAlgoliaHits(data.hits));
    }

    // Case 2: "All" category or specific type browsing
    const storyType = type === "all" || !type ? "new" : type;
    const stories = await getStoriesByType(storyType, page);
    
    if (!stories) {
      return Response.json({ error: "Failed to fetch stories" }, { status: 500 });
    }

    return Response.json(stories);
  } catch (error) {
    console.error("API stories error:", error);
    return Response.json(
      { error: "An unexpected error occurred while fetching stories" },
      { status: 500 }
    );
  }
}

