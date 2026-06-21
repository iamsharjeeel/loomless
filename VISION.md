# Loomless — Vision

## What this is
Loomless is a self-hosted screen-recording, transcription, and SOP-generation tool. Record a walkthrough, get a searchable transcript with speaker labels, and auto-generate a structured SOP doc from it — without paying per-seat for Loom or manually transcribing handover videos by hand.

## The problem
Recording client handovers, internal training, and SOPs currently means either:
- Paying for Loom (per-seat, capped minutes on lower tiers, no native SOP output)
- Recording raw, then manually transcribing and restructuring into a doc afterward (slow, repetitive)

Both routes break down at agency scale — multiple team members, multiple client accounts, recurring SOP needs (subaccount handovers, GHL workflow walkthroughs, training docs).

## Who it's for
- **Now:** Internal use — Sharjeel, Emily, Ryan. Recording client handovers, internal training, SOP creation.
- **Later:** Client-facing sharing — send a recording + SOP link directly to a client without giving them platform access.

## What it is
- Browser-based screen + tab recording (system-wide capture later if needed)
- Automatic transcription with speaker diarization (who said what)
- Auto-generated chapters and summary
- One-click SOP generation from transcript (markdown, editable)
- Shareable links, timestamped comments, workspace-scoped library

## What it is NOT (v1)
- Not a video editor (no trimming, overlays, annotations in v1)
- Not a live-streaming or webinar tool
- Not a course/LMS platform
- Not multi-org/agency-of-agencies — single workspace model with members, not nested client orgs (yet)

## North star
Replace Loom entirely for internal use within 90 days of Phase 1 ship. Success = zero new Loom recordings made by the team after that point.

## Why now
Existing pattern proven: GHL handover video → manual transcript → SOP doc was already done once by hand. This automates a workflow that's already validated as valuable, using a stack (Next.js/Supabase/Vercel) already proven on Cadence and Pulse.
