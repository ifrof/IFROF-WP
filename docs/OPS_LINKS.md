# Operational Links and Admin Routes for ifrof.com

This document provides a consolidated list of important operational and administrative links for the `ifrof.com` production environment.

## Admin Links Table

| Name | URL | Purpose | Access | Where | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ifrof.com (Homepage) | `https://ifrof.com/` | Main entry point for the application. | Public | Website | - |
| ifrof.com/blog | `https://ifrof.com/blog` | List of blog posts. | Public | Website | - |
| Admin Dashboard | `https://ifrof.com/dashboard/admin` | Main administrative interface. | Admin | Website | Requires Admin role. |
| Admin Factories | `https://ifrof.com/admin/factories` | Management of factory accounts. | Admin | Website | Requires Admin role. |
| Admin Products | `https://ifrof.com/admin/products` | Management of products. | Admin | Website | Requires Admin role. |
| Admin Orders | `https://ifrof.com/admin/orders` | Management of customer orders. | Admin | Website | Requires Admin role. |
| Admin Users | `https://ifrof.com/admin/users` | Management of user accounts. | Admin | Website | Requires Admin role. |
| Login | `https://ifrof.com/login` | User authentication. | Public | Website | - |
| Forgot Password | `https://ifrof.com/forgot-password` | Password reset request. | Public | Website | - |
| Reset Password | `https://ifrof.com/reset-password/:token` | Password reset with token. | Public | Website | Token required. |
| API Base URL | `https://ifrof.com/api/trpc` | Base URL for tRPC API. | Auth/Public | Website | Public procedures available. |
| Health Check | `https://ifrof.com/api/health` | System health and status check. | Public | Website | Defined in `server/_core/health-check.ts`. |
| Metrics Endpoint | `https://ifrof.com/api/metrics` | Performance metrics endpoint. | Public | Website | Defined in `server/_core/health-check.ts`. |
| OAuth Callback | `https://ifrof.com/api/oauth/callback` | OAuth authentication callback. | Public | Website | Defined in `server/_core/oauth.ts`. |
| Stripe Webhook | `https://ifrof.com/api/stripe/webhook` | Stripe payment event listener. | Public | Website | Defined in `server/_core/stripe-webhook.ts`. |
| Railway Project | `https://railway.app/project/5dd1a85e-95d6-410a-9bde-741b1a1fde56` | Main project page on Railway. | Auth | Railway | - |
| Railway Deployments/Logs | `https://railway.app/project/5dd1a85e-95d6-410a-9bde-741b1a1fde56/service/92466a46-9237-4479-8205-799fc15bb727` | Service page for deployments and logs. | Auth | Railway | Service ID: `92466a46-9237-4479-8205-799fc15bb727`. |
| Railway Variables | `https://railway.app/project/5dd1a85e-95d6-410a-9bde-741b1a1fde56/service/92466a46-9237-4479-8205-799fc15bb727?environmentId=d564ceac-1550-4df3-a026-979a4de406c6` | Environment variables page. | Auth | Railway | Environment ID: `d564ceac-1550-4df3-a026-979a4de406c6`. |
| GitHub Repository | `https://github.com/ifrof/IFROF-WP` | Source code repository. | Public | GitHub | - |
| GitHub Actions/CI | `https://github.com/ifrof/IFROF-WP/actions` | Continuous Integration/Deployment workflows. | Public | GitHub | - |
