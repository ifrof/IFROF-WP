# IFROF

## Environment variables

Client OAuth settings are injected at build time using Vite (via `import.meta.env`).
Update these values in your hosting provider's environment settings and **rebuild** the client after changes.

Required production variables:

- `VITE_OAUTH_PORTAL_URL` (must be a valid `https://` URL)
- `VITE_APP_ID`

See [`.env.example`](./.env.example) for a template.

## Deployment checklist

- [ ] Configure production environment variables (`VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`).
- [ ] Verify `VITE_OAUTH_PORTAL_URL` uses **HTTPS** to avoid mixed-content or protocol errors.
- [ ] Rebuild the client after any `VITE_` environment change.
- [ ] Deploy the rebuilt client and server artifacts together.
- [ ] Smoke test login flow in production.

For a more detailed checklist, see [docs/DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md).
