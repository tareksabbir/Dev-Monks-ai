const HN_BASE = "https://hacker-news.firebaseio.com/v0";

export interface HNItem {
  id: number;
  deleted?: boolean;
  type: "job" | "story" | "comment" | "poll" | "pollopt" | "ask" | "show";
  by: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface HNComment {
  id: number;
  by: string;
  text: string;
  time: number;
  kids?: number[];
  children: HNComment[]; // nested children
  deleted?: boolean;
  dead?: boolean;
}

export async function getStoryIds(
  type: "top" | "new" | "best" | "ask" | "show" | "job",
) {
  const res = await fetch(`${HN_BASE}/${type}stories.json`);
  return res.json() as Promise<number[]>;
}

export async function getItem(id: number): Promise<HNItem | null> {
  const res = await fetch(`${HN_BASE}/item/${id}.json`);
  return res.json();
}

// Comments flatten করার function
export async function fetchAllComments(ids: number[]): Promise<string[]> {
  const texts: string[] = [];

  async function traverse(id: number) {
    const item = await getItem(id);
    if (!item) return;
    if (item.text) texts.push(item.text.replace(/<[^>]*>/g, ""));
    if (item.kids?.length) {
      await Promise.all(item.kids.slice(0, 10).map(traverse)); // limit
    }
  }

  await Promise.all(ids.slice(0, 20).map(traverse));
  return texts;
}

// Tree structure বানানোর function
export async function fetchCommentTree(
  ids: number[],
  depth: number = 0,
  maxDepth: number = 4, // কতটা গভীর যাবে
): Promise<HNComment[]> {
  if (!ids?.length || depth > maxDepth) return [];

  const items = await Promise.all(ids.slice(0, 10).map(getItem));

  const comments = await Promise.all(
    items
      .filter((item): item is HNItem => !!item && !item.deleted && !item.dead)
      .map(async (item) => ({
        id: item.id,
        by: item.by,
        text: item.text?.replace(/<[^>]*>/g, "") || "",
        time: item.time,
        kids: item.kids,
        children: item.kids?.length
          ? await fetchCommentTree(item.kids, depth + 1, maxDepth)
          : [],
      })),
  );

  return comments;
}
