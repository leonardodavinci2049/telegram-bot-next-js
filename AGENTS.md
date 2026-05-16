# AGENTS.md

## Commands

- **Install**: `pnpm install`
- **Dev**: `pnpm dev` — wraps `next dev` via `dotenv-cli`, loads `.env` automatically
- **Build**: `pnpm build` — plain `next build` (no dotenv)
- **Start**: `pnpm start` — wraps `next start` via `dotenv-cli`
- **Lint**: `pnpm lint` → `biome check` (Biome, not ESLint)
- **Format**: `pnpm format` → `biome format --write`
- **No test framework** is configured. No test scripts exist.

## Architecture

Next.js 16 App Router + grammy Telegram bot, backed by raw MySQL.

```
src/
  core/config/       Zod-validated env vars (server vs client scope)
  core/constants/    App-wide constants
  core/logger.ts     Custom logger factory (createLogger)
  services/telegram/ Bot services — bot1/ (active), bot2/ (placeholder)
  database/          MySQL pool singleton (mysql2), schema types, query utils
  app/api/           API routes — bot1-telegram/webhook/route.ts is the webhook endpoint
  components/ui/     shadcn/ui components (relaxed lint rules, do not hand-edit)
  components/        App components (header, theme)
  lib/utils.ts       cn() utility (clsx + tailwind-merge)
  instrumentation.ts Auto-registers Telegram webhook on server startup
```

## Key Conventions

- **Path alias**: `@/*` → `./src/*`
- **Linting**: Biome with Next + React recommended domains. `src/components/ui/**` has relaxed rules for shadcn — avoid tightening them.
- **React Compiler**: Enabled (`reactCompiler: true` in `next.config.ts`, `babel-plugin-react-compiler` in devDeps).
- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin (no `tailwind.config.*` file).
- **UI components**: Managed by shadcn CLI (`npx shadcn@latest add <component>`). Style is `radix-luma`.
- **Language mix**: Code in English, but some log messages and error class names are in Brazilian Portuguese.

## Environment

- `.env` is required (gitignored). Validated at startup by Zod schemas in `src/core/config/envs.server.ts`.
- Required vars include: `PORT` (default 7777), `DATABASE_*`, `WEBHOOK_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_MESSAGE_RESPONSE`, `EXTERNAL_API_MAIN_URL`, `TELEGRAM_API_URL`, `TELEGRAM_BOT_LINK`.
- `dev` and `start` scripts load `.env` via `dotenv-cli`. `build` does not.
- `WEBHOOK_URL` must be a bare URL — no trailing slash, no path. The `/api/bot1-telegram/webhook` path is appended automatically.

## Database

- MySQL via `mysql2/promise`. Singleton pool stored on `globalThis` to survive HMR in dev.
- No ORM — raw SQL with typed helpers (`dbService.selectQuery`, `dbService.modifyExecute`, `dbService.runInTransaction`).
- Schema types are manual TypeScript types in `src/database/schema.ts`.
- Import guard: `dbConnection.ts` starts with `import "server-only"`.

## Telegram Bot

- grammy `Bot` instance, lazily initialized, handles updates via webhook (not polling).
- `instrumentation.ts` calls `registerWebhook()` on server start.
- Webhook route: `POST /api/bot1-telegram/webhook`.
- bot2 directory exists but is empty (placeholder for a second bot).
- Local dev requires ngrok; see `docs/webhook-local-setup.md`.
