/* eslint-disable @typescript-eslint/no-unused-vars */
import { CATEGORIES } from "@/lib/data";
import { Dispatch, SetStateAction } from "react";

interface FilterBarProps {
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

export function FilterBar({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-8 px-6">
      <div className="flex items-center gap-2 flex-wrap text-sm">
        <span className="text-[#1a1a1a] font-medium mr-2">Filter by category</span>
        <div className="flex bg-transparent border border-[#1a1a1a] overflow-hidden">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 font-medium transition-colors border-r border-[#1a1a1a] last:border-r-0 ${
                activeCategory === cat
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-transparent text-[#1a1a1a] hover:bg-black/5"
              }`}
            >
              {cat}
              {activeCategory === cat && cat !== "All Categories" && (
                <span className="ml-1 opacity-60">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative shrink-0 w-full md:w-auto">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 8.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search posts ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-4 py-1.5 text-sm bg-transparent border-b border-[#1a1a1a] text-[#1a1a1a] placeholder:text-[#1a1a1a]/60 focus:outline-none w-full md:w-64"
        />
      </div>
    </div>
  );
}
