# Contributing

Internal conventions for working on Loomless — solo/small-team project, but kept consistent for future hires and AI coding agents (Claude Code, Cursor).

## Branch naming
Match the pattern used on other projects: `<tool>/<descriptor>-<id>`
Example: `claude/loomless-phase1-record-upload`

For manual/non-agent branches: `feature/short-description`, `fix/short-description`.

## Commit messages
Conventional, short, imperative:
- `feat: add presigned R2 upload flow`
- `fix: recording duration not saving on stop`
- `chore: update env example`

## Before merging to main
1. Test on the Vercel preview URL — never merge straight to main without reviewing the preview deploy.
2. Confirm migrations have been run against the Supabase project if schema changed.
3. Update CHANGELOG.md under `[Unreleased]` or cut a new dated entry.

## Working with Claude Code / Cursor
- Read relevant docs (VISION.md, ROADMAP.md, DECISIONS.md) before starting a new phase — these define scope and prevent re-litigating settled decisions.
- Mega-prompts for each phase live in `/docs/prompts/` (create as needed per phase).
- Schema changes go through a migration file, not direct dashboard edits, so they're tracked.

## Environment
- Local dev: `.env.local` (gitignored)
- Production: Vercel project env vars
- Never commit real keys — `.env.example` documents required vars with placeholder values only.
