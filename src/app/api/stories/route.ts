/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStoryIds, getItem } from "@/lib/hn-api";
import { NextRequest } from "next/server";

const FIREBASE_SUPPORTED = ["top", "new", "best", "ask", "show", "job"];

export async function GET(req: NextRequest) {
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

  // Case 1: Search query provided
  if (query) {
    // If 'all' category, search both stories and jobs
    let tags = type === "all" || !type ? "(story,job)" : "story";
    if (type === "ask") tags = "ask_hn";
    else if (type === "show") tags = "show_hn";
    else if (type === "job") tags = "job";

    const algoliaUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=${tags}&page=${page}&hitsPerPage=12`;
    const res = await fetch(algoliaUrl);
    const data = await res.json();
    return Response.json(mapAlgoliaHits(data.hits));
  }

  // Case 2: "All" category (latest from everywhere, including jobs)
  if (type === "all" || !type) {
    const algoliaUrl = `https://hn.algolia.com/api/v1/search_by_date?tags=(story,job)&page=${page}&hitsPerPage=12`;
    const res = await fetch(algoliaUrl);
    const data = await res.json();
    return Response.json(mapAlgoliaHits(data.hits));
  }

  // Case 3: Category browsing (Firebase API with Algolia fallback)
  if (FIREBASE_SUPPORTED.includes(type)) {
    try {
      const ids = await getStoryIds(type as any);
      const pageIds = ids.slice(page * 12, (page + 1) * 12);
      const stories = await Promise.all(pageIds.map(getItem));

      // Enhance raw Firebase items with better type labeling for badges
      const enhancedStories = stories.filter(Boolean).map((story) => {
        let storyType = story?.type || "story";

        // Smart detection based on the feed type OR the title content
        if (type === "job" || story?.type === "job") {
          storyType = "job";
        } else if (type === "ask" || story?.title?.startsWith("Ask HN:")) {
          storyType = "ask";
        } else if (type === "show" || story?.title?.startsWith("Show HN:")) {
          storyType = "show";
        }

        return { ...story, type: storyType };
      });

      return Response.json(enhancedStories);
    } catch (err) {
      console.error(
        `Firebase API failed for ${type}, falling back to Algolia:`,
        err,
      );

      let tags = "story";
      if (type === "ask") tags = "ask_hn";
      else if (type === "show") tags = "show_hn";
      else if (type === "job") tags = "job";

      const algoliaUrl = `https://hn.algolia.com/api/v1/search_by_date?tags=${tags}&page=${page}&hitsPerPage=12`;
      const res = await fetch(algoliaUrl);
      const data = await res.json();
      return Response.json(mapAlgoliaHits(data.hits));
    }
  }

  // Default fallback to top stories
  const ids = await getStoryIds("top");
  const pageIds = ids.slice(page * 12, (page + 1) * 12);
  const stories = await Promise.all(pageIds.map(getItem));
  return Response.json(stories.filter(Boolean));
}

function mapAlgoliaHits(hits: any[]) {
  return hits
    .filter((hit) => hit.title)
    .map((hit) => ({
      id: Number(hit.objectID),
      by: hit.author || "unknown",
      time: hit.created_at_i,
      title: hit.title,
      text: hit.story_text || "",
      url: hit.url || "",
      score: hit.points || 0,
      descendants: hit.num_comments || 0,
      type: hit._tags?.includes("ask_hn")
        ? "ask"
        : hit._tags?.includes("show_hn")
          ? "show"
          : hit._tags?.includes("job")
            ? "job"
            : "story",
    }));
}
