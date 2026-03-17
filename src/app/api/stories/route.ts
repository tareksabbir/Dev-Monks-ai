import { getStoryIds, getItem } from '@/lib/hn-api';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') as 'top' | 'new' | 'best';
  const page = Number(req.nextUrl.searchParams.get('page') || 0);
  
  const ids = await getStoryIds(type || 'top');
  const pageIds = ids.slice(page * 20, (page + 1) * 20);
  
  const stories = await Promise.all(pageIds.map(getItem));
  return Response.json(stories.filter(Boolean));
}