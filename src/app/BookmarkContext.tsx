"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getBookmarkIds, toggleBookmark as toggleAction } from "@/app/actions/bookmarks";
import { HNItem } from "@/lib/hn-api";

interface BookmarkContextType {
  bookmarkIds: Set<number>;
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (item: HNItem) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkIds, setBookmarkIds] = useState<Set<number>>(new Set());

  const refreshBookmarks = async () => {
    try {
      const ids = await getBookmarkIds();
      setBookmarkIds(new Set(ids));
    } catch (error) {
      console.error("Failed to fetch bookmark IDs:", error);
    }
  };

  useEffect(() => {
    refreshBookmarks();
  }, []);

  const isBookmarked = (id: number) => bookmarkIds.has(Number(id));

  const toggleBookmark = async (item: HNItem) => {
    const id = Number(item.id);
    const isCurrentlyBookmarked = bookmarkIds.has(id);
    
    // Optimistic update
    const newIds = new Set(bookmarkIds);
    if (isCurrentlyBookmarked) {
      newIds.delete(id);
    } else {
      newIds.add(id);
    }
    setBookmarkIds(newIds);

    try {
      await toggleAction(item);
    } catch (error) {
      // Rollback on error
      const rollbackIds = new Set(bookmarkIds);
      setBookmarkIds(rollbackIds);
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkIds, isBookmarked, toggleBookmark, refreshBookmarks }}>
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
