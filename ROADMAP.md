# Roadmap

Status legend: 🔲 Not started · 🟡 In progress · ✅ Done

---

## Phase 1 — Core record & playback 🔲
- [ ] Supabase project + auth (Google OAuth)
- [ ] Workspaces + workspace_members schema
- [ ] Browser recording (MediaRecorder + getDisplayMedia)
- [ ] Presigned R2 upload flow
- [ ] Recording library UI (list, folders)
- [ ] Playback page (no transcript yet)

**Exit criteria:** Can record a screen capture in-browser, it uploads to R2, and shows up playable in a library view.

---

## Phase 2 — Transcription pipeline 🔲
- [ ] AssemblyAI integration (job trigger on upload complete)
- [ ] Webhook/poll handling for transcript completion
- [ ] Transcript storage (full_text, speakers, chapters, summary)
- [ ] Transcript view UI synced to video playback

**Exit criteria:** Every recording automatically gets a transcript with speaker labels within a few minutes of upload.

---

## Phase 3 — SOP generation 🔲
- [ ] GPT prompt for transcript → structured markdown SOP (reuse/adapt existing handover-doc prompt)
- [ ] SOP storage + edit UI
- [ ] Export SOP as markdown/PDF

**Exit criteria:** One click on a finished recording produces an editable SOP doc.

---

## Phase 4 — Sharing & collaboration 🔲
- [ ] Public share links (token-based, no auth required for viewer)
- [ ] Timestamped comments
- [ ] Expiring links / access control

**Exit criteria:** A client can be sent a link and view a recording + SOP without a Loomless account.

---

## Later / Unscheduled
- Desktop app for system-wide capture (ADR-003)
- Multi-tenant agency model (nested client orgs, not just flat workspace members)
- Mobile capture
- Analytics (view counts, completion rate) — useful once client-facing
