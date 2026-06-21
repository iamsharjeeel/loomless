# Decisions

Lightweight ADR (Architecture Decision Record) log. Each entry: what was decided, why, what else was considered, date.

---

## ADR-001: Storage — Cloudflare R2 over Supabase Storage
**Date:** 2026-06-22
**Decision:** Use Cloudflare R2 for recording file storage.
**Why:** Zero egress fees. Video playback is bandwidth-heavy; Supabase Storage bills for bandwidth out, R2 doesn't. Already on Cloudflare for email routing — one less vendor relationship. S3-compatible API works cleanly with Next.js presigned upload flow.
**Alternatives considered:** Supabase Storage (simpler, one less service, but egress cost compounds as recording library grows).

---

## ADR-002: Transcription — AssemblyAI over raw Whisper
**Date:** 2026-06-22
**Decision:** Use AssemblyAI for transcription, diarization, chapters, and summary.
**Why:** Built-in speaker diarization and auto-summary/chapters save building that layer manually on top of raw Whisper output. Given client-sharing is on the roadmap, separating "you" from "client" in a transcript matters. Cost gap vs. Whisper ($0.015/min vs $0.006/min) is small at expected usage volume.
**Alternatives considered:** OpenAI Whisper API (cheaper, no diarization/summary out of box), local Whisper via existing Ollama stack (free compute, but ties transcription to local machine uptime, no diarization).

---

## ADR-003: Capture method — Browser first, both eventually
**Date:** 2026-06-22
**Decision:** Build browser-based tab/screen capture first (MediaRecorder + getDisplayMedia). Desktop app (system-wide capture) is a later phase, not Phase 1.
**Why:** No-install browser capture ships faster and covers the majority of SOP/handover use case (recording a browser-based workflow in GHL, Cadence, etc.). Desktop app adds Electron/Tauri complexity that isn't justified until browser capture proves the core workflow.
**Alternatives considered:** Desktop-first (broader capture capability, slower to ship).

---

## ADR-004: Standalone project, not a Cadence module
**Date:** 2026-06-22
**Decision:** New dedicated Supabase/Vercel project, not built inside the existing Cadence codebase.
**Why:** Different product surface, different users eventually (client-facing sharing), cleaner separation of concerns and billing/usage tracking per product.

---

## ADR-005: Name — Loomless
**Date:** 2026-06-22
**Decision:** Product name is Loomless.
**Why:** Coined compound word, no existing software trademark or product collision found (checked against "Recap" — existing risk-management SaaS, generic; "Stenograph" — registered transcription/court-reporting company, direct category collision; "Playback" — generic, crowded). Loomless is descriptive of positioning (no Loom required) and distinctive enough to be ownable.
**Risk noted:** Direct competitor-name reference in the product name. Acceptable for internal/positioning use; revisit if this becomes a public-facing commercial product under Simple Solutions branding.
