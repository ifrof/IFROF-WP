# Deployment Checklist

## OAuth configuration

- [ ] Set `VITE_OAUTH_PORTAL_URL` to the production OAuth portal URL (HTTPS only).
- [ ] Set `VITE_APP_ID` to the production OAuth client/app ID.
- [ ] Confirm values are present in the hosting provider's environment settings.

## Build & release

- [ ] Rebuild the client after any change to `VITE_` environment variables (Vite only injects them at build time).
- [ ] Deploy updated client and server artifacts together.
- [ ] Validate that the OAuth portal URL is reachable over HTTPS from the production domain.

## Post-deploy verification

- [ ] Visit a protected page (e.g. `/import-request`) while logged out.
- [ ] Confirm you are redirected to the OAuth portal when configuration is valid.
- [ ] Confirm the UI shows a friendly "Login is temporarily unavailable" message when configuration is missing or invalid.
- [ ] Complete login and verify successful callback handling.
