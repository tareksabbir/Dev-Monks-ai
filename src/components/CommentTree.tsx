/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { HNComment } from "@/lib/hn-api";
import { ChevronDown, ChevronRight, User, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Refined colors for nesting depth
const depthColors = [
  "border-[#ff6b00]",
  "border-[#1a1a1a]/20",
  "border-[#1a1a1a]/15",
  "border-[#1a1a1a]/10",
  "border-[#1a1a1a]/5",
];

function timeAgo(timestamp: number): string {
  const diff = Date.now() / 1000 - timestamp;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Comment({
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
        <div className="flex items-center gap-3 text-[11px] font-medium text-[#1a1a1a]/50 mb-3">
          <div className="flex items-center gap-1.5 text-[#1a1a1a]">
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
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#f9f3dd] border border-[#d8c8a8]/50 text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white transition-all cursor-pointer"
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
                className="text-sm text-[#1a1a1a]/80 leading-relaxed prose prose-sm max-w-none wrap-break-word"
                dangerouslySetInnerHTML={{ __html: comment.text }}
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

export default function CommentTree({ comments }: { comments: HNComment[] }) {
  if (!comments.length) {
    return (
      <div className="py-12 text-center bg-[#f9f3dd]/30 border border-dashed border-[#d8c8a8] rounded-xl">
        <p className="text-[#1a1a1a]/40 text-sm font-medium italic">
          No discussion yet for this story.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} depth={0} />
      ))}
    </div>
  );
}
