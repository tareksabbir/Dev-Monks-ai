"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: ErrorAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 bg-red-50/50 border border-red-200/50 rounded-xl flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left ${className}`}
    >
      <div className="w-12 h-12 bg-sentiment-negative/10 flex items-center justify-center rounded-full shrink-0">
        <AlertTriangle size={24} className="text-sentiment-negative" />
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-sentiment-negative">
          {title}
        </h3>
        <p className="text-foreground/70 text-sm leading-relaxed max-w-lg">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2 bg-foreground text-background text-[11px] font-bold uppercase tracking-widest hover:bg-primary transition-all duration-300 rounded-lg group"
        >
          <RefreshCw
            size={14}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          Try Again
        </button>
      )}
    </motion.div>
  );
}
