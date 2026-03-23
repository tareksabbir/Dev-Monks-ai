"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Terminal, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-20 h-20 bg-red-100 border-2 border-red-200 rounded-full flex items-center justify-center text-red-600 mb-8 shadow-[0_0_40px_rgba(239,68,68,0.1)]"
      >
        <AlertTriangle size={40} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-normal text-foreground tracking-tight mb-4 font-serif">
          System Malfunction
        </h1>
        <p className="text-foreground/60 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          We encountered an unexpected error while processing your request. Our monks are working to fix the glitch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
          <button
            onClick={() => reset()}
            className="group relative px-10 py-4 bg-primary text-white font-bold text-sm uppercase tracking-widest hover:bg-foreground transition-all duration-300 overflow-hidden shadow-[4px_4px_0px_rgba(255,107,0,0.2)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              <RefreshCw size={16} /> Try Again
            </span>
            <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-10 py-4 border border-card-border text-foreground font-bold text-sm uppercase tracking-widest hover:bg-secondary transition-all"
          >
            <Home size={16} /> Return Home
          </Link>
        </div>

        {/* Debug Info (Collapsible ideally, but for now just subtle) */}
        <div className="bg-secondary/50 border border-card-border p-6 rounded-md text-left max-w-xl mx-auto overflow-hidden">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted mb-4">
            <Terminal size={12} />
            <span>Diagnostic Report</span>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-mono text-foreground/40 break-all bg-black/5 p-2 rounded">
              <span className="text-red-600/60 uppercase font-bold mr-2">Error:</span>
              {error.message || "An unknown error occurred"}
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-foreground/30">
                <span className="font-bold mr-1">ID:</span> {error.digest}
              </p>
            )}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[9px] text-foreground/30 italic">
            <ChevronRight size={10} />
            Auto-diagnostic in progress...
          </div>
        </div>
      </motion.div>
    </div>
  );
}
