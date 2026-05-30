# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev (starts Vite frontend — run Convex backend separately)
npm run dev

# Convex backend (must run concurrently with dev)
npx convex dev

# Build
npm run build

# Lint
npm run lint

# Production build
npm run build:prod
```

No test suite configured. `build` script runs `tsc -b` for type checking.

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Convex (backend-as-a-service)

**Entry point:** `src/main.tsx` wraps app in `ConvexAuthProvider` → `HelmetProvider` → `App`

**Auth flow:**
- `@convex-dev/auth` with `Password` provider (email+password only)
- `convex/auth.ts` + `convex/auth.config.ts` configure server-side auth
- `src/contexts/AuthContext.tsx` wraps `useConvexAuth` + `useAuthActions` to expose a simpler `{ user, loading, signIn, signOut }` interface
- All `/admin/*` routes gated by `src/components/ProtectedRoute.tsx`

**Routing (React Router):** Spanish URL slugs (`/servicios`, `/acerca-de`, `/reservar`, `/galeria`, `/contacto`, `/blog/:slug`). Admin at `/admin/*` via `AdminLayout`.

**Data layer pattern:**
- Each Convex table has a matching hook in `src/hooks/` (e.g., `useServices.ts`, `useBlogPosts.ts`)
- Hooks wrap Convex `useQuery`/`useMutation` calls and are the single data access layer
- Convex functions live in `convex/*.ts` — one file per domain

**Convex schema tables:** `services`, `testimonials`, `blog_posts` (indexed by `slug`), `appointments` (indexed by `appointment_date`), `payments` (indexed by `appointment_id`), `media_gallery` (indexed by `category`), `contact_messages`, `site_content` (key-value store for CMS content), `media_uploads` (Convex Storage references)

**`site_content` table** is a key-value CMS — site text/config stored as `{ key, value }` rows, fetched via `useSiteContent` hook.

**Media:** `convex/mediaGallery.ts` + `convex/mediaUploads.ts` handle gallery items and Convex Storage uploads. `media_type` can be `photo | video | youtube | instagram`.

**Path alias:** `@` → `src/` (configured in `vite.config.ts`)

**UI components:** Radix UI primitives + shadcn/ui pattern (`components.json` present). Shared components in `src/components/`.

## Environment

Requires `.env.local` with:
```
VITE_CONVEX_URL=<from Convex dashboard>
```

Convex backend needs these env vars (set in Convex dashboard → Settings → Environment Variables):
```
CONVEX_SITE_URL=<your Convex deployment URL>   # required for auth
RESEND_API_KEY=<from resend.com>               # email notifications
RESEND_FROM_EMAIL=noreply@yourdomain.com       # must be verified in Resend
ADMIN_EMAIL=admin@yourdomain.com               # receives booking/contact notifications
```
