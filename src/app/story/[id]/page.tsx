import { getItemWithComments } from "@/lib/hn-api";
import { HNItem, HNComment } from "@/types";
import CommentTree from "@/components/hn/CommentTree";
import {
  ChevronLeft,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { getStorySummary } from "@/lib/story-service";
import SummarizeButton from "@/components/hn/SummarizeButton";
import { timeAgo } from "@/utils";
import { notFound } from "next/navigation";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getItemWithComments(Number(id));

  if (!result || !result.story) {
    notFound();
  }

  const { story, comments } = result;
  const formattedDate = new Date(story.time * 1000).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  // AI Summary চেক করা (using service)
  const existingSummary = await getStorySummary(Number(id));

  return (
    <>
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-primary transition-colors mb-12 group"
        >
          <div className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
            <ChevronLeft size={16} />
          </div>
          Back to Feed
        </Link>

        {/* Story Header */}
        <article className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-[10px] tracking-widest font-bold px-3 py-1 border border-foreground rounded-full bg-transparent text-foreground uppercase">
              {story.type}
            </span>
            <div className="flex items-center gap-4 text-xs font-medium text-foreground/40">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={13} /> by {story.by}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-normal text-foreground leading-[1.15] mb-8 tracking-tight">
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6">
            {story.url && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white text-sm font-bold uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-[4px_4px_0px_rgba(255,107,0,0.2)]"
              >
                Read Original <ExternalLink size={14} />
              </a>
            )}

            <div className="flex items-center gap-6 text-foreground/60 py-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-secondary border border-card-border flex items-center justify-center text-foreground">
                  <ThumbsUp size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground leading-none">
                    {story.score || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-medium opacity-60">
                    Points
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-secondary border border-card-border flex items-center justify-center text-foreground">
                  <MessageSquare size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground leading-none">
                    {story.descendants || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-medium opacity-60">
                    Comments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* AI Summary Section */}
        {story.descendants && story.descendants > 0 ? (
          <div className="mb-16">
            <SummarizeButton
              storyId={Number(id)}
              initialSummary={existingSummary}
            />
          </div>
        ) : null}

        {/* Comments Section */}
        <section className="border-t border-card-border pt-12 mt-12">
          <h2 className="text-2xl font-normal text-foreground mb-10 tracking-tight flex items-center gap-3">
            Discussion
            <span className="text-sm font-medium text-foreground/30">
              ({story.descendants || 0})
            </span>
          </h2>
          <div className="bg-transparent">
            <CommentTree comments={comments} />
          </div>
        </section>
      </div>
    </>
  );
}
