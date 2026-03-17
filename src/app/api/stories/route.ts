import { getStoryIds, getItem } from '@/lib/hn-api';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') as 'top' | 'new' | 'best' | 'ask' | 'show' | 'job' | 'all';
  const query = req.nextUrl.searchParams.get('query') || '';
  const page = Number(req.nextUrl.searchParams.get('page') || 0);
  
  // If there's a search query OR type is 'all', use Algolia Search API
  if (query || type === 'all') {
    const algoliaUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&page=${page}&hitsPerPage=12`;
    const res = await fetch(algoliaUrl);
    const data = await res.json();
    
    // Map Algolia results to HNItem interface
    const stories = data.hits.map((hit: any) => ({
      id: hit.objectID,
      by: hit.author,
      time: hit.created_at_i,
      title: hit.title,
      text: hit.story_text || hit.comment_text || "",
      url: hit.url,
      score: hit.points,
      descendants: hit.num_comments,
      type: "story"
    }));

    return Response.json(stories);
  }

  // Otherwise use traditional Firebase HN API for category browsing
  const ids = await getStoryIds(type || 'top');
  const pageIds = ids.slice(page * 12, (page + 1) * 12);
  
  const stories = await Promise.all(pageIds.map(getItem));
  return Response.json(stories.filter(Boolean));
}