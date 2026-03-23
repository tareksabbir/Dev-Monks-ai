import { prisma } from "./prisma";

/**
 * Fetch existing AI summary for a story from the database.
 */
export async function getStorySummary(storyId: number) {
  try {
    const summary = await prisma.summary.findUnique({
      where: { storyId },
    });

    if (!summary) return null;

    return {
      summary: summary.summary,
      keyPoints: JSON.parse(summary.keyPoints) as string[],
      sentiment: summary.sentiment,
    };
  } catch (error) {
    console.error(`Error fetching summary for story ${storyId}:`, error);
    return null;
  }
}
