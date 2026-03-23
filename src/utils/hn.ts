import { AlgoliaComment, AlgoliaHit, HNItem } from "@/types";
import { cleanHtml } from "./text";

/** Shared mapper: Algolia search hits → HNItem[] (used by both hn-api and API routes) */
export function mapAlgoliaHits(hits: AlgoliaHit[]): HNItem[] {
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
    })) as HNItem[];
}

export const ALGOLIA_BASE = "https://hn.algolia.com/api/v1";

export interface ScoredComment {
  author: string;
  text: string;
  depth: number;
  score: number;
  replyCount: number;
}

/** Count total descendants recursively */
export function countDescendants(comment: AlgoliaComment): number {
  if (!comment.children || comment.children.length === 0) return 0;
  return comment.children.reduce(
    (sum, child) => sum + 1 + countDescendants(child),
    0,
  );
}

/** Score a comment based on quality signals (higher = more important) */
export function scoreComment(
  text: string,
  depth: number,
  replyCount: number,
): number {
  let score = 0;

  // 1. Reply count — comments that sparked discussion are more important
  score += Math.min(replyCount * 3, 30); // cap at 30 points

  // 2. Text length — substantive comments over one-liners
  //    Sweet spot: 100-800 chars
  const len = text.length;
  if (len >= 100 && len <= 800) score += 10;
  else if (len > 800) score += 7;
  else if (len >= 50) score += 3;

  // 3. Top-level comments are usually more important
  if (depth === 0) score += 8;
  else if (depth === 1) score += 4;

  // 4. Contains technical signals (links, benchmarks, data points)
  if (text.includes("http") || text.includes("github.com")) score += 3;
  if (/\d+(\.\d+)?%/.test(text) || /\d+x\s/.test(text)) score += 3;

  // 5. Penalize likely noise
  const lower = text.toLowerCase();
  if (lower.startsWith("thanks") || lower.startsWith("+1") || lower === "this")
    score -= 10;

  return score;
}

/** Flatten all comments recursively, scoring each one */
export function collectAndScoreComments(
  items: AlgoliaComment[],
  depth: number = 0,
  maxDepth: number = 4,
): ScoredComment[] {
  const results: ScoredComment[] = [];
  if (!items || depth > maxDepth) return results;

  for (const item of items) {
    if (!item.text || item.text === "" || item.author === null) {
      // Still recurse into children even if this comment is deleted
      if (item.children && item.children.length > 0) {
        results.push(
          ...collectAndScoreComments(item.children, depth + 1, maxDepth),
        );
      }
      continue;
    }

    const cleaned = cleanHtml(item.text);
    if (cleaned && cleaned.length >= 15) {
      const replyCount = countDescendants(item);
      results.push({
        author: item.author || "[deleted]",
        text: cleaned,
        depth,
        score: scoreComment(cleaned, depth, replyCount),
        replyCount,
      });
    }

    if (item.children && item.children.length > 0) {
      results.push(
        ...collectAndScoreComments(item.children, depth + 1, maxDepth),
      );
    }
  }

  return results;
}

// Mapping categories to HN types
export const getHNType = (
  category: string,
): "top" | "new" | "best" | "ask" | "show" | "job" | "all" => {
  switch (category) {
    case "All":
      return "all";
    case "New":
      return "new";
    case "Best":
      return "best";
    case "Ask HN":
      return "ask";
    case "Show HN":
      return "show";
    case "Jobs":
      return "job";
    default:
      return "top";
  }
};
