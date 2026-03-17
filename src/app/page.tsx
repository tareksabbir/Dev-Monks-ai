"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedPost } from "@/components/FeaturedPost";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";
import { FooterCTA } from "@/components/FooterCTA";
import { Footer } from "@/components/Footer";
import { POSTS } from "@/lib/data";

export default function MistralBlogPage() {
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const filteredPosts = POSTS.filter((p) => {
    const matchesCategory =
      activeCategory === "All Categories" || p.tag === activeCategory;

    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fffdf4] font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Hero />
        <div className="w-full flex-col flex items-center pb-8">
          <FeaturedPost />
          <div className="w-full max-w-7xl">
            <FilterBar
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <AnimatePresence>
              {filteredPosts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 "
                >
                  {filteredPosts.slice(1).map((post) => (
                    // We slice(1) or just show all since FEATURED_POST handles the first one visually in the SS,

                    // though the real site might just show the rest. I'll show all POSTS starting from id 1 here

                    // as they represent the grid below the featured post.

                    <PostCard key={post.id} post={post} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16 text-[#1a1a1a]/60 px-6"
                >
                  <p className="text-lg">
                    No posts found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setActiveCategory("All Categories");

                      setSearchQuery("");
                    }}
                    className="mt-4 text-sm font-medium text-[#ff6b00] hover:underline"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <Pagination current={1} total={7} />
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
