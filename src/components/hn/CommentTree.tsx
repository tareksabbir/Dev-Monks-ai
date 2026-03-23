"use client";

import { HNComment } from "@/types";

import { Comment } from "./Comment";

export default function CommentTree({ comments }: { comments: HNComment[] }) {
  if (!comments.length) {
    return (
      <div className="py-12 text-center bg-secondary/30 border border-dashed border-card-border rounded-xl">
        <p className="text-foreground/40 text-sm font-medium italic">
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
