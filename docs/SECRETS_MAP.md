# Railway Secrets Map (Names Only)

This document maps the environment variables (secrets) used by the `ifrof.com` application, primarily for configuration in the Railway environment. **No secret values are stored in this document.**

## Secrets Map

| Secret Name              | Required | Used In (files)                                                                                       | Where to set (Railway Variables) | Rotation suggestion                        |
| :----------------------- | :------- | :---------------------------------------------------------------------------------------------------- | :------------------------------- | :----------------------------------------- |
| `DATABASE_URL`           | Yes      | `server/_core/env.ts`, `server/db.ts`, `drizzle.config.ts`                                            | Service Variables                | Quarterly or upon security incident.       |
| `JWT_SECRET`             | Yes      | `server/_core/env.ts`, `server/_core/sdk.ts`, `server/routers/auth-complete.ts`                       | Service Variables                | Annually or upon security incident.        |
| `VITE_APP_ID`            | No       | `server/_core/env.ts`                                                                                 | Service Variables                | N/A (Client-side ID).                      |
| `OAUTH_SERVER_URL`       | No       | `server/_core/env.ts`                                                                                 | Service Variables                | N/A (External URL).                        |
| `OWNER_OPEN_ID`          | No       | `server/_core/env.ts`                                                                                 | Service Variables                | N/A (User ID).                             |
| `BUILT_IN_FORGE_API_URL` | No       | `server/_core/env.ts`                                                                                 | Service Variables                | N/A (External URL).                        |
| `BUILT_IN_FORGE_API_KEY` | No       | `server/_core/env.ts`                                                                                 | Service Variables                | Quarterly (if used).                       |
| `OPENAI_API_KEY`         | No       | `server/_core/env.ts`                                                                                 | Service Variables                | Quarterly (if used as fallback).           |
| `PORT`                   | No       | `server/_core/index.ts`                                                                               | Service Variables                | N/A (Default 3000).                        |
| `EMAIL_USER`             | No       | `server/_core/email-service.ts`                                                                       | Service Variables                | Quarterly.                                 |
| `EMAIL_PASSWORD`         | No       | `server/_core/email-service.ts`                                                                       | Service Variables                | Quarterly.                                 |
| `EMAIL_FROM`             | No       | `server/_core/email-service.ts`                                                                       | Service Variables                | N/A (Default `noreply@ifrof.com`).         |
| `PUBLIC_URL`             | No       | `server/_core/email-service.ts`                                                                       | Service Variables                | N/A (Default `https://ifrof.com`).         |
| `API_ORIGIN`             | No       | `server/_core/middleware.ts`                                                                          | Service Variables                | N/A (Default `https://api.ifrof.com`).     |
| `SENTRY_DSN`             | No       | `server/_core/performance-monitor.ts`                                                                 | Service Variables                | N/A (Public DSN).                          |
| `STRIPE_SECRET_KEY`      | No       | `server/_core/stripe-webhook.ts`, `server/routers/checkout-improved.ts`, `server/routers/payments.ts` | Service Variables                | Annually or upon security incident.        |
| `STRIPE_WEBHOOK_SECRET`  | No       | `server/_core/stripe-webhook.ts`                                                                      | Service Variables                | Annually or upon security incident.        |
| `REDIS_URL`              | No       | `server/utils/cache.ts`                                                                               | Service Variables                | Quarterly or upon security incident.       |
| `FORCE_HTTPS`            | No       | `server/_core/https-redirect.ts`                                                                      | Service Variables                | N/A (Boolean flag).                        |
| `NODE_ENV`               | No       | Multiple                                                                                              | Service Variables                | N/A (Set by Railway/Default `production`). |
