"use client";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { HNItem } from "@/types";

export function useStories(
  type: "top" | "new" | "best" | "ask" | "show" | "job" | "all",
  query = "",
) {
  return useInfiniteQuery({
    queryKey: ["stories", type, query],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const res = await fetch(
        `/api/stories?type=${type}&page=${pageParam}&query=${encodeURIComponent(query)}`,
      );
      return res.json() as Promise<HNItem[]>;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: HNItem[], allPages: HNItem[][]) => {
      // If the last page has fewer than 12 items, we've reached the end
      if (!lastPage || lastPage.length < 12) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
  });
}

export function useFeaturedStory() {
  return useQuery({
    queryKey: ["featured-story"],
    queryFn: async () => {
      const res = await fetch("/api/stories/featured");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
