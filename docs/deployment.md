# Deployment Guide for NeuroWealth Frontend

## Environments

| Environment | Branch  | Stellar Network | URL |
|-------------|---------|-----------------|-----|
| Staging     | `dev`   | Testnet         | https://staging.neurowealth.com |
| Production  | `main`  | **Mainnet**     | https://neurowealth.com |

> ⚠️ Production uses Stellar Mainnet and real USDC. Never deploy untested code to `main`.

## Pre-Release Checklist

- [ ] PR reviewed and approved by at least 1 maintainer
- [ ] All CI checks passing (env validation + build)
- [ ] Staging deploy verified — test deposit, balance check, and withdrawal flows via WhatsApp
- [ ] No console errors on staging
- [ ] `STELLAR_NETWORK` confirmed as `mainnet` in production secrets
- [ ] `WALLET_ENCRYPTION_KEY` is unique and securely stored in a password manager
- [ ] Database migrations run on production DB if schema changed:
```bash
  psql -d neurowealth -f backend/migrations/001_create_users_table.sql
  psql -d neurowealth -f backend/migrations/002_create_deposits_table.sql
```
- [ ] CHANGELOG updated

## Deploying to Staging

Push to or merge a PR into `dev`. GitHub Actions runs automatically.  
Monitor: **Actions → Deploy to Staging**

## Deploying to Production

Merge `dev` → `main` via a Pull Request. GitHub Actions runs automatically.  
Monitor: **Actions → Deploy to Production**

## Rollback Instructions

### Option A — Vercel Dashboard (fastest, ~30 seconds)
1. Go to vercel.com → NeuroWealth project → **Deployments** tab
2. Find the last known-good deployment
3. Click **⋮ → Promote to Production**
4. Verify live URL is restored

### Option B — Git Revert (triggers redeploy)
```bash
git checkout main
git revert HEAD        # or: git revert <bad-commit-sha>
git push origin main   # CI will redeploy automatically
```

### Option C — Vercel CLI
```bash
vercel rollback --token=$VERCEL_TOKEN
```

## Post-Rollback Verification
- [ ] Site loads at production URL
- [ ] Send "hi" to NeuroWealth WhatsApp number — bot responds
- [ ] `NEXT_PUBLIC_APP_ENV` shows `production` in browser console
- [ ] Stellar Horizon URL points to `https://horizon.stellar.org` (mainnet)
- [ ] Notify team with: rollback reason, affected versions, resolution ETA