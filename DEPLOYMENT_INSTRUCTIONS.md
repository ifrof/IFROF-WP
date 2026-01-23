# IFROF - Quick Deployment Instructions

## 🚀 Deploy to Railway in 5 Steps

### Step 1: Access Railway Project
Your Railway project is already set up at:
https://railway.com/project/5dd1a85e-95d6-410a-9bde-741b1a1fde56/service/92466a46-9237-4479-8205-799fc15bb727

### Step 2: Add MySQL Database
1. In Railway dashboard, click **"New"** → **"Database"** → **"MySQL"**
2. Railway will automatically provision the database
3. The `DATABASE_URL` will be automatically available to your service

### Step 3: Configure Environment Variables

Go to your service → **Variables** tab and add these:

#### Copy-Paste Ready Variables:

```bash
NODE_ENV=production
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
VITE_APP_ID=ifrof-prod
OAUTH_SERVER_URL=https://auth.manus.im
PORT=3000
HOST=0.0.0.0
FRONTEND_URL=https://ifrof.com
BACKEND_URL=https://ifrof.com
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_STRIPE_PAYMENTS=false
```

#### Generated Security Keys (use these):

```bash
ENCRYPTION_KEY=8afa308f332bcc2a1c72a08400a95c480adf8c04a57e65e5cc0b01697ebad393
JWT_SECRET=S4QwocfMCIAAJ8c0wEXzODsTPAUB+iJTLj385K6kPZs=
```

#### Database Connection (use Railway variable reference):

```bash
DATABASE_URL=${{MySQL.DATABASE_URL}}
```

### Step 4: Configure Domain

1. Go to **Settings** → **Networking** → **Public Networking**
2. Click **"Generate Domain"** to get a Railway domain first
3. Then click **"Custom Domain"**
4. Enter: `ifrof.com`
5. Railway will show you DNS records to add

**Add these DNS records to your domain registrar:**

```
Type: CNAME
Name: @ (or root)
Value: [shown by Railway]
Proxy: No (disable if using Cloudflare)
```

For www subdomain:
```
Type: CNAME
Name: www
Value: [shown by Railway]
Proxy: No
```

### Step 5: Deploy

1. Railway will automatically deploy from your GitHub repository
2. Monitor the deployment in the **Deployments** tab
3. Wait for build to complete (5-10 minutes)
4. Visit https://ifrof.com to verify

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads at https://ifrof.com
- [ ] Health check works: https://ifrof.com/api/health
- [ ] Login page is accessible
- [ ] No console errors
- [ ] Database connection is working

## 🔧 Troubleshooting

### Build Fails
- Check **Deployments** tab for error logs
- Verify all environment variables are set
- Ensure MySQL service is running

### Database Connection Error
- Verify MySQL service is running in Railway
- Check that `DATABASE_URL` variable reference is correct: `${{MySQL.DATABASE_URL}}`
- Wait a few minutes for MySQL to fully initialize

### Domain Not Working
- Verify DNS records are correctly configured
- DNS propagation can take 5-60 minutes
- Try accessing via Railway's generated domain first

### OAuth/Login Issues
- Ensure `VITE_OAUTH_PORTAL_URL` is exactly: `https://auth.manus.im`
- Verify `VITE_APP_ID` is registered with Manus
- Check that HTTPS is enabled (Railway provides this automatically)

## 📊 Monitoring

### View Logs
1. Go to your service in Railway
2. Click **"Deployments"**
3. Select latest deployment
4. View real-time logs

### Health Check
Test the health endpoint:
```bash
curl https://ifrof.com/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-01-23T..."}
```

## 🔄 Automatic Deployments

Railway is configured to automatically deploy when you push to GitHub:

```bash
git add .
git commit -m "Update application"
git push origin main
```

Railway will automatically:
1. Detect the push
2. Build the new version
3. Deploy with zero downtime
4. Rollback if deployment fails

## 📝 Important Notes

1. **Security Keys**: The generated keys above are unique and secure. Keep them safe!

2. **Database**: Railway MySQL includes automatic backups. Configure backup retention in MySQL service settings.

3. **Environment Variables**: Any changes to `VITE_*` variables require a rebuild. Railway will automatically rebuild when you change these.

4. **Domain**: HTTPS is automatically provided by Railway. No need to configure SSL certificates.

5. **Scaling**: Railway automatically handles scaling. Monitor usage in the dashboard.

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: https://github.com/ifrof/IFROF-WP/issues

## 📋 Current Configuration

- **Repository**: https://github.com/ifrof/IFROF-WP
- **Domain**: https://ifrof.com
- **Railway Project**: https://railway.com/project/5dd1a85e-95d6-410a-9bde-741b1a1fde56
- **Tech Stack**: Vite + React + Express + MySQL
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`
- **Health Check**: `/api/health`

## 🎯 Next Steps After Deployment

1. **Test thoroughly**: Check all features work correctly
2. **Set up monitoring**: Configure alerts for downtime
3. **Configure backups**: Set up database backup schedule
4. **Add team members**: Invite team to Railway project
5. **Set up CI/CD**: Configure automated testing
6. **Performance monitoring**: Set up APM tools
7. **Error tracking**: Integrate Sentry or similar

---

**Generated**: January 23, 2026
**Status**: Ready to Deploy
**Estimated Deployment Time**: 10-15 minutes
