# Loomless

Record walkthroughs, generate SOPs. Next.js 14 (App Router) web app.

This repository currently contains the **Phase 1 UI layer** — the screens ported
from the AI Studio reference prototype (`/design/ai-studio-reference`) and
corrected to the project's standards. It is UI/UX only: capture, upload,
transcription, and share-link generation arrive in later functional passes.

## Stack

- **Next.js 14** App Router (React Server + Client Components)
- **Tailwind CSS** with design tokens wired to CSS custom properties
- **Geist** font via `next/font` (`geist` package)
- **next-themes** for persisted light/dark theming (light is default)
- **lucide-react** icons
- **@supabase/ssr** clients (browser + server), ready for the data layer

## Theming & tokens

`DESIGN_SYSTEM.md` is the single source of truth. All colors are CSS custom
properties defined in `app/globals.css` under `:root` (light) and `.dark`
(dark), surfaced as Tailwind utilities via `tailwind.config.ts`
(`bg-surface-0`, `text-fg-secondary`, `border-border`, `bg-accent`, …).
**Components never contain raw hex values** — only the token definitions do.

## Structure

```
app/
  layout.tsx              Root layout: fonts + ThemeProvider
  globals.css             Token definitions + base styles
  (app)/
    layout.tsx            App shell: sidebar + content + global overlays
    page.tsx              Dashboard
    library/page.tsx      Library (folders + list/grid)
    settings/page.tsx     Settings (general + members)
    profile/page.tsx      Profile
    playback/[id]/page.tsx Playback (video + transcript panel)
components/               Ported UI components (Sidebar, Dashboard, …)
lib/
  types.ts               Domain types aligned to the Phase 1 schema
  data.ts                Server data-access layer (returns empty until wired)
  supabase/              Browser + server Supabase clients
design/ai-studio-reference/  Original Vite prototype — reference only, not built
```

The capture flow (CaptureSetup modal → Viewfinder takeover → back to Dashboard)
and the Share modal are app-wide overlays driven by `components/shell-context.tsx`.

## Getting started

```bash
npm install
cp .env.example .env.local   # add Supabase keys to wire real data (optional in Phase 1)
npm run dev
```

Without Supabase env vars, every screen renders its empty/pending state.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — Next.js lint
