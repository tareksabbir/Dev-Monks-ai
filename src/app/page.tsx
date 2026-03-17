"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedPost } from "@/components/FeaturedPost";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { PostCardSkeleton, FeaturedPostSkeleton } from "@/components/PostCardSkeleton";
import { FooterCTA } from "@/components/FooterCTA";
import { Footer } from "@/components/Footer";
import { useStories, useFeaturedStory } from "@/hooks/useStories";
import { HNItem } from "@/lib/hn-api";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mapping categories to HN types
  const getHNType = (category: string): "top" | "new" | "best" | "ask" | "show" | "job" | "all" => {
    switch (category) {
      case "All": return "all";
      case "New": return "new";
      case "Best": return "best";
      case "Ask HN": return "ask";
      case "Show HN": return "show";
      case "Jobs": return "job";
      default: return "top";
    }
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, isPlaceholderData } = useStories(
    getHNType(activeCategory), 
    searchQuery
  );

  const { data: featuredPost, isLoading: isFeaturedLoading } = useFeaturedStory();

  const allPosts = (data?.pages.flat() || []) as HNItem[];
  const featured = featuredPost as HNItem | undefined;

  return (
    <div className="min-h-screen bg-[#fffdf4] font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Hero />
        <div className="w-full flex-col flex items-center pb-8">
          {isFeaturedLoading && !featured ? (
            <FeaturedPostSkeleton />
          ) : (
            featured && <FeaturedPost post={featured} />
          )}
          
          <div className="w-full max-w-7xl">
            <FilterBar
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            <div className="min-h-[600px]">
              {(isLoading || isPlaceholderData) && allPosts.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-0">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {allPosts.length > 0 ? (
                    <>
                      <motion.div
                        key={`${activeCategory}-${searchQuery}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-0"
                      >
                        {allPosts
                          .filter(post => post.id !== featured?.id)
                          .map((post) => (
                            <PostCard key={post.id} post={post} />
                          ))}
                      </motion.div>
                      
                      {hasNextPage && (
                        <div className="flex justify-center mt-16 pb-12">
                          <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="group relative px-10 py-4 bg-[#1a1a1a] text-[#fffdf4] font-bold text-sm uppercase tracking-widest hover:bg-[#ff6b00] transition-all duration-300 disabled:opacity-50 overflow-hidden"
                          >
                            <span className="relative z-10">
                              {isFetchingNextPage ? "Please Wait A moment..." : "Load More Stories"}
                            </span>
                            <div className="absolute inset-0 bg-[#ff6b00] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <div className="absolute -bottom-1 -right-1 w-full h-full border-r-2 border-b-2 border-[#1a1a1a] group-hover:border-[#ff6b00]" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-16 text-[#1a1a1a]/60 px-6"
                    >
                      <p className="text-lg">No posts found matching your criteria.</p>
                      <button
                        onClick={() => {
                          setActiveCategory("All");
                          setSearchQuery("");
                        }}
                        className="mt-4 text-sm font-medium text-[#ff6b00] hover:underline"
                      >
                        Clear filters
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
        <div className="w-full border-t border-[#d8c8a8] mt-8">
          <FooterCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
