export interface HNItem {
  id: number;
  deleted?: boolean;
  type: "job" | "story" | "comment" | "poll" | "pollopt" | "ask" | "show";
  by: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface HNComment {
  id: number;
  by: string;
  text: string;
  time: number;
  kids?: number[];
  children: HNComment[]; // nested children
  deleted?: boolean;
  dead?: boolean;
}

export interface AlgoliaHit {
  objectID: string;
  author: string;
  created_at_i: number;
  title: string;
  story_text?: string;
  url?: string;
  points: number;
  num_comments: number;
  _tags: string[];
}

export interface AlgoliaComment {
  id: number;
  author: string | null;
  text: string | null;
  created_at_i: number;
  children?: AlgoliaComment[];
}

export interface AlgoliaItem {
  id: number;
  type: string;
  author: string;
  created_at_i: number;
  title: string;
  text: string | null;
  url: string | null;
  points: number;
  children?: AlgoliaComment[];
}
