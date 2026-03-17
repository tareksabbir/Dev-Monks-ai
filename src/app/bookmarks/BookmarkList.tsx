"use client";

import { useState, useMemo } from "react";
import { HNItem } from "@/lib/hn-api";
import { PostCard } from "@/components/PostCard";
import { Search, Filter, X, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookmarkListProps {
  initialPosts: HNItem[];
}

export function BookmarkList({ initialPosts }: BookmarkListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(12);

  const categories = useMemo(() => {
    const types = new Set(initialPosts.map((p) => p.type));
    return ["all", ...Array.from(types)];
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const searchLower = searchQuery.toLowerCase();
      const words = searchLower.split(/\s+/).filter(Boolean);
      
      const matchesSearch = words.every(word => 
        post.title?.toLowerCase().includes(word) ||
        post.by.toLowerCase().includes(word)
      );
      
      const matchesFilter = activeFilter === "all" || post.type === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [posts, searchQuery, activeFilter]);

  const paginatedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const handleRemove = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className="space-y-12">
      {/* Search and Filter Section - Styled like FilterBar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#d8c8a8]">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/40 font-bold">
            Filter by type
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveFilter(cat);
                  setSearchQuery(""); // Clear search on filter change
                  setVisibleCount(12); // Reset pagination on filter change
                }}
                className={`px-5 py-2 text-[13px] font-medium border transition-all duration-300 capitalize ${
                  activeFilter === cat
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-[4px_4px_0px_#ff6b00]"
                    : "bg-transparent text-[#1a1a1a] border-[#d8c8a8] hover:border-[#1a1a1a] hover:bg-black/5"
                }`}
              >
                {cat === "all" ? "All Items" : cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/40 font-bold">
            Search saved items
          </span>
          <div className="relative group w-full md:w-80">
            <svg
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#1a1a1a]/60 group-focus-within:text-[#ff6b00] transition-colors"
              width="16"
              height="16"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8.5 8.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Titles, authors..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12); // Reset pagination on search
              }}
              className="pl-7 pr-8 py-2 text-sm bg-transparent border-b border-[#d8c8a8] focus:border-[#ff6b00] text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none w-full transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setVisibleCount(12);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1a1a1a]/40 hover:text-[#ff6b00] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredPosts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-24 text-center bg-[#f9f3dd]/20 border border-dashed border-[#d8c8a8] rounded-xl"
        >
          <div className="mx-auto w-16 h-16 bg-[#d8c8a8]/20 flex items-center justify-center rounded-full mb-6">
            <Search className="text-[#1a1a1a]/20" size={32} />
          </div>
          <h2 className="text-2xl font-normal text-[#1a1a1a] mb-2 font-serif">
            {searchQuery 
              ? `No bookmarks found for "${searchQuery}"`
              : `No ${activeFilter === "all" ? "items" : activeFilter} found`}
          </h2>
          <p className="text-[#1a1a1a]/50 max-w-sm mx-auto text-sm leading-relaxed">
            {activeFilter !== "all" 
              ? `You haven't bookmarked any items in the ${activeFilter} category yet.`
              : "Try searching for something else or browse the main feed to save more stories."}
          </p>
          { (searchQuery || activeFilter !== "all") && (
            <button
              onClick={() => { setSearchQuery(""); setActiveFilter("all"); setVisibleCount(12); }}
              className="mt-8 text-[11px] font-bold uppercase tracking-widest text-[#ff6b00] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} onRemove={handleRemove} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPosts.length > visibleCount && (
            <div className="flex justify-center mt-12 pb-8">
              <button
                onClick={loadMore}
                className="group relative px-10 py-4 bg-[#1a1a1a] text-[#fffdf4] font-bold text-sm uppercase tracking-widest hover:bg-[#ff6b00] transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Load More Bookmarks</span>
                <div className="absolute inset-0 bg-[#ff6b00] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="absolute -bottom-1 -right-1 w-full h-full border-r-2 border-b-2 border-[#1a1a1a] group-hover:border-[#ff6b00]" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
