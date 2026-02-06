# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

St Matt's Kāinga fundraising website - a church-led affordable housing project raising $24,000 annually to maintain rent subsidies for 8 homes in Taitā, New Zealand. Built as a full-stack TypeScript application with React frontend and Express backend.

## Development Commands

### Running the Application
```bash
# Development mode with hot reload
npm run dev

# Production build (for Vercel)
npm run build

# Start production server (local only)
npm start

# Type checking
npm run check
```

### Deployment

**Platform**: Vercel (static site with minimal serverless API)

**Deploy**: Push to GitHub and Vercel auto-deploys, or run `vercel` CLI

**Updating Campaign Balance**:
Edit the hardcoded values in `api/index.js`:
- `totalRaised: 18500` - Update this number
- Campaign data is served from this file, not from database/files

No environment variables required for basic deployment.

## Tech Stack Architecture

### Monorepo Structure
- **client/** - React frontend with Vite
- **server/** - Express.js API backend
- **shared/** - Shared TypeScript types and Zod schemas
- **attached_assets/** - Static images and media

### Path Aliases (configured in vite.config.ts and tsconfig.json)
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (dev server + production bundler)
- **Routing**: Wouter (lightweight client-side routing)
- **State**: TanStack Query (React Query) with 30-second refresh for campaign data
- **Forms**: React Hook Form + Zod validation
- **UI**: shadcn/ui components (Radix UI primitives + Tailwind)
- **Styling**: Tailwind CSS with custom church branding colors

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ES modules, not CommonJS)
- **Data Storage**: `MemStorage` class - in-memory storage with JSON file persistence
  - `campaign-data.json` - campaign metadata and totals
  - `donations.json` - donation records
  - Implements `IStorage` interface for easy future database migration
- **Session**: express-session with MemoryStore (24-hour session lifetime)
- **Email**: Nodemailer service configured in `server/email.ts`

### Data Layer
- **Validation**: Zod schemas in `shared/schema.ts` (source of truth for all types)
- **Type Safety**: TypeScript types inferred from Zod schemas using `z.infer<>`
- **Drizzle ORM**: Configured but not actively used (placeholders for future database)

## Key Application Concepts

### Data Flow Pattern
1. Shared Zod schemas (`shared/schema.ts`) define validation and types
2. Frontend forms validate with React Hook Form + Zod resolvers
3. API routes validate incoming data with same Zod schemas
4. Storage layer (`server/storage.ts`) implements `IStorage` interface
5. Campaign progress auto-updates when donations are created

### Storage Abstraction
The `IStorage` interface allows switching storage backends without changing route handlers:
- Current: `MemStorage` (in-memory + JSON files)
- Future: Database implementation using Drizzle ORM
- Key methods: `createDonation()`, `getCampaignSummary()`, `updateCampaignProgress()`

### Admin Authentication
Simple session-based auth (NOT production-grade):
- Admin password stored in `ADMIN_PASSWORD` environment variable
- Session authenticated for 24 hours after login
- Protected routes use `requireAdminAuth` middleware
- Endpoints: `/api/admin/auth`, `/api/admin/update-amount`, `/api/admin/logout`

### Campaign Data Updates
Two sources of truth that must stay synchronized:
1. **Donation records** - individual donation entries in `donations.json`
2. **Campaign totals** - aggregated data in `campaign-data.json`

When donations are created via `storage.createDonation()`, the method automatically calls `updateCampaignProgress()` to recalculate totals. Manual admin updates via `/api/admin/update-amount` directly modify campaign totals without creating donation records.

## API Endpoints

### Public Endpoints
- `GET /api/campaign/summary` - Campaign progress (goal, raised, percentage, days remaining)
- `GET /api/campaign/data` - Full campaign metadata
- `GET /api/donations/recent?limit=5` - Recent donations (limited public data)
- `POST /api/donations` - Submit online donation
- `POST /api/newsletter/signup` - Newsletter subscription
- `POST /api/contact` - Contact form submission

### Admin Endpoints (require authentication)
- `POST /api/admin/auth` - Login with password
- `POST /api/admin/logout` - End session
- `POST /api/admin/update-amount` - Manually set total raised amount
- `PATCH /api/campaign` - Update campaign metadata
- `GET /api/donations` - List all donations

## Environment Variables

Required environment variables:
- `PORT` - Server port (defaults to 5000, but use 5001 for local dev per global config)
- `ADMIN_PASSWORD` - Admin authentication password
- `SESSION_SECRET` - Session encryption key (defaults to development value)
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 tracking ID (frontend)

Note: The server ALWAYS uses `process.env.PORT` and defaults to 5000. For local development, set `PORT=5001` to avoid conflicts with macOS AirPlay Receiver.

## Project-Specific Patterns

### Component Organization
- `client/src/components/` - Page sections (hero, donation, impact, etc.)
- `client/src/components/ui/` - shadcn/ui components (buttons, forms, dialogs)
- `client/src/pages/` - Route pages (home, admin, not-found)
- `client/src/hooks/` - Custom React hooks (analytics, campaign data, toast)

### State Management Pattern
Use TanStack Query for all server state:
```typescript
// Example: fetching campaign data
const { data, isLoading } = useCampaignData(); // Custom hook wraps useQuery
```

Auto-refresh configured in `client/src/lib/queryClient.ts`:
- `staleTime: 30000` (30 seconds)
- Automatic background refetching enabled

### Form Validation Pattern
Forms use React Hook Form with Zod resolvers:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDonationSchema } from "@shared/schema";

const form = useForm({
  resolver: zodResolver(insertDonationSchema),
  defaultValues: { ... }
});
```

### Analytics Integration
Google Analytics 4 implemented in `client/src/lib/analytics.ts`:
- `trackPageView()` - Automatic page view tracking
- `trackEvent()` - Custom event tracking (donations, form submissions)
- Hook: `useAnalytics()` for component-level tracking

## Development Notes

### Vite Dev Server Integration
In development mode (`NODE_ENV=development`), Express serves Vite middleware:
- Vite dev server handles HMR and React Fast Refresh
- Express API routes mounted at `/api/*`
- All other routes proxy to Vite for client rendering
- Configuration in `server/vite.ts`

### Build Process
1. `vite build` - Bundles React frontend to `dist/public/`
2. `esbuild server/index.ts` - Bundles Express server to `dist/index.js`
3. Production server serves static files from `dist/public/`

### TypeScript Configuration
- `tsconfig.json` - Root config with path mappings
- Strict mode enabled with modern ES2022 target
- Both `client/` and `server/` use same config via extends

### Replit-Specific Features
Development environment includes Replit integrations:
- `@replit/vite-plugin-cartographer` - Code mapping
- `@replit/vite-plugin-runtime-error-modal` - Error overlay
- Only loaded when `REPL_ID` environment variable present

## Common Tasks

### Adding a New API Endpoint
1. Define Zod schema in `shared/schema.ts` (if new data type)
2. Add route handler in `server/routes.ts`
3. Use `requireAdminAuth` middleware if admin-only
4. Validate request body with Zod schema
5. Update storage methods in `server/storage.ts` if needed

### Adding a New UI Component
1. Add component to `client/src/components/` (page sections) or `client/src/components/ui/` (reusable UI)
2. Import and use in page component from `client/src/pages/`
3. Use Tailwind CSS for styling (follow existing patterns)
4. Use shadcn/ui components for forms, dialogs, buttons

### Modifying Campaign Data Structure
1. Update Zod schema in `shared/schema.ts`
2. Update `IStorage` interface and `MemStorage` implementation in `server/storage.ts`
3. Update JSON file structure in `campaign-data.json`
4. Update frontend components consuming the data
5. Run type checker: `npm run check`

### Working with Forms
1. Define schema in `shared/schema.ts`
2. Create form component using React Hook Form + Zod resolver
3. Use shadcn/ui form components (`<Form>`, `<FormField>`, `<FormItem>`)
4. Handle submission with async/await and TanStack Query mutation
5. Show success/error with toast notifications

## Communication Style

Use simple, everyday language - avoid jargon when explaining features to users. This is a community fundraising project for a church, not a tech company.
