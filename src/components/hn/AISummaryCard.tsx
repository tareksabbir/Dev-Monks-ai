import React from "react";
import { Brain, CheckCircle2 } from "lucide-react";

interface AISummaryCardProps {
  summary: string;
  keyPoints: string[];
  sentiment: string;
  children?: React.ReactNode;
}

const sentimentColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  positive: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", dot: "var(--sentiment-positive)" },
  negative: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", dot: "var(--sentiment-negative)" },
  mixed: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", dot: "var(--sentiment-mixed)" },
  neutral: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200", dot: "var(--sentiment-neutral)" },
};

export function AISummaryCard({ summary, keyPoints, sentiment, children }: AISummaryCardProps) {
  const sCol = sentimentColors[sentiment.toLowerCase()] || sentimentColors.neutral;

  return (
    <div className="bg-secondary border border-card-border p-8 rounded-sm shadow-[8px_8px_0px_rgba(216,200,168,0.2)] animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Brain size={24} className="text-primary" /> AI Discussion Insights
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border rounded-full ${sCol.bg} ${sCol.text} ${sCol.border}`}>
            Sentiment: {sentiment}
          </span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: sCol.dot }}
          />
        </div>
      </div>

      <div className="mb-8 relative group">
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Summary</h4>
        <p className="text-foreground leading-relaxed text-lg italic italic-gentle">
          {summary}
        </p>
      </div>

      {keyPoints.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Key Takeaways</h4>
          <ul className="space-y-3">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3 text-foreground/80">
                <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {children && (
        <div className="mt-10 pt-6 border-t border-card-border/50">
          {children}
        </div>
      )}
    </div>
  );
}
