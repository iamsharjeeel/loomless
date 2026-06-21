# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added — Phase 1 functionality
- **Auth gate**: middleware redirects unauthenticated visitors to `/signin` and
  signed-in users away from it. The dashboard is no longer reachable without a
  session.
- **Sign-in**: `/signin` page with Google OAuth via Supabase Auth, plus the
  `/auth/callback` route that exchanges the OAuth code for a session.
- **Sign-out**: wired into the Profile page and the desktop sidebar (calls
  Supabase `signOut` and redirects to sign-in).
- **Workspace bootstrap**: first-login `/onboarding` flow creates a `workspaces`
  row and an owner `workspace_members` row; users with a workspace skip it.
- **Real data layer**: `lib/data.ts` now queries Supabase scoped to the active
  workspace (recordings, folders, members, profile) instead of returning stubs.
- **Recording capture**: CaptureSetup acquires a `getDisplayMedia` stream (with
  optional mic) inside the click gesture; Viewfinder drives `MediaRecorder` with
  a live timer, pause/resume, and auto-stop when the user ends the share.
- **Upload to R2**: on stop, a `recordings` row is created, a presigned PUT URL
  is requested from `/api/r2/presign` (R2 secrets stay server-side), the webm
  blob is uploaded directly to R2, and the row is marked `ready` (or `failed`
  with retry).
- **Library/Dashboard wiring**: real recordings list, folder creation and
  filtering against the `folders` table, inline title rename, and delete (removes
  the R2 object via `DELETE /api/recordings/[id]` then the DB row).
- **Playback wiring**: video element backed by a short-lived signed R2 GET URL,
  editable persisted title, real created date/duration, and delete. Transcript
  panel remains in its Phase 1 pending state.
- **Schema**: canonical Phase 1 migration at
  `supabase/migrations/0001_phase1_schema.sql` (workspaces, workspace_members,
  folders, recordings) with RLS scoped to workspace membership.

### Notes
- Settings capture/SOP toggles and team-member invites remain client-side —
  there is no settings/invite table in the Phase 1 schema.
- Transcription, SOP generation, and real share-link generation are out of scope
  (Phases 2–4); the ShareModal stays a UI shell.
