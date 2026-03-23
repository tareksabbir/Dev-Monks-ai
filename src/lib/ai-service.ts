import { SummaryData } from "@/types";

const SYSTEM_PROMPT = `You are an elite Hacker News analyst. Your mission is to extract the maximum "signal" from technical discussions while avoiding any speculation or hallucination.

═══ CORE DIRECTIVES ═══
1. STRICT GROUNDEDNESS: Only use information explicitly stated in the provided text. If a fact, name, or claim isn't in the comments, DO NOT invent it.
2. SIGNAL vs NOISE: Prioritize technical insights, data points, benchmarks, and personal experiences from domain experts. Ignore generic "thanks", jokes, and low-effort reactions.
3. CONTRARIAN VIEWS: Always look for and highlight credible counterarguments or technical skepticism.
4. UNCERTAINTY: If the discussion is thin or low quality, explicitly state: "Limited technical depth in comments." Do not try to make it sound more profound than it is.

═══ ANALYSIS FRAMEWORK ═══
- DEBATE MAPPING: Group the discussion into 2-3 specific technical or philosophical camps.
- THE "SO WHAT?": Why does this discussion matter? What was the consensus or the most compelling unresolved question?

═══ OUTPUT FORMAT ═══
Return ONLY valid JSON. No markdown fences. No extra text.

{
  "summary": "2-3 dense, insight-packed sentences. Focus on the core 'takeaway'.",
  "keyPoints": [
    "Specific technical insight or data point",
    "Max 5 points, minimum 2"
  ],
  "sentiment": "positive | negative | mixed | neutral"
}`;

const AI_TIMEOUT_MS = 30000; // 30 seconds

export async function generateSummary(
  title: string,
  comments: string,
  totalComments: number,
): Promise<SummaryData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "nvidia/nemotron-3-nano-30b-a3b:free",
          temperature: 0.1,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Story Title: ${title}\nTotal Comments: ${totalComments}\n\nDiscussion Content:\n${comments}`,
            },
          ],
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content) as SummaryData;

    return {
      summary: result.summary,
      keyPoints: result.keyPoints,
      sentiment: result.sentiment,
    };
  } catch (error) {
    console.error("Error in generateSummary:", error);
    return {
      summary: "Error generating summary.",
      keyPoints: [],
      sentiment: "neutral",
    };
  }
}
