"use client";
import { HNItem } from "@/lib/hn-api";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, ThumbsUp, Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { useBookmarks } from "@/app/BookmarkContext";

export const PostCard = memo(function PostCard({ post, onRemove }: { post: HNItem, onRemove?: (id: number) => void }) {
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

  const formattedDate = new Date(post.time * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-[#fef9e8] border border-[#d8c8a8] flex flex-col justify-between group cursor-pointer transition-shadow hover:shadow-[4px_4px_0px_#ebd9b4] overflow-hidden"
      onClick={() => post.url && window.open(post.url, "_blank")}
    >
      <div className="p-6 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] tracking-wider font-semibold px-3 py-1 border border-[#1a1a1a] rounded-full bg-transparent text-[#1a1a1a] uppercase">
            {post.type}
          </span>
          {post.score !== undefined && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#1a1a1a]/60">
              <ThumbsUp size={12} />
              {post.score}
            </div>
          )}
        </div>
        <h3 className="text-[1.35rem] leading-snug font-normal text-[#1a1a1a] mb-3 group-hover:text-[#ff6b00]  group-hover:font-medium transition-colors">
          {post.title}
        </h3>
      </div>

      <div className="flex items-stretch border-t border-[#d8c8a8] h-10 bg-[#f9f3dd]/40">
        <div className="w-28 border-r border-[#d8c8a8] flex items-center px-4 text-[11px] font-medium text-[#1a1a1a]/80">
          {mounted ? formattedDate : "Loading..."}
        </div>
        <div className="flex-[1.5] border-r border-[#d8c8a8] flex items-center px-4 text-[11px] font-medium text-[#1a1a1a]/80 truncate">
          by {post.by}
        </div>
        {post.descendants !== undefined && (
          <Link 
            href={`/story/${post.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-4 border-r border-[#d8c8a8] flex items-center gap-1 text-[11px] font-medium text-[#1a1a1a]/60 hover:text-[#ff6b00] hover:bg-[#ff6b00]/5 transition-colors"
          >
            <MessageSquare size={12} />
            {post.descendants}
          </Link>
        )}
        <button
          onClick={handleToggleBookmark}
          className={`px-4 flex items-center justify-center border-r border-[#d8c8a8] transition-colors ${
            isSaved ? "text-[#ff6b00] bg-[#ff6b00]/5" : "text-[#1a1a1a]/40 hover:text-[#ff6b00] hover:bg-[#ff6b00]/3"
          }`}
          title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
        >
          {isSaved ? <BookmarkCheck size={16} fill="currentColor" /> : <Bookmark size={16} />}
        </button>
        <div className="w-10 flex items-center justify-center text-[#1a1a1a]/40 group-hover:text-white  group-hover:bg-[#ff6b00] transition-colors">
          <ArrowRight size={16} />
        </div>
      </div>
    </motion.div>
  );
});
