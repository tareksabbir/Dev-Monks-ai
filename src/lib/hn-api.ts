import {
  HNItem,
  HNComment,
  AlgoliaItem,
  AlgoliaComment,
  AlgoliaHit,
} from "@/types";

import {
  ALGOLIA_BASE,
  countDescendants,
  collectAndScoreComments,
  mapAlgoliaHits,
} from "@/utils";

// Algolia HN API এর মাধ্যমে একবারে সব কমেন্টসহ স্টোরি ফেচ করা
export async function getItemWithComments(
  id: number,
): Promise<{ story: HNItem; comments: HNComment[] } | null> {
  try {
    // Parallel fetch: Item tree + Search metadata (for consistent counts/scores)
    const [itemRes, searchRes] = await Promise.all([
      fetch(`${ALGOLIA_BASE}/items/${id}`),
      fetch(`${ALGOLIA_BASE}/search?tags=story,story_${id}`),
    ]);

    if (!itemRes.ok) return null;
    const data: AlgoliaItem = await itemRes.json();

    // Basic validation: ensure data has an id and type
    if (!data || typeof data.id !== "number") {
      console.warn(`Algolia response for item ${id} is invalid:`, data);
      return null;
    }

    const searchData = searchRes.ok ? await searchRes.json() : null;
    const searchHit = searchData?.hits?.[0];

    const story: HNItem = {
      id: data.id,
      type:
        (searchHit?.type as HNItem["type"]) || (data.type as HNItem["type"]),
      by: searchHit?.author || data.author || "unknown",
      time: searchHit?.created_at_i || data.created_at_i,
      title: searchHit?.title || data.title,
      text: data.text || "",
      url: searchHit?.url || data.url || "",
      score: searchHit?.points ?? data.points ?? 0,
      // Search API-র num_comments ব্যবহার করো যদি পাওয়া যায়, নাহলে ম্যানুয়ালি গুনো
      descendants:
        searchHit?.num_comments ??
        (data.children
          ? data.children.reduce((sum, c) => sum + 1 + countDescendants(c), 0)
          : 0),
      kids: data.children?.map((c) => c.id) || [],
    };

    // Recursive function to map Algolia children to HNComment structure
    const mapComment = (c: AlgoliaComment): HNComment => ({
      id: c.id,
      by: c.author || "[deleted]",
      text: c.text || "",
      time: c.created_at_i,
      kids: c.children?.map((child) => child.id),
      children: c.children ? c.children.map(mapComment) : [],
    });

    const comments = data.children ? data.children.map(mapComment) : [];

    return { story, comments };
  } catch (error) {
    console.error("Error in getItemWithComments:", error);
    return null;
  }
}

// Algolia Search API এর মাধ্যমে ক্যাটাগরি অনুযায়ী স্টোরি ফেচ করা
export async function getStoriesByType(
  type: string,
  page: number = 0,
  hitsPerPage: number = 12,
): Promise<HNItem[]> {
  try {
    let tags = "story";
    let endpoint = "search";
    let numericFilters = "";

    const now = Math.floor(Date.now() / 1000);
    const oneWeekAgo = now - 7 * 24 * 60 * 60;

    if (type === "top") {
      tags = "front_page";
    } else if (type === "new") {
      endpoint = "search_by_date";
      tags = "story";
    } else if (type === "best") {
      tags = "story";
      numericFilters = `created_at_i>${oneWeekAgo}`;
    } else if (type === "ask") {
      endpoint = "search_by_date";
      tags = "ask_hn";
    } else if (type === "show") {
      endpoint = "search_by_date";
      tags = "show_hn";
    } else if (type === "job") {
      endpoint = "search_by_date";
      tags = "job";
    }

    let url = `${ALGOLIA_BASE}/${endpoint}?tags=${tags}&page=${page}&hitsPerPage=${hitsPerPage}`;
    if (numericFilters) {
      url += `&numericFilters=${numericFilters}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
      console.error(
        `Algolia API error: ${res.status} ${res.statusText} for URL: ${url}`,
      );
      return [];
    }

    const data: { hits: AlgoliaHit[] } = await res.json();
    if (!data || !Array.isArray(data.hits)) {
      console.error(`Invalid Algolia response structure for ${url}:`, data);
      return [];
    }

    return mapAlgoliaHits(data.hits);
  } catch (error) {
    console.error(`Unexpected error in getStoriesByType (${type}):`, error);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════
// Comment Prioritization System
// ═══════════════════════════════════════════════════════════
// Algolia API তে individual comment points নেই,
// তাই reply count, text quality, এবং thread engagement দিয়ে
// smart scoring করে best comments আগে AI-কে দেওয়া হয় (Moved to @/utils/hn)

// Algolia HN API — Smart Comment Prioritization
// Best comments আগে: reply count, text quality, engagement ভিত্তিতে sort
export async function fetchCommentsForAI(storyId: number): Promise<string> {
  try {
    const response = await fetch(`${ALGOLIA_BASE}/items/${storyId}`);
    if (!response.ok) throw new Error("Algolia API fetching failed");

    const data: AlgoliaItem = await response.json();
    if (!data.children || data.children.length === 0) return "";

    const MAX_COMMENTS = 200;
    const MAX_CHARS = 25000;

    // Step 1: Collect and score ALL comments
    const allComments = collectAndScoreComments(data.children);

    // Step 2: Sort by score (highest first)
    allComments.sort((a, b) => b.score - a.score);

    // Step 3: Pick top comments within budget
    const selectedLines: string[] = [];
    let totalChars = 0;
    let count = 0;

    for (const comment of allComments) {
      if (count >= MAX_COMMENTS || totalChars >= MAX_CHARS) break;

      const prefix =
        comment.depth === 0
          ? `[★${comment.replyCount > 0 ? ` ${comment.replyCount} replies` : ""}] User`
          : `${"  ".repeat(comment.depth)}Reply`;

      const line = `${prefix} (${comment.author}): ${comment.text}`;

      if (totalChars + line.length > MAX_CHARS) break;

      selectedLines.push(line);
      totalChars += line.length;
      count++;
    }

    let result = selectedLines.join("\n---\n");
    if (allComments.length > count) {
      result += `\n\n[${allComments.length - count} lower-priority comments omitted]`;
    }

    return result;
  } catch (error) {
    console.error("Error in fetchCommentsForAI (Algolia):", error);
    return "";
  }
}
