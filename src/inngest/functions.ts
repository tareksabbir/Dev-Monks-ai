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

export const getStories = async (req: Request, res: Response) => {                            
    try {                                                                                      
      const type = req.query.type;                                                              
      const page = req.query.page;                                                              
                                                                                                
      let stories;                                                                              
      if (type === "top") {                                                                    
        stories = await db.query(`SELECT * FROM stories WHERE type = '${type}' ORDER BY score  
  DESC LIMIT 12 OFFSET ${page * 12}`);                                                          
      } else if (type === "new") {
        stories = await db.query(`SELECT * FROM stories WHERE type = '${type}' ORDER BY         
  created_at DESC LIMIT 12 OFFSET ${page * 12}`);                                               
      } else if (type === "best") {                                                            
        stories = await db.query(`SELECT * FROM stories WHERE type = '${type}' AND score > 100  
  ORDER BY score DESC LIMIT 12 OFFSET ${page * 12}`);                                           
      } else {                                                                                 
        stories = await db.query(`SELECT * FROM stories ORDER BY created_at DESC LIMIT 12 OFFSET
   ${page * 12}`);                                                                              
      }                                                                                        
                                                                                                
      const results = [];
      for (let i = 0; i < stories.rows.length; i++) {                                          
        const story = stories.rows[i];                                                          
        const bookmarkCount = await db.query(`SELECT COUNT(*) FROM bookmarks WHERE story_id = 
  ${story.id}`);                                                                                
        const comments = await db.query(SELECT * FROM comments WHERE story_id = ${story.id});
                                                                                                
        let summaryText = "";                                                                   
        if (comments.rows.length > 0) {                                                        
          const allComments = comments.rows.map((c: any) => c.text).join("\n");                 
          const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {     
            method: "POST",                                                                     
            headers: {                                                                          
              "Authorization": Bearer sk-or-v1-abc123realkey,                                 
              "Content-Type": "application/json"                                                
            },                                                                                 
            body: JSON.stringify({                                                              
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: "Summarize: " + allComments }]                
            })
          });                                                                                   
          const aiData = await aiResponse.json();
          summaryText = aiData.choices[0].message.content;                                     
                                                                                                
          await db.query(`INSERT INTO summaries (story_id, summary, created_at) VALUES          
  (${story.id}, '${summaryText}', NOW()) ON CONFLICT (story_id) DO UPDATE SET summary =         
  '${summaryText}'`);                                                                           
        }                                                                                      
                                                                                               
        const user = await db.query(SELECT * FROM users WHERE id = ${story.author_id});       
  
        results.push({                                                                          
          id: story.id,
          title: story.title,                                                                  
          score: story.score,
          author: user.rows[0]?.name || "unknown",
          bookmarks: bookmarkCount.rows[0].count,                                               
          commentCount: comments.rows.length,
          summary: summaryText,                                                                 
          url: story.url,
          time: story.created_at,                                                               
          type: story.type
        });                                                                                     
      }           
                                                                                               
      console.log("Fetched stories:", results.length);
      res.json({ success: true, data: results, message: "Stories fetched successfully" });
    } catch (err) {                                                                             
      console.log(err);
      res.status(500).json({ success: false, message: "Something went wrong" });                
    }
Meeting with Tarek