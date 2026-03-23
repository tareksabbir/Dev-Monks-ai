/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBookmarks } from "@/app/actions/bookmarks";
import { Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BookmarkList } from "./BookmarkList";
import { HNItem } from "@/types";
import { Bookmark as BookmarkType } from "@/generated/prisma";

export default async function BookmarksPage() {
  const bookmarks = await getBookmarks();

  // Map database bookmarks back to HNItem structure for PostCard
  const initialPosts: HNItem[] = bookmarks.map((b: BookmarkType) => ({
    id: b.storyId,
    title: b.title,
    url: b.url || undefined,
    by: b.author,
    score: b.score,
    time: b.time,
    descendants: b.descendants,
    type: (b.type as any) || "story", // Use the stored type
  }));

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <header className="mb-12 lg:mb-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Feed
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-normal text-foreground tracking-tight">
            My Bookmarks
          </h1>
        </div>
        <p className="text-foreground/60 max-w-2xl text-lg">
          Your private collection of saved stories. These are stored securely
          and are only visible to you.
        </p>
      </header>

      {initialPosts.length === 0 ? (
        <div className="py-24 text-center bg-secondary/40 border border-dashed border-card-border rounded-3xl">
          <Bookmark className="mx-auto text-foreground/10 mb-6" size={64} />
          <h2 className="text-2xl font-medium text-foreground mb-3">
            No bookmarks yet
          </h2>
          <p className="text-foreground/60 mb-10 max-w-sm mx-auto">
            Stories you bookmark will appear here for easy access later.
          </p>
          <Link
            href="/"
            className="inline-flex px-10 py-4 bg-foreground text-white text-sm font-bold uppercase tracking-widest hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all rounded-full"
          >
            Browse Stories
          </Link>
        </div>
      ) : (
        <BookmarkList initialPosts={initialPosts} />
      )}
    </main>
  );
}
