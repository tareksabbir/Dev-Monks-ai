/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { HNItem } from "@/types";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { useBookmarks } from "@/context/BookmarkContext";

import { formatDate } from "@/utils";

export const PostCard = memo(function PostCard({
  post,
  onRemove,
}: {
  post: HNItem;
  onRemove?: (id: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isSaved = isBookmarked(post.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    await toggleBookmark(post);
    if (isSaved && onRemove) {
      onRemove(post.id);
    }
  };

  const formattedDate = formatDate(post.time);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-card border border-card-border flex flex-col justify-between group cursor-pointer transition-shadow hover:shadow-[4px_4px_0px_var(--card-shadow)] overflow-hidden"
      onClick={() => post.url && window.open(post.url, "_blank")}
    >
      <div className="p-6 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] tracking-wider font-semibold px-3 py-1 border border-foreground rounded-full bg-transparent text-foreground uppercase">
            {post.type}
          </span>
          {post.score !== undefined && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted">
              <ThumbsUp size={12} />
              {post.score}
            </div>
          )}
        </div>
        <h3 className="text-[1.35rem] leading-snug font-normal text-foreground mb-3 group-hover:text-primary group-hover:font-medium transition-colors">
          {post.title}
        </h3>
      </div>

      <div className="flex items-stretch border-t border-card-border h-10 bg-secondary/40">
        <div className="w-28 border-r border-card-border flex items-center px-4 text-[11px] font-medium text-foreground/80">
          {mounted ? formattedDate : "Loading..."}
        </div>
        <div className="flex-[1.5] border-r border-card-border flex items-center px-4 text-[11px] font-medium text-foreground/80 truncate">
          by {post.by}
        </div>
        {post.descendants !== undefined && (
          <Link
            href={`/story/${post.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-4 border-r border-card-border flex items-center gap-1 text-[11px] font-medium text-muted hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <MessageSquare size={12} />
            {post.descendants}
          </Link>
        )}
        <button
          onClick={handleToggleBookmark}
          className={`px-4 flex items-center justify-center border-r border-card-border transition-colors ${
            isSaved
              ? "text-primary bg-primary/5"
              : "text-foreground/40 hover:text-primary hover:bg-primary/3"
          }`}
          title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
        >
          {isSaved ? (
            <BookmarkCheck size={16} fill="currentColor" />
          ) : (
            <Bookmark size={16} />
          )}
        </button>
        <div className="w-10 flex items-center justify-center text-foreground/40 group-hover:text-white group-hover:bg-primary transition-colors">
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  );
});
