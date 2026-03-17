'use client';
import { useInfiniteQuery, useQuery, keepPreviousData } from '@tanstack/react-query';

export function useStories(type: 'top' | 'new' | 'best' | 'ask' | 'show' | 'job' | 'all', query = "") {
  return useInfiniteQuery({
    queryKey: ['stories', type, query],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const res = await fetch(`/api/stories?type=${type}&page=${pageParam}&query=${encodeURIComponent(query)}`);
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any[], allPages: any[]) => {
      // If the last page has fewer than 12 items, we've reached the end
      if (!lastPage || lastPage.length < 12) return undefined;
      return allPages.length;
    },
    placeholderData: keepPreviousData,
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

export function useFeaturedStory() {
  return useQuery({
    queryKey: ['featured-story'],
    queryFn: async () => {
      const res = await fetch('/api/stories/featured');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}