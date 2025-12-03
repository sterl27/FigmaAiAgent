# Codebase Review Report

## 1. Overview
The **Figma AI Agent** is a sophisticated Next.js application designed to assist users with Figma documentation and UI component generation. It leverages a modern stack including the Vercel AI SDK, Drizzle ORM, and multiple AI providers (OpenAI, Google, Anthropic).

## 2. Architecture & Stack
-   **Framework**: Next.js 14 (App Router)
-   **Database**: PostgreSQL (via Drizzle ORM) with `pgvector` for embeddings.
-   **AI Integration**: Vercel AI SDK (`ai`, `@ai-sdk/*`).
-   **Styling**: Tailwind CSS + Shadcn UI.
-   **Scraping**: Firecrawl (`@mendable/firecrawl-js`).

## 3. Code Quality & Best Practices

### Strengths
-   **Modular Structure**: The `lib` directory is well-organized, separating database schemas, AI logic, and utility functions.
-   **Type Safety**: extensive use of TypeScript and Zod for validation.
-   **Modern Patterns**: Uses React Server Components and Server Actions (implied by structure).
-   **Two-Pass Scraping**: The `app/api/figma/route.ts` implements a smart two-pass strategy to first scrape text and then process images, which is efficient.

### Areas for Improvement
-   **Environment Variable Validation**: `lib/env.mjs` uses `@t3-oss/env-nextjs` but is missing validation for several critical keys used in the application:
    -   `FIRECRAWL_API_KEY`
    -   `GOOGLE_GENERATIVE_AI_API_KEY`
    -   `PEXELS_API_KEY`
    -   `ANTHROPIC_API_KEY`
    -   `ENVIRONMENT` (used in `app/api/chat/route.ts`)
-   **Hardcoded Prompts**: The system prompt in `app/api/chat/route.ts` is large and hardcoded. Moving this to a separate file (e.g., `lib/prompts.ts`) would improve maintainability.
-   **Error Handling**: In `app/api/chat/route.ts`, the `saveToDbPromise` function catches errors but only logs them. Since it's wrapped in `waitUntil`, these errors might go unnoticed in production.
-   **Commented Out Code**: The `getImagesFromPexels` tool in the chat route is commented out. It should either be implemented or removed to keep the code clean.

## 4. Database & Schema
-   **Schema Organization**: Splitting the schema into multiple files (`resources.ts`, `embeddings.ts`, etc.) is a good practice.
-   **Potential Schema Issue**: In `lib/db/schema/resources.ts`, the `source` column defaults to `"tailwind_css_v3"`. This seems to be a copy-paste artifact and should likely default to `"figma_docs"` or be required.

## 5. Potential Issues & Bugs
1.  **Missing Env Validation**: The app will crash at runtime (instead of build time) if keys like `FIRECRAWL_API_KEY` are missing, because they aren't validated in `env.mjs`.
2.  **Hardcoded Paths**: `app/api/figma/route.ts` constructs the path to `urls.md` using `path.join(process.cwd(), 'app', 'api', 'figma', 'urls.md')`. If the file structure changes, this will break.
3.  **Session Management**: The chat saves sessions based on a `sessionId` passed from the client. Without proper authentication (user IDs), this relies entirely on the client generating unique IDs.

## 6. Recommendations
1.  **Update `lib/env.mjs`**: Add all used environment variables to the schema to ensure type safety and fail-fast behavior.
2.  **Refactor Prompts**: Move the system prompt and other large text blocks to a dedicated `lib/ai/prompts.ts` file.
3.  **Fix Schema Default**: Change the default value of `source` in `resources.ts` to something more appropriate.
4.  **Enable/Cleanup Tools**: Decide on the Pexels integration—either uncomment and fix it or remove the dead code.
5.  **Logging**: Consider using a structured logger instead of `console.log` for better observability in production.
