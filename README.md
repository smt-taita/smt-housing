# St Matt's Kāinga — housing fundraising page

The fundraising site for **St Matt's Kāinga**, St Matt's Taitā's affordable-housing project. It raises about $24,000 a year to keep rents subsidised in eight homes in Taitā.

**Live:** https://housing.stmattstaita.org.nz

This site came before the main church website ([`smt-website`](https://github.com/smt-taita/smt-website)) and will fold into it eventually. Until then it's a separate Vercel project on the same domain.

## Running locally

```bash
npm install
PORT=5001 npm run dev   # http://localhost:5001
```

Use port 5001 on a Mac, because macOS AirPlay Receiver already uses 5000.

```bash
npm run build   # production build → dist/public
npm run check   # TypeScript type check
```

## What's here

React 18 + Vite + Tailwind (shadcn/ui components) on the front end, and a small Express API behind it.

```
client/src/        the React site — components/, pages/, hooks/
server/            the Express API used in local development
api/index.js       the serverless API Vercel actually runs in production
shared/schema.ts   Zod schemas: the single source of types and validation
attached_assets/   images and media
```

## Updating the amount raised

In production the campaign figures are **hardcoded in `api/index.js`**, not read from a database. To update the thermometer, change `totalRaised` there and push to `main`.

## Deployment

Vercel (project `smt-housing`) deploys automatically on every push to `main`. `VERCEL_DEPLOY.md` has the details. The basic site needs no environment variables.

## More

`CLAUDE.md` has the full architecture: API endpoints, admin login, the storage layer, and patterns for adding components and forms. `replit.md` is left over from the site's Replit origins.
