export const NAV_LINKS = [
  { label: "Products", hasDropdown: true },
  { label: "Solutions", hasDropdown: true },
  { label: "Research", hasDropdown: true },
  { label: "Blog", hasDropdown: true },
  { label: "Customers", hasDropdown: true },
  { label: "Company", hasDropdown: true },
];

export const CATEGORIES = [
  "All Categories",
  "Product",
  "Research",
  "Engineering",
  "Solutions",
  "Company",
];

// In the screenshot, the duplicate first mock post has Mar 16 vs May 10 
export const FEATURED_POST = {
  title: "Introducing Mistral Small 4",
  tag: "Research",
  date: "May 10, 2024",
  author: "Mistral AI",
};

export const POSTS = [
  {
    id: 1,
    tag: "Research",
    title: "Introducing Mistral Small 4",
    excerpt: "",
    date: "Mar 16, 2026",
    author: "Mistral AI",
  },
  {
    id: 2,
    tag: "Company",
    title: "Mistral AI partners with NVIDIA to accelerate open frontier models",
    excerpt:
      "As a founding member of the NVIDIA Nemotron Coalition, Mistral AI is contributing large-scale model development and multimodal capabilities.",
    date: "Mar 16, 2026",
    author: "Mistral AI",
  },
  {
    id: 3,
    tag: "Research",
    title: "Leanstral: Open-Source foundation for trustworthy vibe-coding",
    excerpt: "First open-source code agent for Lean 4.",
    date: "Mar 16, 2026",
    author: "Mistral AI",
  },
  {
    id: 4,
    tag: "Solutions",
    title:
      "Rails testing on autopilot: Building an agent that writes what developers won't",
    excerpt: "",
    date: "Mar 11, 2026",
    author: "By Maxime Langelier & M...",
  },
  {
    id: 5,
    tag: "Research",
    title: "Voxtral transcribes at the speed of sound.",
    excerpt:
      "Precision diarization, real-time transcription, and a new audio playground.",
    date: "Feb 4, 2026",
    author: "Mistral AI",
  },
  {
    id: 6,
    tag: "Product",
    title: "Terminally online Mistral Vibe.",
    excerpt: "",
    date: "Jan 27, 2026",
    author: "Mistral AI",
  },
  {
    id: 7,
    tag: "Engineering",
    title: "Heaps do lie: debugging a memory leak in vLLM.",
    excerpt: "",
    date: "Jan 21, 2026",
    author: "By Mathis Felardos",
  },
  {
    id: 8,
    tag: "Research",
    title: "Introducing Mistral OCR 3",
    excerpt:
      "Achieving a new frontier for both accuracy and efficiency in document processing.",
    date: "Dec 17, 2025",
    author: "Mistral AI",
  },
  {
    id: 9,
    tag: "Research",
    title: "Introducing: Devstral 2 and Mistral Vibe CLI.",
    excerpt:
      "State-of-the-art, open-source agentic coding models and CLI agent.",
    date: "Dec 9, 2025",
    author: "Mistral AI",
  },
];

export const TAG_COLORS: Record<string, string> = {
  Research: "bg-[#fdfaf5] text-[#1a1a1a] border-[#1a1a1a]",
  Company: "bg-[#fdfaf5] text-[#1a1a1a] border-[#1a1a1a]",
  Product: "bg-[#fdfaf5] text-[#1a1a1a] border-[#1a1a1a]",
  Engineering: "bg-[#fdfaf5] text-[#1a1a1a] border-[#1a1a1a]",
  Solutions: "bg-[#fdfaf5] text-[#1a1a1a] border-[#1a1a1a]",
};
