'use client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function useStories(type: 'top' | 'new' | 'best') {
  return useInfiniteQuery({
    queryKey: ['stories', type],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const res = await fetch(`/api/stories?type=${type}&page=${pageParam}`);
      return res.json();
    },
    initialPageParam: 0,  // ← এটা add করো
    getNextPageParam: (_: unknown, pages: unknown[]) => pages.length,
  });
}

export function useStory(id: number) {
  return useQuery({
    queryKey: ['story', id],
    queryFn: async () => {
      const res = await fetch(`/api/stories/${id}`);
      return res.json();
    },
  });
}