# IFROF - Railway Deployment Guide

## Overview
This guide will help you deploy the IFROF application to Railway with proper configuration.

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository access (ifrof/IFROF-WP)
- Domain configured (ifrof.com)

## Deployment Steps

### Step 1: Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `ifrof/IFROF-WP` repository

### Step 2: Add MySQL Database
1. In your Railway project dashboard, click "New Service"
2. Select "Database" → "MySQL"
3. Railway will automatically provision a MySQL database
4. Copy the `DATABASE_URL` from the MySQL service variables

### Step 3: Configure Environment Variables

In your Railway service settings, add the following environment variables:

#### Required Variables:

```bash
# Node Environment
NODE_ENV=production

# Database (automatically set by Railway MySQL service)
DATABASE_URL=${{MySQL.DATABASE_URL}}

# OAuth Configuration (Manus Auth)
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
VITE_APP_ID=ifrof-prod
OAUTH_SERVER_URL=https://auth.manus.im

# Security Keys (Generate these!)
ENCRYPTION_KEY=<generate with: openssl rand -hex 32>
JWT_SECRET=<generate with: openssl rand -base64 32>

# Application URLs
FRONTEND_URL=https://ifrof.com
BACKEND_URL=https://ifrof.com

# Server Configuration
PORT=3000
HOST=0.0.0.0

# Feature Flags
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_STRIPE_PAYMENTS=true
```

#### Optional Variables (Add if needed):

```bash
# Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PUBLIC_KEY=pk_live_your_public_key_here

# Email Configuration (if using email notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@ifrof.com
```

### Step 4: Generate Security Keys

Run these commands locally to generate secure keys:

```bash
# Generate ENCRYPTION_KEY
openssl rand -hex 32

# Generate JWT_SECRET
openssl rand -base64 32
```

Copy the output and paste into Railway environment variables.

### Step 5: Configure Domain

1. In Railway service settings, go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your custom domain: `ifrof.com`
4. Railway will provide DNS records
5. Add the following DNS records to your domain registrar:

```
Type: CNAME
Name: @
Value: <provided-by-railway>.railway.app
```

For www subdomain:
```
Type: CNAME
Name: www
Value: <provided-by-railway>.railway.app
```

### Step 6: Deploy

1. Railway will automatically start building and deploying
2. Monitor the build logs in the Railway dashboard
3. Wait for the deployment to complete (usually 5-10 minutes)

### Step 7: Initialize Database

After the first deployment, you may need to run database migrations:

1. In Railway dashboard, go to your service
2. Click on "Settings" → "Deploy"
3. Add a deploy command or run manually via Railway CLI:

```bash
pnpm db:push
```

### Step 8: Verify Deployment

1. Visit https://ifrof.com
2. Check that the site loads correctly
3. Test the login flow
4. Verify OAuth integration works
5. Check database connectivity

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correctly configured
- Railway uses Nixpacks by default; if you switch to a Dockerfile build, avoid apt-get steps or extra system packages in config, and prefer environment variables for customization

### Database Connection Issues
- Verify MySQL service is running
- Check `DATABASE_URL` format: `mysql://user:password@host:port/database`
- Ensure database migrations have been run

### OAuth/Login Issues
- Verify `VITE_OAUTH_PORTAL_URL` is set correctly
- Check `VITE_APP_ID` matches your Manus app configuration
- Ensure HTTPS is enabled (required for OAuth)

### Domain Not Working
- Verify DNS records are correctly configured
- Wait for DNS propagation (can take up to 48 hours)
- Check Railway domain settings

## Monitoring

### View Logs
In Railway dashboard:
1. Go to your service
2. Click "Deployments"
3. Select the latest deployment
4. View real-time logs

### Health Check
The application includes a health check endpoint at `/api/health`

Test it:
```bash
curl https://ifrof.com/api/health
```

## Updating the Application

Railway automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update application"
git push origin main
```

Railway will:
1. Detect the push
2. Build the new version
3. Deploy automatically
4. Zero-downtime deployment

## Rollback

If something goes wrong:
1. Go to Railway dashboard
2. Click "Deployments"
3. Find a previous working deployment
4. Click "Redeploy"

## Support

For Railway-specific issues:
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

For application issues:
- Check GitHub repository: https://github.com/ifrof/IFROF-WP
- Review application logs in Railway dashboard

## Security Checklist

- [ ] All environment variables are set
- [ ] Security keys are randomly generated (not default values)
- [ ] HTTPS is enabled
- [ ] Database is secured with strong password
- [ ] OAuth is properly configured
- [ ] Stripe keys are production keys (if using payments)
- [ ] Email credentials are secure (use app-specific passwords)

## Performance Optimization

Railway automatically handles:
- Auto-scaling
- Load balancing
- CDN for static assets
- Database connection pooling

For additional optimization:
- Monitor application metrics in Railway dashboard
- Review logs for errors or slow queries
- Consider upgrading Railway plan for more resources

## Cost Estimation

Railway pricing (as of 2026):
- Hobby Plan: $5/month (includes $5 credit)
- Pro Plan: $20/month (includes $20 credit)
- Additional usage billed at $0.000463/GB-hour

Estimated monthly cost for IFROF:
- Web service: ~$5-10
- MySQL database: ~$5-10
- Total: ~$10-20/month

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure backups for database
3. Set up CI/CD for automated testing
4. Configure CDN for better performance
5. Set up error tracking (e.g., Sentry)

---

**Deployment Date**: January 23, 2026
**Version**: 1.0.0
**Status**: Production Ready
