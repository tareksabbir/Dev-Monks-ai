const HN_BASE = "https://hacker-news.firebaseio.com/v0";

export async function getStoryIds(type: 'top' | 'new' | 'best') {
  const res = await fetch(`${HN_BASE}/${type}stories.json`);
  return res.json() as Promise<number[]>;
}

export async function getItem(id: number) {
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