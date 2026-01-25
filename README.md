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

### Admin dashboard (Refine)

The admin console is available at `/admin`. It uses Refine with tRPC-backed data providers to manage users, products, orders, and factory verification.

### AI streaming chat (Vercel AI SDK)

The chat UI and `/api/ai/chat` endpoint use the Vercel AI SDK for streaming responses. Ensure `OPENAI_API_KEY` is set in the server environment.


## Deployment checklist

- [ ] Configure production environment variables (`VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`).
- [ ] Verify `VITE_OAUTH_PORTAL_URL` uses **HTTPS** to avoid mixed-content or protocol errors.
- [ ] Rebuild the client after any `VITE_` environment change.
- [ ] Deploy the rebuilt client and server artifacts together.
- [ ] Smoke test login flow in production.

For a more detailed checklist, see [docs/DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md).
