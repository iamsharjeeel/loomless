# Loomless — DESIGN_SYSTEM.md

Source: Stitch "Studio Dark" export, confirmed against rendered screens (dashboard, playback, capture, settings, profile, empty state, share modal — desktop + mobile). This document is the single source of truth for theming. Read this before any Composer/Claude Code session that touches UI.

---

## Philosophy

"Pro Tools" aesthetic — minimal chrome, content (recordings, transcripts) is the visual anchor, not decoration. Sharp 4px radii, no gradients, no heavy shadows — depth comes from tonal layering and 1px borders. Built for people who work with video all day; the UI should feel like a precision instrument, not a marketing site.

This applies identically in dark and light mode. Light mode is **not** a different design — it's the same system with inverted tonal values and a tuned accent. Every screen must work in both without layout or component changes — only token values change.

---

## Theme tokens

### Dark mode (existing, confirmed from Stitch export)

| Token | Value | Usage |
|---|---|---|
| `--surface-0` | `#0A0A0A` | App background (Stitch render used `#121408`, normalize to pure near-black per DESIGN.md prose intent) |
| `--surface-1` | `#1A1A1A` | Cards, panels, sidebar |
| `--surface-2` | `#141414` | Inputs, recessed elements |
| `--border` | `#2A2A2A` | Default hairline border |
| `--border-active` | `#D2F000` | Focus/active border (accent) |
| `--text-primary` | `#FFFFFF` | Headings, primary content |
| `--text-secondary` | `#C8C6C5` | Body, metadata, muted text |
| `--text-tertiary` | `#909378` | Disabled, placeholder |
| `--accent` | `#D2F000` | Primary actions, active states, record indicator (electric lime) |
| `--accent-dim` | `#B8D300` | Accent hover/pressed state |
| `--on-accent` | `#1A1E00` | Text/icons placed on top of accent-colored elements |
| `--error` | `#FFB4AB` | Error text/icons |
| `--error-container` | `#93000A` | Error background |

### Light mode (new — derived from dark, same structural logic)

Light mode is "close to white but not white" per your spec — uses a warm-neutral off-white rather than pure `#FFFFFF`, which keeps the same "considered, not generic SaaS" feel the dark mode has.

