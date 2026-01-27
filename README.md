# IFROF

## Environment variables

Client OAuth settings are injected at build time using Vite (via `import.meta.env`).
Update these values in your hosting provider's environment settings and **rebuild** the client after changes.

Required production variables:

- `VITE_OAUTH_PORTAL_URL` (must be a valid `https://` URL)
- `VITE_APP_ID`
- `DATABASE_URL` (MySQL, required for Lucia sessions)
- `OPENAI_API_KEY` (required for Vercel AI SDK streaming chat)
- `AI_MODEL` (optional, defaults to `gpt-4o-mini`)

See [`.env.example`](./.env.example) for a template.

## Local setup

```bash
pnpm install
pnpm build
```
