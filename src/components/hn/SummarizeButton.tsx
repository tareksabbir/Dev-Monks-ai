"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp, Brain, CheckCircle2, Trash2, AlertTriangle } from "lucide-react";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SummaryData } from "@/types";
import { AISummaryCard } from "./AISummaryCard";

interface SummarizeButtonProps {
  storyId: number;
  initialSummary?: SummaryData | null;
}

export default function SummarizeButton({ storyId, initialSummary }: SummarizeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(initialSummary || null);
  const [expanded, setExpanded] = useState(!!initialSummary);
  const [error, setError] = useState<string | null>(null);
  // Poll for summary completion
  const pollForSummary = useCallback(async () => {
    const maxAttempts = 30; // 30 * 2s = 60s max wait
    let attempts = 0;

    const poll = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        setError("Summary is taking longer than expected. Please try again later.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/stories/${storyId}/summarize`);
        const data = await res.json();

        if (data.status === "completed" && data.summary) {
          const keyPoints = Array.isArray(data.summary.keyPoints)
            ? data.summary.keyPoints
            : JSON.parse(data.summary.keyPoints || "[]");

          setSummary({
            summary: data.summary.summary,
            keyPoints,
            sentiment: data.summary.sentiment,
          });
          setExpanded(true);
          setLoading(false);
          return;
        }

        // Still processing — poll again
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return poll();
      } catch {
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return poll();
      }
    };

    return poll();
  }, [storyId]);

  const handleSummarize = async (force = false) => {
    setLoading(true);
    setError(null);

    try {
      // If force is true, delete the old summary first as per user request
      if (force) {
        await fetch(`/api/stories/${storyId}/summarize`, {
          method: "DELETE",
        });
        setSummary(null); // Clear local state to show the animation
      }

      const res = await fetch(`/api/stories/${storyId}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to start summarization");
      }

      // If summary already exists and was returned immediately (should only happen if force=false)
      if (data.status === "completed" && data.summary) {
        const keyPoints = Array.isArray(data.summary.keyPoints)
          ? data.summary.keyPoints
          : JSON.parse(data.summary.keyPoints || "[]");

        setSummary({
          summary: data.summary.summary,
          keyPoints,
          sentiment: data.summary.sentiment,
        });
        setExpanded(true);
        setLoading(false);
        return;
      }

      // Summary is being generated — start polling
      await pollForSummary();
    } catch (err: any) {
      console.error("AI summarization failed:", err);
      setError(err.message || "Failed to start summarization. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this summary?")) return;
    
    setLoading(true);
    try {
      await fetch(`/api/stories/${storyId}/summarize`, {
        method: "DELETE",
      });
      setSummary(null);
      setExpanded(false);
    } catch (err) {
      console.error("Failed to delete summary:", err);
      setError("Failed to remove summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Premium AI Generation Animation
  if (loading && !summary) {
    return (
      <div className="mb-12 animate-in fade-in duration-500">
        <div className="bg-secondary border-2 border-dashed border-primary/30 p-10 rounded-sm shadow-[8px_8px_0px_rgba(255,107,0,0.1)] relative overflow-hidden">
          {/* Moving Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Sparkles size={32} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">AI Agent Analysis in Progress</h3>
            <p className="text-foreground/60 text-sm max-w-md mx-auto leading-relaxed">
              Our agent is reading through the discussion, identifying key debates, and extracting the most important insights for you.
            </p>
            
            <div className="mt-8 flex gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
          </div>
          
          {/* Skeleton lines to simulate reading */}
          <div className="mt-12 space-y-4 opacity-20">
            <div className="h-3 bg-foreground rounded-full w-3/4 animate-pulse"></div>
            <div className="h-3 bg-foreground rounded-full w-1/2 animate-pulse [animation-delay:0.2s]"></div>
            <div className="h-3 bg-foreground rounded-full w-2/3 animate-pulse [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  // If we have a summary, show it
  if (summary) {
    return (
      <div className="mb-12">
        {/* Toggle button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-white text-sm font-bold uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-[4px_4px_0px_rgba(255,107,0,0.2)]"
        >
          <Sparkles size={16} className="text-primary" />
          {expanded ? "Hide AI Insights" : "View AI Insights"}
          <span
            className="inline-block w-2 h-2 rounded-full ml-1"
            style={{ 
              backgroundColor: 
                summary.sentiment.toLowerCase() === "positive" ? "var(--sentiment-positive)" :
                summary.sentiment.toLowerCase() === "negative" ? "var(--sentiment-negative)" :
                summary.sentiment.toLowerCase() === "mixed" ? "var(--sentiment-mixed)" : "var(--sentiment-neutral)"
            }}
          />
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expanded && (
          <div className="mt-6">
            <AISummaryCard 
              summary={summary.summary} 
              keyPoints={summary.keyPoints} 
              sentiment={summary.sentiment}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleSummarize(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      Regenerate Analysis
                    </>
                  )}
                </button>

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                  Remove Analysis
                </button>
              </div>
            </AISummaryCard>
          </div>
        )}
      </div>
    );
  }

  // No summary yet — show the generate button
  return (
    <div className="mb-16">
      <button
        onClick={() => handleSummarize(false)}
        disabled={loading}
        className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-white text-sm font-bold uppercase tracking-widest hover:bg-primary transition-all duration-300 shadow-[6px_6px_0px_rgba(255,107,0,0.2)] disabled:opacity-70 group"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> 
            <span className="ml-2">Analyzing Discussion...</span>
          </>
        ) : (
          <>
            Summarize with AI 
            <Sparkles size={18} className="text-primary group-hover:scale-110 transition-transform" />
          </>
        )}
      </button>
      {error && (
        <ErrorAlert 
          title="Analysis Error"
          message={error}
          className="mt-6"
        />
      )}
    </div>
  );
}
