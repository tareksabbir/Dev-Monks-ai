"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookmarkIds,
  toggleBookmark as toggleAction,
} from "@/app/actions/bookmarks";
import { HNItem } from "@/types";

interface BookmarkContextType {
  bookmarkIds: Set<number>;
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (item: HNItem) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: bookmarkIdsArray = [], refetch } = useQuery({
    queryKey: ["bookmarks", "ids"],
    queryFn: () => getBookmarkIds(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const bookmarkIds = useMemo(
    () => new Set(bookmarkIdsArray),
    [bookmarkIdsArray],
  );

  const mutation = useMutation({
    mutationFn: (item: HNItem) => toggleAction(item),
    onMutate: async (item) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["bookmarks", "ids"] });

      // Snapshot the previous value
      const previousIds =
        queryClient.getQueryData<number[]>(["bookmarks", "ids"]) || [];

      // Optimistically update to the new value
      const id = Number(item.id);
      const isCurrentlyBookmarked = previousIds.includes(id);
      const newIds = isCurrentlyBookmarked
        ? previousIds.filter((bid) => bid !== id)
        : [...previousIds, id];

      queryClient.setQueryData(["bookmarks", "ids"], newIds);

      // Return a context object with the snapshotted value
      return { previousIds };
    },
    onError: (err, item, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context) {
        queryClient.setQueryData(["bookmarks", "ids"], context.previousIds);
      }
      console.error("Failed to toggle bookmark:", err);
    },
    onSettled: () => {
      // Always refetch after error or success to keep server state in sync
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "ids"] });
      // Also invalidate bookmarks list if you have one
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "list"] });
    },
  });

  const isBookmarked = (id: number) => bookmarkIds.has(Number(id));

  const toggleBookmark = async (item: HNItem) => {
    mutation.mutate(item);
  };

  const refreshBookmarks = async () => {
    await refetch();
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarkIds, isBookmarked, toggleBookmark, refreshBookmarks }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
