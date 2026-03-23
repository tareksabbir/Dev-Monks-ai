"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12"
      >
        {/* Decorative background element */}
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -z-10" />
        
        <div className="w-24 h-24 bg-secondary border-2 border-card-border rounded-2xl flex items-center justify-center text-primary relative shadow-[8px_8px_0px_var(--card-shadow)] mb-8 mx-auto">
          <FileQuestion size={48} strokeWidth={1.5} />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold">
            ?
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-normal text-foreground tracking-tighter mb-4 font-serif">
          404: Story Not Found
        </h1>
        <p className="text-foreground/60 max-w-md mx-auto text-lg leading-relaxed">
          The page you are looking for has been archived, moved, or never existed in the first place.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <Link
          href="/"
          className="group relative px-8 py-4 bg-foreground text-background font-bold text-sm uppercase tracking-widest hover:bg-primary transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Home size={16} /> Back to Home
          </span>
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <div className="absolute -bottom-1 -right-1 w-full h-full border-r-2 border-b-2 border-foreground group-hover:border-primary" />
        </Link>

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-8 py-4 text-foreground/60 hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-24 pt-12 border-t border-card-border/30 w-full max-w-lg"
      >
        <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-foreground/20">
          <Search size={14} />
          <span>Searching the archives...</span>
        </div>
      </motion.div>
    </div>
  );
}
