/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { CATEGORIES } from "@/lib/data";
import { useState, useEffect, memo } from "react";

interface FilterBarProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FilterBar = memo(function FilterBar({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
}: FilterBarProps) {
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  // Sync local input with global search query when it's reset from outside
  useEffect(() => {
    if (searchQuery === "") {
      setInputValue("");
    }
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-12 px-6">
      <div className="flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
          Explore by type
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-[13px] font-medium border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-foreground text-white border-foreground shadow-[4px_4px_0px_var(--primary)]"
                  : "bg-transparent text-foreground border-card-border hover:border-foreground hover:bg-black/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
          Find stories
        </span>
        <div className="relative group">
          <svg
            className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/60 group-focus-within:text-primary transition-colors"
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle
              cx="5.5"
              cy="5.5"
              r="4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8.5 8.5l3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Keywords, titles, or authors..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-7 pr-4 py-2 text-sm bg-transparent border-b border-card-border focus:border-primary text-foreground placeholder:text-foreground/30 focus:outline-none w-full md:w-72 transition-all"
          />
        </div>
      </div>
    </div>
  );
});
