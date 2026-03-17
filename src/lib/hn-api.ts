const HN_BASE = "https://hacker-news.firebaseio.com/v0";

export interface HNItem {
  id: number;
  deleted?: boolean;
  type: "job" | "story" | "comment" | "poll" | "pollopt";
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
  descendants?: number[];
}

export async function getStoryIds(type: 'top' | 'new' | 'best' | 'ask' | 'show' | 'job' | 'all') {
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
    if (item.text) texts.push(item.text.replace(/<[^>]*>/g, ''));
    if (item.kids?.length) {
      await Promise.all(item.kids.slice(0, 10).map(traverse)); // limit
    }
  }
  
  await Promise.all(ids.slice(0, 20).map(traverse));
  return texts;
}