import { getItem, fetchCommentTree } from "@/lib/hn-api";
import CommentTree from "@/components/CommentTree";
import {
  ChevronLeft,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getItem(Number(id));

  if (!story) {
    return (
      <div className="min-h-screen bg-[#fffdf4] flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">
            Story Not Found
          </h1>
          <p className="text-[#1a1a1a]/60 mb-6">
            We couldn&#39;t retrieve the details for this story.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-[#ff6b00] text-white font-bold uppercase tracking-widest text-xs transition-colors hover:bg-[#1a1a1a]"
          >
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  const comments = await fetchCommentTree(story.kids || []);
  const formattedDate = new Date(story.time * 1000).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <>
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a]/60 hover:text-[#ff6b00] transition-colors mb-12 group"
        >
          <div className="w-8 h-8 rounded-full border border-[#1a1a1a]/10 flex items-center justify-center group-hover:border-[#ff6b00]/30 group-hover:bg-[#ff6b00]/5 transition-all">
            <ChevronLeft size={16} />
          </div>
          Back to Feed
        </Link>

        {/* Story Header */}
        <article className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-[10px] tracking-widest font-bold px-3 py-1 border border-[#1a1a1a] rounded-full bg-transparent text-[#1a1a1a] uppercase">
              {story.type}
            </span>
            <div className="flex items-center gap-4 text-xs font-medium text-[#1a1a1a]/40">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={13} /> by {story.by}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-normal text-[#1a1a1a] leading-[1.15] mb-8 tracking-tight">
            {story.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6">
            {story.url && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#ff6b00] transition-all duration-300 shadow-[4px_4px_0px_#ff6b00]/20"
              >
                Read Original <ExternalLink size={14} />
              </a>
            )}

            <div className="flex items-center gap-6 text-[#1a1a1a]/60 py-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#f9f3dd] border border-[#d8c8a8] flex items-center justify-center text-[#1a1a1a]">
                  <ThumbsUp size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#1a1a1a] leading-none">
                    {story.score || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-medium opacity-60">
                    Points
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#f9f3dd] border border-[#d8c8a8] flex items-center justify-center text-[#1a1a1a]">
                  <MessageSquare size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#1a1a1a] leading-none">
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

        {/* Comments Section */}
        <section className="border-t border-[#d8c8a8] pt-12 mt-12">
          <h2 className="text-2xl font-normal text-[#1a1a1a] mb-10 tracking-tight flex items-center gap-3">
            Discussion
            <span className="text-sm font-medium text-[#1a1a1a]/30">
              ({story.descendants || 0})
            </span>
          </h2>
          <div className="bg-transparent">
            <CommentTree comments={comments} />
          </div>
        </section>
      </main>
    </>
  );
}
