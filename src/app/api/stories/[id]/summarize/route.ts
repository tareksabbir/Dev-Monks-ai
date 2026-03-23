/* eslint-disable @typescript-eslint/no-explicit-any */
import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface SummarizeRequestBody {
  force?: boolean;
}

// POST: Trigger summarization (with optional force re-summarize)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storyId = Number(id);

  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid story ID" }, { status: 400 });
  }

  // Parse optional force flag from request body
  let force = false;
  try {
    const body: SummarizeRequestBody = await req.json();
    force = body?.force === true;
  } catch {
    // No body or invalid JSON — that's fine, default force=false
  }

  // If not forcing, check if summary already exists
  if (!force) {
    const existing = await prisma.summary.findUnique({
      where: { storyId },
    });
    if (existing) {
      return NextResponse.json({ status: "completed", summary: existing });
    }
  }

  // Trigger the background function via Inngest
  try {
    await inngest.send({
      name: "story/summarize.requested",
      data: { storyId, force },
    });

    return NextResponse.json({ 
      status: "processing", 
      message: "Summarization started" 
    });
  } catch (error: any) {
    console.error("Failed to trigger summarization:", error);

    // Specific handling for Inngest connection issues (ECONNREFUSED)
    const isConnError = 
      error?.message?.includes("fetch failed") || 
      error?.cause?.code === "ECONNREFUSED" ||
      error?.code === "ECONNREFUSED";

    if (isConnError) {
      return NextResponse.json(
        { 
          error: "Background service unreachable",
          message: "The summarization engine is currently offline.",
          suggestion: process.env.NODE_ENV === "development" 
            ? "Ensure Inngest Dev Server is running: 'npx inngest-cli@latest dev'"
            : "Please try again in a few minutes."
        }, 
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to initiate analysis", message: error.message }, 
      { status: 500 }
    );
  }
}

// GET: Check summary status / fetch existing summary (for polling)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storyId = Number(id);

  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid story ID" }, { status: 400 });
  }

  try {
    const summary = await prisma.summary.findUnique({
      where: { storyId },
    });

    if (summary) {
      return NextResponse.json({
        status: "completed",
        summary: {
          ...summary,
          keyPoints: JSON.parse(summary.keyPoints),
        },
      });
    }

    return NextResponse.json({ status: "pending" });
  } catch (error) {
    console.error("Failed to fetch summary:", error);
    return NextResponse.json(
      { error: "Failed to check analysis status" },
      { status: 500 }
    );
  }
}

// DELETE: Remove summary from database
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storyId = Number(id);

  if (isNaN(storyId)) {
    return NextResponse.json({ error: "Invalid story ID" }, { status: 400 });
  }

  try {
    await prisma.summary.delete({
      where: { storyId },
    });
    return NextResponse.json({ status: "deleted", message: "Summary removed" });
  } catch (error) {
    console.error("Failed to delete summary:", error);
    // If it doesn't exist, that's also fine (already "deleted")
    return NextResponse.json({ status: "success", message: "Summary already removed or not found" });
  }
}
