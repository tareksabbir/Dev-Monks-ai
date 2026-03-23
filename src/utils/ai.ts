export const sentimentColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  positive: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", dot: "var(--sentiment-positive)" },
  negative: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", dot: "var(--sentiment-negative)" },
  mixed: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", dot: "var(--sentiment-mixed)" },
  neutral: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200", dot: "var(--sentiment-neutral)" },
};
