"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hero } from "@/components/layout/Hero";
import { FeaturedPost } from "@/components/hn/FeaturedPost";
import { FilterBar } from "@/components/hn/FilterBar";
import { PostCard } from "@/components/hn/PostCard";
import { PostCardSkeleton } from "@/components/ui/PostCardSkeleton";
import { FeaturedPostSkeleton } from "@/components/ui/FeaturedPostSkeleton";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { useStories, useFeaturedStory } from "@/hooks/useStories";
import { HNItem } from "@/types";
import { useMemo, useCallback } from "react";
import { Search, RotateCcw } from "lucide-react";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

// Mapping categories to HN types - outside component for stable reference
const getHNType = (
  category: string,
): "top" | "new" | "best" | "ask" | "show" | "job" | "all" => {
  switch (category) {
    case "All":
      return "all";
    case "New":
      return "new";
    case "Best":
      return "best";
    case "Ask HN":
      return "ask";
    case "Show HN":
      return "show";
    case "Jobs":
      return "job";
    default:
      return "top";
  }
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useStories(getHNType(activeCategory), searchQuery);

  const { data: featuredPost, isLoading: isFeaturedLoading, isError: isFeaturedError, refetch: refetchFeatured } =
    useFeaturedStory();

  const allPosts = useMemo(
    () => (data?.pages.flat() || []) as HNItem[],
    [data?.pages],
  );
  const featured = featuredPost as HNItem | undefined;

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setSearchQuery(""); // Clear search when switching categories
  }, []);

  return (
    <main className="flex-1 flex flex-col w-full">
      <Hero />
      <div className="w-full flex-col flex items-center pb-8">
        {isFeaturedLoading && !featured ? (
          <FeaturedPostSkeleton />
        ) : isFeaturedError ? (
          <div className="w-full max-w-7xl px-6 lg:px-0 mb-12">
            <ErrorAlert 
              title="Featured Content Unavailable"
              message="We couldn't retrieve the featured monk's pick. You might want to try again."
              onRetry={refetchFeatured}
            />
          </div>
        ) : (
          featured && <FeaturedPost post={featured} />
        )}

        <div className="w-full max-w-7xl">
          <FilterBar
            activeCategory={activeCategory}
            setActiveCategory={handleCategoryChange}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <div className="min-h-150">
            {isError ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <ErrorAlert 
                  title="Story Feed Interrupted"
                  message="We're having trouble reaching the Hacker News servers. Please check your connection and try again."
                  onRetry={refetch}
                  className="max-w-2xl"
                />
              </div>
            ) : isLoading && allPosts.length === 0 ? (
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
                        .filter((post) => post.id !== featured?.id)
                        .map((post) => (
                          <PostCard key={post.id} post={post} />
                        ))}
                    </motion.div>

                    {isFetchingNextPage && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 lg:px-0 mt-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <PostCardSkeleton key={`more-${i}`} />
                        ))}
                      </div>
                    )}

                    {hasNextPage && (
                      <div className="flex justify-center mt-16 pb-12">
                        <button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="group relative px-10 py-4 bg-foreground text-background font-bold text-sm uppercase tracking-widest hover:bg-primary transition-all duration-300 disabled:opacity-50 overflow-hidden"
                        >
                          <span className="relative z-10">
                            {isFetchingNextPage
                              ? "Please Wait A moment..."
                              : "Load More Stories"}
                          </span>
                          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                          <div className="absolute -bottom-1 -right-1 w-full h-full border-r-2 border-b-2 border-foreground group-hover:border-primary" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-24 text-center bg-secondary/20 border border-dashed border-card-border rounded-xl"
                  >
                    <div className="mx-auto w-16 h-16 bg-card-border/20 flex items-center justify-center rounded-full mb-6 text-foreground/20">
                      <Search size={32} />
                    </div>
                    <h2 className="text-2xl font-normal text-foreground mb-2 font-serif">
                      No matching stories found
                    </h2>
                    <p className="text-foreground/50 max-w-sm mx-auto text-sm leading-relaxed mb-8">
                      We couldn&#39;t find any stories for &quot;{searchQuery}&quot; in the {activeCategory} category.
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory("All");
                        setSearchQuery("");
                      }}
                      className="text-[11px] font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <div className="w-full border-t border-card-border mt-8">
        <FooterCTA />
      </div>
    </main>
  );
}
