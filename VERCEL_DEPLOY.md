# Vercel Deployment Guide

## Quick Start

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect settings from `vercel.json`

2. **Build Settings** (should auto-configure)
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - No environment variables needed for basic deployment

## Updating Campaign Balance

The campaign data is hardcoded in `api/index.js`. To update the balance:

1. Edit `api/index.js`
2. Update the `totalRaised` value:
   ```javascript
   totalRaised: 18500,  // <- Change this number
   ```
3. Commit and push to GitHub
4. Vercel auto-deploys the update

## What Changed from Replit

- **Removed**: Database, admin dashboard, donation tracking, session management
- **Kept**: Campaign landing page, progress tracking, contact forms (optional)
- **Storage**: Changed from file-based to hardcoded values in serverless function

## Campaign Data Location

All campaign data now lives in `/api/index.js`:
- Goal: $24,000 NZD
- Current raised: $18,500 (update this manually)
- End date: 2025-12-31

## Optional: Email Forms

If you want to enable the contact form and newsletter signup:

1. Add environment variables in Vercel dashboard:
   - `EMAIL_SERVICE_CONFIG` (your email provider details)
   - `NOTIFICATION_EMAIL` (where to send contact form submissions)

2. Uncomment email handling code in `api/index.js`

## Domain Setup

In Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Monitoring

- View deployments: Vercel Dashboard → Your Project → Deployments
- View logs: Click on a deployment → Functions tab
- Analytics: Vercel Dashboard → Analytics (if enabled)