| Token | Value | Usage |
|---|---|---|
| `--surface-0` | `#F7F7F4` | App background (warm off-white, not pure white) |
| `--surface-1` | `#FFFFFF` | Cards, panels, sidebar (pure white reads as "elevated" against the off-white base — inverse logic of dark mode's lighter-is-elevated) |
| `--surface-2` | `#EFEFEA` | Inputs, recessed elements |
| `--border` | `#E2E2DC` | Default hairline border |
| `--border-active` | `#7A8C00` | Focus/active border (darkened accent — see note below) |
| `--text-primary` | `#121408` | Headings, primary content |
| `--text-secondary` | `#5C5E4F` | Body, metadata, muted text |
| `--text-tertiary` | `#909378` | Disabled, placeholder (same tone works in both modes at this contrast level) |
| `--accent` | `#7A8C00` | Primary actions, active states (darkened lime — see note) |
| `--accent-dim` | `#697800` | Accent hover/pressed state |
| `--on-accent` | `#FFFFFF` | Text/icons placed on top of accent-colored elements |
| `--error` | `#B3261E` | Error text/icons |
| `--error-container` | `#FFDAD6` | Error background |

**Accent note:** The raw electric lime `#D2F000` fails contrast against a white/off-white background — it's designed to glow against near-black, not sit on light surfaces. For light mode, the accent is darkened to `#7A8C00` (same hue, shifted luminance) so it keeps the "electric lime" identity while passing WCAG AA for text and meaningful UI elements. The lime is preserved at full brightness only for small high-contrast accents (badges, dots, the record-button fill) where it sits on a dark chip rather than directly on the light background.

---

## Typography

Unchanged between modes.

| Style | Font | Size | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| Display LG | Geist | 48px | 700 | 1.1 | -0.04em |
| Headline LG (desktop) | Geist | 32px | 600 | 1.2 | -0.03em |
| Headline LG (mobile) | Geist | 24px | 600 | 1.2 | -0.02em |
| Headline MD | Geist | 20px | 600 | 1.4 | -0.02em |
| Body LG | Geist | 16px | 400 | 1.6 | 0em |
| Body SM | Geist | 14px | 400 | 1.5 | 0em |
| Label Caps | Geist | 12px | 600 | 1.0 | 0.05em |
| Mono Label | Geist | 12px | 500 | 1.0 | 0em |

Headings keep negative tracking in both modes. Use `label-caps` (uppercase, wide tracking) for metadata, timestamps, and status chips ("DRAFT", "LIVE", "NEW", "HD").

---

## Shape & spacing

Unchanged between modes — this is the part of the system that should never differ by theme.

- **Radius:** 4px standard (buttons, cards, inputs, thumbnails). Mobile FAB only exception — fully circular.
- **Grid:** 4px base unit.
- **Padding rhythm:** 16px (4 units) standard padding, 32px (8 units) section grouping.
- **Sidebar (desktop):** 64px fixed width, icon-only, expandable on hover if needed.
- **Mobile nav:** bottom tab bar, raised center FAB for Record.
- **Container max-width:** 1440px.
- **Gutter:** 16px.

---

## Elevation & depth

### Dark mode
Tonal layering, not shadows. Level 0 = `--surface-0`. Level 1 (cards/panels) = `--surface-1` with 1px `--border`. Active elements get a 1px `--accent` border. Overlays use `--surface-1` at 90% opacity with 8px backdrop blur.

### Light mode
Same tonal-layering logic, inverted: Level 0 = `--surface-0` (off-white). Level 1 (cards/panels) = `--surface-1` (pure white) with 1px `--border` — white-on-off-white needs the border to read as elevated, since light mode can't rely on brightness-as-elevation the way dark mode does. A very subtle shadow (`0 1px 2px rgba(0,0,0,0.04)`) is permitted in light mode only, since flat tonal contrast is weaker on light backgrounds — this is the one rule that's allowed to differ structurally between modes. Keep it barely perceptible; this system should never look like a default Bootstrap shadow.

---

## Components

| Component | Dark mode | Light mode |
|---|---|---|
| Primary button | Solid `--accent` fill, `--on-accent` text | Solid `--accent` fill, `--on-accent` text (same pattern, darkened accent makes white text legible) |
| Secondary button | Ghost, white text, 1px `--border` | Ghost, `--text-primary` text, 1px `--border` |
| Video thumbnail | 4px radius, 1px white-5%-opacity inner glow border | 4px radius, 1px `--border` (no glow — glow effect is a dark-mode-only trick, doesn't read on light) |
| Scrubber/timeline | 2px line, `--accent` progress, 8x8px square step markers | Same structure, `--accent` (darkened) progress |
| Sidebar icons | 20px, muted gray default, white on hover, `--accent` when active | 20px, muted gray default, `--text-primary` on hover, `--accent` when active |
| Inputs | `--surface-2` background, 1px `--border`, focus border → `--accent` | Same pattern |
| Chips/status tags | Rectangular, 2px radius, `--surface-1` background, `label-caps` type | Same pattern |
| Transcript active line | `--surface-2` background highlight, `--accent` left border accent | Same pattern |

---

## Theme toggle

- Persisted via `next-themes` or equivalent (localStorage + system preference fallback on first load — but note: artifacts in this build cannot use localStorage; this applies to the actual Next.js app, not any Claude-generated artifact preview).
- Toggle lives in Settings and as a quick-access icon in the sidebar/profile menu.
- No transition flash: set the theme class on `<html>` before paint (standard `next-themes` script-injection approach) to avoid a dark→light flash on load.
- All color tokens defined as CSS variables (`--surface-0`, `--accent`, etc.) scoped under `:root` (light, default) and `.dark` (dark mode override) — components reference variables only, never hardcoded hex values, so the toggle requires zero component-level logic.

---

## Implementation notes for Claude Code / Cursor

- Tailwind config should map these CSS variables into the theme (`colors: { surface: { 0: 'var(--surface-0)', ... } }`), not hardcode hex values in `tailwind.config.ts`.
- Every component built must be checked in both themes before being considered done — this is a hard rule, not a nice-to-have, since light mode was added after the original dark-only Stitch export and it's easy to accidentally ship a dark-only assumption (e.g. the thumbnail glow-border trick above).
- Source screens (7 screens × 2 viewports, dark mode) are in `/design/stitch-export/` — copy the Stitch export folder into the repo at this path for reference during build.
- Do not regenerate or redesign screens — this document plus the existing Stitch HTML/PNG exports are the spec. Build to match, don't reinterpret.
