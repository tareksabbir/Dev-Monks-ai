import { inngest } from "./client";
import { fetchCommentsForAI, getItemWithComments } from "@/lib/hn-api";
import { generateSummary } from "@/lib/ai-service";
import { prisma } from "@/lib/prisma";

export const summarizeDiscussion = inngest.createFunction(
  {
    id: "summarize-discussion",
    retries: 2,
    triggers: [{ event: "story/summarize.requested" }],
  },
  async ({ event, step }) => {
    const { storyId, force } = event.data as {
      storyId: number;
      force?: boolean;
    };

    // Step 1: Check for existing summary (force হলে skip)
    if (!force) {
      const existingSummary = await step.run(
        "check-existing-summary",
        async () => {
          return await prisma.summary.findUnique({
            where: { storyId },
          });
        },
      );

      if (existingSummary) return existingSummary;
    }

    // Step 2: HN API থেকে story details আনো (Algolia based)
    const storyData = await step.run("fetch-story-details", async () => {
      const result = await getItemWithComments(storyId);
      if (!result || !result.story)
        throw new Error(`Story ${storyId} not found on Hacker News`);

      return {
        title: result.story.title || "Untitled",
        descendants: result.story.descendants || 0,
      };
    });

    // Step 3: Comments fetch করো
    const comments = await step.run("fetch-comments", async () => {
      return await fetchCommentsForAI(storyId);
    });

    // Comment না থাকলে empty summary save করো
    if (!comments || comments.trim().length === 0) {
      return await step.run("save-empty-summary", async () => {
        return await prisma.summary.upsert({
          where: { storyId },
          update: {
            summary:
              "No discussion found for this story. There are no comments to summarize.",
            keyPoints: JSON.stringify(["No comments available"]),
            sentiment: "neutral",
          },
          create: {
            storyId,
            summary:
              "No discussion found for this story. There are no comments to summarize.",
            keyPoints: JSON.stringify(["No comments available"]),
            sentiment: "neutral",
          },
        });
      });
    }

    // Step 4: OpenRouter দিয়ে AI summary generate করো
    const aiResult = await step.run("generate-ai-summary", async () => {
      return await generateSummary(
        storyData.title || "Untitled",
        comments,
        storyData.descendants || 0,
      );
    });

    // Step 5: Database এ save করো
    const savedSummary = await step.run("save-summary-to-db", async () => {
      return await prisma.summary.upsert({
        where: { storyId },
        update: {
          summary: aiResult.summary,
          keyPoints: JSON.stringify(aiResult.keyPoints),
          sentiment: aiResult.sentiment,
        },
        create: {
          storyId,
          summary: aiResult.summary,
          keyPoints: JSON.stringify(aiResult.keyPoints),
          sentiment: aiResult.sentiment,
        },
      });
    });

    return savedSummary;
  },
);
