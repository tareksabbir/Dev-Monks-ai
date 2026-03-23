# Dev Monks — AI-Powered Hacker News Reader

A modern, beautifully-designed Hacker News reader with AI-powered discussion summarization. Built as a full-stack application using Next.js 16, it fetches real-time stories from Hacker News, allows users to bookmark them, and uses an AI agent to generate intelligent summaries of comment discussions.

> **Quick Start:** `docker compose up --build` → Open [http://localhost:3000](http://localhost:3000)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture & System Design](#architecture--system-design)
- [Data Flow](#data-flow)
- [Getting Started](#getting-started)
- [Approach & Design Decisions](#approach--design-decisions)
- [Tradeoffs](#tradeoffs)
- [Future Improvements](#future-improvements)

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server Components, Server Actions, API Routes in one framework |
| **Language** | TypeScript | Type safety across the entire stack |
| **Database** | PostgreSQL 16 + Prisma 7 | Reliable relational DB with type-safe ORM |
| **Data Source** | Algolia HN API | Single-request fetching of stories + all nested comments (10-20x faster than official Firebase API) |
| **AI Engine** | OpenRouter (nvidia/nemotron-3-nano) | Free-tier LLM access with structured JSON output |
| **Background Jobs** | Inngest | Durable, step-based functions with automatic retries for AI summarization pipeline |
| **State Management** | React Query (TanStack) | Server state caching, infinite scroll pagination, and optimistic updates |
| **Styling** | Tailwind CSS 4 | Utility-first CSS with custom design system |
| **Animations** | Framer Motion | Smooth page transitions and micro-interactions |
| **Icons** | Lucide React | Consistent, lightweight icon set |
| **Containerization** | Docker + Docker Compose | One-command deployment with all services |

---

## Architecture & System Design

```
┌──────────────────────────────────────────────────────────────────┐
│                        DOCKER COMPOSE                            │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                   Next.js App (:3000)                   │     │
│  │                                                          │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │     │
│  │  │  App Router   │  │  API Routes  │  │Server Actions │  │     │
│  │  │  (SSR Pages)  │  │  /api/*      │  │  (Bookmarks)  │  │     │
│  │  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │     │
│  │         │                  │                   │          │     │
│  │  ┌──────▼──────────────────▼───────────────────▼───────┐  │     │
│  │  │              Shared Libraries                       │  │     │
│  │  │  hn-api.ts │ ai-service.ts │ prisma.ts │ data.ts   │  │     │
│  │  └──────┬───────────┬──────────────────┬──────────────┘  │     │
│  └─────────┼───────────┼──────────────────┼─────────────────┘     │
│            │           │                  │                        │
│  ┌─────────▼──┐  ┌─────▼──────┐  ┌───────▼────────┐              │
│  │ Algolia HN │  │ OpenRouter │  │  PostgreSQL    │              │
│  │   API      │  │   (AI)     │  │  (:5432)      │              │
│  │ (External) │  │ (External) │  │  [Bookmarks]  │              │
│  └────────────┘  └────────────┘  │  [Summaries]  │              │
│                                  └────────────────┘              │
│  ┌──────────────────────────────────┐                            │
│  │   Inngest Dev Server (:8288)     │                            │
│  │   Background Job Orchestrator    │                            │
│  │   ┌────────────────────────────┐ │                            │
│  │   │ summarize-discussion fn   │ │                            │
│  │   │  Step 1: Check existing   │ │                            │
│  │   │  Step 2: Fetch story      │ │                            │
│  │   │  Step 3: Fetch comments   │ │                            │
│  │   │  Step 4: AI summarize     │ │                            │
│  │   │  Step 5: Save to DB       │ │                            │
│  │   └────────────────────────────┘ │                            │
│  └──────────────────────────────────┘                            │
└──────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Responsibility |
|---|---|
| **App Router Pages** | `page.tsx` (Home feed), `story/[id]` (Story detail + comments), `bookmarks/` (Saved stories) |
| **API Routes** | `/api/stories` (Paginated story feed), `/api/stories/featured` (Top story), `/api/stories/[id]/summarize` (Trigger/poll AI summary) |
| **Server Actions** | `bookmarks.ts` — Toggle, list, and check bookmark state with optimistic UI |
| **Inngest Functions** | `summarize-discussion` — 5-step durable function for AI summarization |
| **Prisma Models** | `Bookmark` (per-user story saves), `Summary` (AI-generated discussion analysis) |

---

## Data Flow

### 1. Story Browsing (Read Path)
```
User → React Query (useStories hook)
  → GET /api/stories?type=top&page=0
    → Algolia HN Search API
      → Returns stories with metadata
  → Cached in React Query (2 min stale, 10 min GC)
  → Rendered with infinite scroll pagination
```

### 2. AI Summarization (Write Path)
```
User clicks "Summarize" → POST /api/stories/[id]/summarize
  → Inngest event: "story/summarize.requested"
    → Step 1: Check DB for existing summary (skip if found)
    → Step 2: Fetch story details from Algolia
    → Step 3: Fetch & flatten comments (max 200, depth 3)
    → Step 4: Send to OpenRouter LLM → Structured JSON response
    → Step 5: Upsert summary to PostgreSQL
  → UI polls GET /api/stories/[id]/summarize every 2s
  → Summary displayed in AISummaryCard component
```

### 3. Bookmarking (Optimistic Write)
```
User clicks bookmark icon → BookmarkContext (optimistic Set update)
  → Server Action: toggleBookmark()
    → Prisma: Check existing → Create or Delete
    → Revalidate paths: /, /bookmarks, /story/[id]
  → On error: Rollback optimistic state
```

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/) (included with Docker Desktop)

### Option 1: Docker (Recommended for Evaluation)

```bash
# 1. Clone the repository
git clone <repo-url>
cd dev-monks

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY (get one free at https://openrouter.ai/keys)

# 3. Start all services
docker compose up --build

# 4. Open the app
# App:     http://localhost:3000
# Inngest: http://localhost:8288
```

> **Note:** The AI summarization feature requires a valid `OPENROUTER_API_KEY`. The rest of the app (browsing, search, bookmarks) works without it.

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your PostgreSQL URL and OpenRouter key

# 3. Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy

# 4. Start the development server
npm run dev

# 5. (Optional) Start Inngest dev server for AI summarization
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

---

## Approach & Design Decisions

### Why Algolia HN API instead of Official Firebase API?
The official HN API requires **one HTTP request per item** — fetching a story with 500 comments would need 500+ sequential requests. Algolia's API returns the **entire comment tree in a single request**, making it 10-20x faster and far more suitable for AI summarization (where we need all comments at once).

### Why Inngest for Background Jobs?
AI summarization is a **multi-step, potentially slow process** (fetch → process → LLM call → save). Inngest provides:
- **Durable execution** — Each step is checkpointed; if Step 4 (AI call) fails, it retries from Step 4 only
- **Automatic retries** — Built-in retry logic with backoff
- **Observability** — Visual dashboard at `:8288` shows every function run, step execution, and errors
- **No infrastructure** — No need to manage Redis, Bull queues, or worker processes

### Why OpenRouter with a free model?
OpenRouter provides access to multiple LLMs through a single API. The `nvidia/nemotron-3-nano` model is:
- **Free tier** — No cost for evaluation/demo purposes
- **JSON mode** — Supports structured output (`response_format: { type: "json_object" }`)
- **Good enough** — Produces meaningful summaries of technical discussions

### Why Anonymous Users (Cookie-based)?
For a Hacker News reader, requiring sign-up creates unnecessary friction. Cookie-based anonymous IDs allow:
- **Zero-friction bookmarking** — Works immediately, no auth flow
- **Per-user isolation** — Each browser gets unique bookmarks
- **Easy upgrade path** — Could link cookie IDs to real accounts later

### Why Prisma with `@prisma/adapter-pg`?
Prisma 7 with the `pg` adapter provides:
- **Type-safe queries** — Full TypeScript autocompletion for all DB operations
- **Connection pooling** — Built-in `pg.Pool` with configurable limits
- **Migration system** — Schema changes tracked in version control
- **Conditional SSL** — Same code works with both cloud (Neon) and local (Docker) Postgres

---

## Tradeoffs

| Decision | Benefit | Cost |
|---|---|---|
| **Algolia API over Firebase** | 10-20x faster comment fetching, single request for all data | Slight delay in indexing (few minutes behind real-time) |
| **Free AI model** | Zero cost, easy evaluation | Lower quality summaries vs GPT-4/Claude; possible rate limits |
| **Cookie-based auth** | Frictionless UX, no sign-up required | Bookmarks lost on cookie clear; no cross-device sync |
| **Server Components for story pages** | Better SEO, faster initial load, direct DB access | Cannot use client-side interactivity without `"use client"` boundary |
| **Inngest over simple async/await** | Durability, retries, observability dashboard | Adds a service dependency; more complex Docker setup |
| **`standalone` output mode** | Smaller Docker image, faster cold starts | Requires careful file copying in Dockerfile |
| **Single PostgreSQL for bookmarks + summaries** | Simple infrastructure, ACID guarantees | Would need read replicas or caching at scale |
| **Optimistic UI for bookmarks** | Instant visual feedback | Requires rollback logic on server errors |

---

## Future Improvements

If I had more time, I would add:

- **Authentication** — Integrate NextAuth.js with GitHub/Google OAuth for persistent user profiles
- **Real-time updates** — WebSocket or SSE for live comment/score updates
- **Caching layer** — Redis for frequently accessed stories and summaries
- **Better AI model** — Upgrade to GPT-4o or Claude for higher-quality summaries with longer context
- **Summary history** — Track summary versions over time as discussions evolve
- **Rate limiting** — API rate limiting per user to prevent abuse
- **Search improvements** — Full-text search across bookmarks and summaries
- **Dark mode toggle** — User-selectable theme preference (currently fixed)
- **Responsive polish** — Tablet-specific layouts and PWA support
- **Testing** — Unit tests for API routes, integration tests for Inngest functions, E2E with Playwright
- **CI/CD pipeline** — GitHub Actions for lint, test, build, and Docker image push
- **Monitoring** — Error tracking (Sentry), performance monitoring, structured logging

---

## Project Structure

```
dev-monks/
├── docker-compose.yml          # Multi-service orchestration
├── Dockerfile                  # Multi-stage production build
├── prisma/
│   ├── schema.prisma           # Database schema (Bookmark, Summary)
│   └── migrations/             # Version-controlled schema migrations
├── scripts/
│   └── docker-entrypoint.sh    # DB readiness check + auto-migration
├── src/
│   ├── app/
│   │   ├── page.tsx            # Home feed (infinite scroll)
│   │   ├── story/[id]/         # Story detail + comments
│   │   ├── bookmarks/          # Saved stories page
│   │   ├── actions/            # Server actions (bookmark toggle)
│   │   └── api/
│   │       ├── stories/        # Story & search API routes
│   │       └── inngest/        # Inngest webhook endpoint
│   ├── components/
│   │   ├── hn/                 # Domain components (PostCard, Comment, SummarizeButton)
│   │   ├── layout/             # Layout components (Navbar, Hero, Footer)
│   │   └── ui/                 # Reusable UI (Skeletons, ErrorAlert, Icons)
│   ├── context/                # React Context (BookmarkProvider)
│   ├── cookies/                # Auth utilities (anonymous user ID)
│   ├── hooks/                  # Custom hooks (useStories)
│   ├── inngest/                # Background functions (summarize-discussion)
│   ├── lib/                    # Core libraries (hn-api, ai-service, prisma)
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions (date, text, HTML cleaning)
└── .env.example                # Environment variable template
```

---

**Built with ❤️ by Dev Monks**
