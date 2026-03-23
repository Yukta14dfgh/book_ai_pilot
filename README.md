# Book AI Copilot

A greenfield Next.js MVP scaffold for solo authors who want a dedicated book-writing workspace with chapter organization, rich-text drafting, export tools, and an AI copilot.

## Included

- Landing page, dashboard, outline view, editor view, and sign-in screen
- Tiptap-based rich-text editor with autosave wiring, focus mode, word count, and export buttons
- AI assistant sidebar with prompt templates and an API route that calls OpenAI when `OPENAI_API_KEY` is set
- Prisma schema for users, books, chapters, document content, exports, AI conversations, and AI suggestions
- Prisma-backed dashboard, book detail, metadata save, and autosave flows with demo fallback data when the database is empty

## Quick Start

```bash
npm install
copy .env.example .env
npm run prisma:generate
npx prisma db push
npm run seed
npm run dev
```

The local app will then be available at [http://localhost:3000](http://localhost:3000).

## Environment

- `DATABASE_URL`: Prisma database connection string. The scaffold defaults to local SQLite for quick setup.
- `OPENAI_API_KEY`: Enables live AI responses through the server route.

## Production Follow-Up

- Replace the sign-in placeholder with a real auth provider
- Persist autosaves and editor JSON to Prisma
- Move export generation to server jobs if you need large manuscript support
- Add robust token accounting, moderation, and billing controls before public launch

## Deploy To Vercel

1. Push this project to a GitHub repository.
2. In Vercel, create a new project and import that repository.
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
4. For production, use hosted Postgres instead of the local SQLite default in `.env.example`.
5. Set the build command to `npm run prisma:generate && next build` if Vercel does not pick it up automatically.

After deploy, Vercel will give you a public URL such as `https://your-project-name.vercel.app`.
