"use client";

import { motion } from "framer-motion";

const PAGE_GRID_STYLE = {
  backgroundImage: `
    linear-gradient(to right, rgba(180,160,120,0.35) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(180,160,120,0.35) 1px, transparent 1px)
  `,
  backgroundSize: "32px 32px",
};

export function Hero() {
  return (
    <section className="w-full relative border-b border-[#faf0de] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Grid constrained to max-w-7xl, centered */}
      <div className="absolute inset-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-7xl h-full" style={PAGE_GRID_STYLE} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 text-center max-w-5xl mx-auto">
        <motion.h1
          className="text-[2.75rem] md:text-6xl font-normal text-[#1a1a1a] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Latest updates from Hacker News.
        </motion.h1>
      </div>
    </section>
  );
}
