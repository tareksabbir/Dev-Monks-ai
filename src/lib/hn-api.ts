import { HNItem, HNComment, AlgoliaItem, AlgoliaComment, AlgoliaHit } from "@/types";

import { cleanHtml } from "@/utils";

const ALGOLIA_BASE = "https://hn.algolia.com/api/v1";

// Algolia HN API এর মাধ্যমে একবারে সব কমেন্টসহ স্টোরি ফেচ করা
export async function getItemWithComments(id: number): Promise<{ story: HNItem; comments: HNComment[] } | null> {
  try {
    const response = await fetch(`${ALGOLIA_BASE}/items/${id}`);
    if (!response.ok) return null;

    const data: AlgoliaItem = await response.json();
    
    const story: HNItem = {
      id: data.id,
      type: data.type as HNItem["type"],
      by: data.author || "unknown",
      time: data.created_at_i,
      title: data.title,
      text: data.text || "",
      url: data.url || "",
      score: data.points || 0,
      descendants: data.children?.length || 0, // Top-level kids count for descendants or recursive?
      kids: data.children?.map((c) => c.id) || []
    };

    // Recursive function to map Algolia children to HNComment structure
    const mapComment = (c: AlgoliaComment): HNComment => ({
      id: c.id,
      by: c.author || "[deleted]",
      text: c.text || "",
      time: c.created_at_i,
      kids: c.children?.map((child) => child.id),
      children: c.children ? c.children.map(mapComment) : []
    });

    const comments = data.children ? data.children.map(mapComment) : [];

    return { story, comments };
  } catch (error) {
    console.error("Error in getItemWithComments:", error);
    return null;
  }
}

// Algolia Search API এর মাধ্যমে ক্যাটাগরি অনুযায়ী স্টোরি ফেচ করা
export async function getStoriesByType(
  type: string,
  page: number = 0,
  hitsPerPage: number = 12
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
      console.error(`Algolia API error: ${res.status} ${res.statusText} for URL: ${url}`);
      return [];
    }
    
    const data: { hits: AlgoliaHit[] } = await res.json();

    return data.hits.map((hit) => ({
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
  } catch (error) {
    console.error(`Unexpected error in getStoriesByType (${type}):`, error);
    return [];
  }
}

// Algolia HN API এর মাধ্যমে একবারে সব কমেন্ট ফেচ করা
// এটি Firebase API এর তুলনায় ১০-২০ গুণ বেশি ফাস্ট
export async function fetchCommentsForAI(storyId: number): Promise<string> {
  try {
    const response = await fetch(`${ALGOLIA_BASE}/items/${storyId}`);
    if (!response.ok) throw new Error("Algolia API fetching failed");

    const data: AlgoliaItem = await response.json();
    if (!data.children || data.children.length === 0) return "";

    const MAX_COMMENTS = 200;
    const MAX_CHARS = 25000;
    const flatComments: string[] = [];
    let count = 0;
    let totalChars = 0;

    function flatten(items: AlgoliaComment[], depth: number = 0) {
      if (!items || depth > 3 || count >= MAX_COMMENTS || totalChars >= MAX_CHARS) return;

      for (const item of items) {
        if (count >= MAX_COMMENTS || totalChars >= MAX_CHARS) break;
        if (!item.text || item.text === "" || item.author === null) continue;

        const cleanText = cleanHtml(item.text);
        if (cleanText) {
          const prefix = depth === 0 ? "User" : `${"  ".repeat(depth)}Reply`;
          const line = `${prefix} (${item.author}): ${cleanText}`;
          flatComments.push(line);
          totalChars += line.length;
          count++;
        }

        if (item.children && item.children.length > 0) {
          flatten(item.children, depth + 1);
        }
      }
    }

    flatten(data.children);

    let result = flatComments.join("\n---\n");
    if (result.length > MAX_CHARS) {
      result = result.substring(0, MAX_CHARS) + "\n\n[... truncated for brevity]";
    }

    return result;
  } catch (error) {
    console.error("Error in fetchCommentsForAI (Algolia):", error);
    return ""; // Fallback or handle error
  }
}
