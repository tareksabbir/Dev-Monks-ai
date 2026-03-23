/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useEffect } from "react";
import { HNComment } from "@/types";
import { ChevronDown, ChevronRight, User, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { timeAgo } from "@/utils";

// Refined colors for nesting depth
const depthColors = [
  "border-primary",
  "border-foreground/20",
  "border-foreground/15",
  "border-foreground/10",
  "border-foreground/5",
];

export function Comment({
  comment,
  depth = 0,
}: {
  comment: HNComment;
  depth?: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const borderColor = depthColors[depth % depthColors.length];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!comment.text && !comment.deleted) return null;

  return (
    <div className={`relative ${depth > 0 ? "mt-6 ml-1 sm:ml-4" : "mb-8"}`}>
      {/* Decorative vertical line for hierarchy */}
      <div
        className={`absolute left-0 top-0 bottom-0 border-l-2 ${borderColor} opacity-60 rounded-full`}
      />

      <div className="pl-6">
        {/* Header */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-muted mb-3">
          <div className="flex items-center gap-1.5 text-foreground">
            <User size={12} className="opacity-40" />
            <span className="font-bold">
              {comment.deleted ? "[deleted]" : comment.by}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="opacity-40" />
            <span>{mounted ? timeAgo(comment.time) : "..."}</span>
          </div>

          {comment.children.length > 0 && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary border border-card-border/50 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
            >
              {collapsed ? (
                <ChevronRight size={10} />
              ) : (
                <ChevronDown size={10} />
              )}
              <span className="text-[9px] uppercase tracking-tighter font-bold">
                {collapsed ? `${comment.children.length} replies` : "collapse"}
              </span>
            </button>
          )}
        </div>

        {/* Comment Text */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div
                className="text-sm text-foreground/80 leading-relaxed prose prose-sm max-w-none wrap-break-word"
                dangerouslySetInnerHTML={{ __html: comment.text || "" }}
              />

              {/* Recursive Children */}
              {comment.children.length > 0 && (
                <div className="mt-2">
                  {comment.children.map((child) => (
                    <Comment key={child.id} comment={child} depth={depth + 1} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
