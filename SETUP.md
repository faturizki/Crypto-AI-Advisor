# Setup Guide for Crypto AI Advisor

Complete step-by-step setup instructions for local development and production deployment.

## 📋 Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com))
- **Supabase account** (free at [supabase.com](https://supabase.com))
- **Vercel account** (free at [vercel.com](https://vercel.com))
- **GitHub account** (free at [github.com](https://github.com))
- **Anthropic API key** (optional, for real AI - free credits at [console.anthropic.com](https://console.anthropic.com))

---

## 🎯 Local Development Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/crypto-ai-advisor.git
cd crypto-ai-advisor
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs dependencies for:
- Root monorepo
- `apps/backend`
- `apps/dashboard`
- `packages/ai-scoring`

Verify with:
```bash
npm list  # Shows all installed packages
```

### Step 3: Supabase Database Setup

#### Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New project"
3. Fill in project details:
   - **Project name**: crypto-ai-advisor
   - **Database password**: Strong password (save it)
   - **Region**: Choose closest to you
4. Click "Create new project"
5. Wait for project to initialize (~2 min)

#### Setup Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy entire contents of [database/schema.sql](database/schema.sql)
4. Paste into SQL editor
5. Click **Run** button
6. Verify: Go to **Table editor** tab and see `tokens` and `history` tables

#### (Optional) Add Sample Data

1. In **SQL Editor**, click **New query**
2. Copy entire contents of [database/seed.sql](database/seed.sql)
3. Paste and click **Run**
4. Go to **Table editor** and see sample tokens

#### Get Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY` (backend only)

Save these temporarily - you'll need them next.

### Step 4: Environment Configuration

Create `.env.local` in project root:

```bash
cat > .env.local << 'EOF'
# Required: Supabase Credentials
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: AI Scoring (leave as-is for mock mode)
ANTHROPIC_API_KEY=sk-ant-... # Optional - uses mock if missing
USE_MOCK_AI=true

# Backend Configuration
POLL_INTERVAL_MINUTES=15
LOG_LEVEL=debug
NODE_ENV=development

# Frontend Configuration (same Supabase credentials)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOF
```

Replace placeholders:
- `https://xxxxx.supabase.co` → Your Supabase URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → Your anon key

**Important**: Never commit `.env.local` to Git!

### Step 5: Run Development Servers

Open 2-3 terminals:

**Terminal 1: Dashboard**
```bash
cd apps/dashboard
npm run dev
# Opens http://localhost:3000
```

**Terminal 2: Backend (optional - only run once)**
```bash
cd apps/backend
npm run dev

# Logs:
# [2026-04-01T...] [INFO] Starting Token Poller
# [2026-04-01T...] [INFO] Fetching tokens from DexScreener
# ... (will run for ~10 seconds then exit)
```

Now:
1. Open [http://localhost:3000](http://localhost:3000)
2. See dashboard with sample tokens (if you seeded database)
3. Try filtering and searching
4. Check backend logs for any errors

### Step 6: Verify Everything Works

**Test Checklist**:
- [ ] Dashboard loads at http://localhost:3000
- [ ] Table displays tokens
- [ ] Filters work (try score slider)
- [ ] Search finds tokens
- [ ] "Refresh" button works
- [ ] Backend successfully scored tokens

---

## 🚀 Production Deployment

### Option A: Deploy Dashboard to Vercel

#### Prerequisites
- GitHub repo (push local code)
- Vercel account

#### Steps

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/crypto-ai-advisor
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**
   1. Go to [vercel.com](https://vercel.com)
   2. Click "New Project"
   3. Select your GitHub repo
   4. Choose `apps/dashboard` as root directory
   5. Add environment variables:
      - `NEXT_PUBLIC_SUPABASE_URL`
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   6. Click "Deploy"

3. **Custom Domain** (optional)
   - In Vercel project settings
   - Add your domain
   - Update DNS records per instructions

**Automatic Deployment**: Future pushes to `main` auto-deploy to Vercel.

### Option B: Setup GitHub Actions

#### Configure Secrets

In GitHub repo settings → **Secrets and variables** → **Actions**:

Add these secrets:
```
SUPABASE_URL                    # Your Supabase project URL
SUPABASE_ANON_KEY               # Supabase anon key
SUPABASE_SERVICE_KEY            # Supabase service key
ANTHROPIC_API_KEY               # Optional - Claude API key
VERCEL_TOKEN                    # Vercel deploy token
VERCEL_ORG_ID                   # Your Vercel org ID
VERCEL_PROJECT_ID               # Dashboard project ID
```

#### Get These Secrets

**Vercel credentials**:
1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create new token → copy to `VERCEL_TOKEN`
3. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
4. Select `crypto-ai-advisor` project
5. URL contains project ID: `vercel.com/yourusername/crypto-ai-advisor/PROJECT_ID`
6. Get org ID from account settings

**Anthropic API key** (optional):
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Copy to `ANTHROPIC_API_KEY`

#### Test Workflows

1. **Manual trigger** (test):
   - Go to GitHub repo → **Actions**
   - Select **Token Polling**
   - Click **Run workflow**
   - Check results

2. **Scheduled** (automatic):
   - Polling runs every 30 min
   - Check **Actions** tab for history

---

## 📖 Environment Variables Reference

### Backend (apps/backend)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `SUPABASE_URL` | ✅ Yes | - | Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ Yes | - | Public API key |
| `SUPABASE_SERVICE_KEY` | ❌ No | - | Admin key (backend only) |
| `ANTHROPIC_API_KEY` | ❌ No | - | Claude API key |
| `USE_MOCK_AI` | ❌ No | true | Use mock scoring if true |
| `POLL_INTERVAL_MINUTES` | ❌ No | 15 | Polling frequency |
| `LOG_LEVEL` | ❌ No | info | debug/info/warn/error |
| `NODE_ENV` | ❌ No | production | development/production |

### Frontend (apps/dashboard)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | - | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | - | Public API key |

**Note**: Frontend keys must have `NEXT_PUBLIC_` prefix to be accessible in browser.

---

## 🧪 Testing Setup

### Run All Tests

```bash
npm run test              # Run all tests once
npm run test -- --watch  # Run in watch mode
```

### Run Specific Test Suite

```bash
cd packages/ai-scoring && npm test   # AI scoring tests
cd apps/backend && npm test          # Backend tests
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] `.env.local` not in Git (check `.gitignore`)
- [ ] GitHub Secrets configured (not in code)
- [ ] Supabase RLS policies enabled
- [ ] Service key used only in backend CI/CD
- [ ] API keys rotated
- [ ] Vercel production environment variables set
- [ ] No console.log with sensitive data
- [ ] HTTPS enforced on dashboard

---

## 🐛 Troubleshooting

### Dashboard shows "No tokens"

**Problem**: Connection to Supabase failing

**Solutions**:
1. Verify `.env.local` has correct Supabase URLs
2. Check Supabase project status (green online indicator)
3. Verify anon key has public read permission (RLS policies)
4. Check browser DevTools → Network → see actual errors
5. Restart development server: `Ctrl+C` then `npm run dev`

### Backend won't start

**Problem**: Dependency or configuration issue

**Solutions**:
```bash
# Clear cache
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Check specific errors
cd apps/backend
npm run build     # Compile TypeScript
npm start         # Run production build
```

### GitHub Actions failing

**Problem**: Secret or configuration issue

**Solutions**:
1. Check GitHub Actions logs for specific error
2. Verify all secrets exist: Settings → Secrets → Actions
3. Check workflow file syntax: `.github/workflows/*.yml`
4. Test locally first: `npm run build && npm start`

### Supabase connection timeout

**Problem**: Network or firewall issue

**Solutions**:
1. Check internet connection
2. Verify Supabase project region (use closest)
3. Try from different network
4. Check Supabase status page

---

## 📊 Monitoring

### Check Backend Health

**Local**:
```bash
tail -f logs/backend.log  # If logs file created
```

**GitHub Actions**:
1. Go to repo → **Actions**
2. Select **Token Polling**
3. Check latest run status
4. Click run to see detailed logs

### Check Dashboard Health

**Vercel**:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select project
3. Check **Deployments** tab
4. Latest successful deployment = live site

**Supabase**:
1. Go to Supabase dashboard
2. Check **Database** → **Replication** status
3. Monitor **Logs** for errors

---

## 🔄 Updating Production

### Push Update

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

This triggers:
1. **CI/CD workflow** (lint, test, build)
2. **Deploy Dashboard** to Vercel (if `apps/dashboard` changed)
3. **Both complete in ~5 minutes**

### Rollback (if needed)

```bash
# On GitHub
git revert <commit-hash>
git push origin main

# Automatically redeploys previous version
```

---

## ✅ Validation Checklist

After setup, verify:

- [ ] Dashboard loads (http://localhost:3000 or Vercel URL)
- [ ] Tokens display in table
- [ ] At least 50 tokens visible
- [ ] Filtering works (score, volume, chain)
- [ ] Search finds tokens
- [ ] High-potential tokens highlighted
- [ ] Real-time refresh works
- [ ] No console errors (DevTools)
- [ ] Backend logs show successful polling
- [ ] Database contains latest scores

---

## 📞 Getting Help

1. **Check logs first**: Backend logs + browser DevTools
2. **Search existing issues**: GitHub Issues
3. **Ask in discussions**: GitHub Discussions
4. **Review documentation**: README.md, ARCHITECTURE.md
5. **Test with sample project**: Use seed.sql data

---

See [README.md](README.md) for more information.
