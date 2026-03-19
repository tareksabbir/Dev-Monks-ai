/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { HNItem } from "@/lib/hn-api";
import { ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useBookmarks } from "@/context/BookmarkContext";

const PAGE_GRID_STYLE = {
  backgroundImage: `
    linear-gradient(to right, rgba(180,160,120,0.35) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(180,160,120,0.35) 1px, transparent 1px)
  `,
  backgroundSize: "32px 32px",
};

export function FeaturedPost({ post }: { post: HNItem }) {
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
  };

  const formattedDate = new Date(post.time * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="w-full flex justify-center px-6 pb-0"
      style={PAGE_GRID_STYLE}
    >
      <div
        className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 border border-[#1a1a1a] cursor-pointer group shadow-[8px_8px_0px_#ebd9b4] hover:shadow-[12px_12px_0px_#ebd9b4] transition-all"
        onClick={() => post.url && window.open(post.url, "_blank")}
      >
        <div className="flex flex-col justify-between p-8 min-h-60 bg-[#f9f3dd]">
          <div className="flex flex-col items-start gap-4">
            <span className="text-[10px] tracking-wider font-semibold px-3 py-1 border border-[#1a1a1a] rounded-full bg-transparent text-[#1a1a1a] uppercase">
              {post.type}
            </span>
            <h2 className="text-[2rem] leading-tight font-normal text-[#1a1a1a] group-hover:text-[#ff6b00] transition-colors">
              {post.title}
            </h2>
          </div>
        </div>

        <div className="bg-[#f9f3dd] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#1a1a1a] min-h-60">
          <div className="flex-1 p-8"></div>

          <div className="flex items-stretch border-t border-[#1a1a1a]/25 h-10">
            <div className="flex-1 px-4 flex items-center border-r border-[#1a1a1a]/25 text-xs font-medium text-[#1a1a1a]">
              {mounted ? formattedDate : "..."}
            </div>
            <div className="flex-[1.5] px-4 flex items-center border-r border-[#1a1a1a]/25 text-xs font-medium text-[#1a1a1a] truncate">
              by {post.by}
            </div>
            <button
              onClick={handleToggleBookmark}
              className={`w-10 flex items-center justify-center border-r border-[#1a1a1a]/25 transition-colors ${
                isSaved
                  ? "text-[#ff6b00] bg-[#ff6b00]/5"
                  : "text-[#1a1a1a]/40 hover:text-[#ff6b00] hover:bg-black/5"
              }`}
              title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
            >
              {isSaved ? (
                <BookmarkCheck size={16} fill="currentColor" />
              ) : (
                <Bookmark size={16} />
              )}
            </button>
            <div className="w-10 flex items-center justify-center group-hover:bg-[#ff6b00] group-hover:text-white transition-colors">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
