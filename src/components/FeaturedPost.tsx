"use client";

import { FEATURED_POST } from "@/lib/data";
import { ArrowRight } from "lucide-react";

const PAGE_GRID_STYLE = {
  backgroundImage: `
    linear-gradient(to right, rgba(180,160,120,0.35) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(180,160,120,0.35) 1px, transparent 1px)
  `,
  backgroundSize: "32px 32px",
};



export function FeaturedPost() {
  return (
    /* Outer wrapper: grid lives HERE on the page background, behind the card */
    <div
      className="w-full flex justify-center px-6 pb-0"
      style={PAGE_GRID_STYLE}
    >
      {/* Card: solid opaque backgrounds — grid is blocked, card pops out */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 border border-[#1a1a1a]">

        {/* Left Side: plain #f8f5ea — no grid */}
        <div className="flex flex-col justify-between p-8 min-h-60 bg-[#f9f3dd]">
          <div className="flex flex-col items-start gap-4">
            <span className="text-[10px] tracking-wider font-semibold px-3 py-1 border border-[#1a1a1a] rounded-full bg-transparent text-[#1a1a1a]">
              {FEATURED_POST.tag}
            </span>
            <h2 className="text-[2rem] leading-tight font-normal text-[#1a1a1a]">
              {FEATURED_POST.title}
            </h2>
          </div>
        </div>

        {/* Right Side: plain #f0e8d0 — no grid */}
        <div className="bg-[#f9f3dd] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#1a1a1a] min-h-60">
          {/* Top empty area */}
          <div className="flex-1" />

          {/* Footer row */}
          <div className="flex items-stretch border-t border-[#1a1a1a]/25 h-10">
            <div className="flex-1 px-4 flex items-center border-r border-[#1a1a1a]/25 text-xs font-medium text-[#1a1a1a]">
              {FEATURED_POST.date}
            </div>
            <div className="flex-[1.5] px-4 flex items-center border-r border-[#1a1a1a]/25 text-xs font-medium text-[#1a1a1a]">
              {FEATURED_POST.author}
            </div>
            <div className="w-10 flex items-center justify-center hover:bg-black/5 cursor-pointer transition-colors">
              <ArrowRight size={14} color="#1a1a1a" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}