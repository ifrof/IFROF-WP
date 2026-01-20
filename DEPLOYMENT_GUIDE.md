# IFROF.COM - Deployment Guide

## Quick Start - Deploy to Vercel (Recommended)

### Prerequisites:
1. Node.js 18+ installed
2. Git repository (already set up)
3. Vercel account (free at vercel.com)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
```bash
cd IFROF-WP
vercel
```

### Step 3: Configure Environment Variables in Vercel Dashboard
```
NODE_ENV=production
DATABASE_URL=mysql://user:password@host/database
OAUTH_SERVER_URL=https://auth.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im
VITE_APP_ID=ifrof-prod
ENCRYPTION_KEY=[generate with: openssl rand -hex 32]
JWT_SECRET=[generate with: openssl rand -base64 32]
STRIPE_SECRET_KEY=[from Stripe dashboard]
STRIPE_PUBLISHABLE_KEY=[from Stripe dashboard]
```

---

## Alternative: Deploy to Railway

### Step 1: Connect GitHub
1. Go to railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub account and select `ifrof/IFROF-WP`

### Step 2: Add MySQL Database
1. In Railway dashboard, click "Add Service"
2. Select "MySQL"
3. Railway will automatically create the database

### Step 3: Set Environment Variables
Add the same variables as above in Railway's environment settings.

### Step 4: Deploy
Railway will automatically deploy when you push to GitHub.

---

## Alternative: Deploy to AWS

### Step 1: Create EC2 Instance
```bash
# Ubuntu 22.04 LTS recommended
# Instance type: t3.medium or larger
```

### Step 2: Install Dependencies
```bash
sudo apt update
sudo apt install -y nodejs npm mysql-server
sudo npm install -g pnpm
```

### Step 3: Clone and Setup
```bash
git clone https://github.com/ifrof/IFROF-WP.git
cd IFROF-WP
pnpm install
```

### Step 4: Configure MySQL
```bash
sudo mysql -u root
CREATE DATABASE ifrof;
CREATE USER 'ifrof'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON ifrof.* TO 'ifrof'@'localhost';
FLUSH PRIVILEGES;
```

### Step 5: Build and Run
```bash
pnpm build
pnpm start
```

### Step 6: Setup PM2 for Auto-restart
```bash
sudo npm install -g pm2
pm2 start "pnpm start" --name ifrof
pm2 startup
pm2 save
```

---

## Database Setup (MySQL)

### Option 1: Local MySQL
```bash
mysql -u root -p < schema.sql
```

### Option 2: TiDB Cloud (Recommended for Production)
1. Sign up at tidbcloud.com
2. Create a cluster
3. Get connection string
4. Set `DATABASE_URL` in environment

### Option 3: AWS RDS
1. Create RDS instance
2. Configure security groups
3. Get endpoint
4. Set `DATABASE_URL` in environment

---

## Production Checklist

- [ ] Database configured and running
- [ ] Environment variables set
- [ ] SSL/HTTPS certificate installed
- [ ] OAuth credentials configured
- [ ] Stripe keys configured
- [ ] Email service configured
- [ ] S3 bucket created for file uploads
- [ ] Backups configured
- [ ] Monitoring and logging enabled
- [ ] Domain configured

---

## Monitoring & Maintenance

### View Logs
```bash
pm2 logs ifrof
```

### Restart Service
```bash
pm2 restart ifrof
```

### Update Code
```bash
git pull
pnpm install
pnpm build
pm2 restart ifrof
```

---

## Support

For issues, check:
1. Server logs: `pm2 logs ifrof`
2. Database connection: `mysql -u ifrof -p`
3. Environment variables: `env | grep DATABASE_URL`
