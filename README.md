# Riyasat Swat Goods Transport — Billing System

Mobile-first, installable PWA for creating, printing, and sharing goods-transport
bills, built with React + Vite + Supabase.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your Supabase project URL + anon key
   (already pre-filled from the values you gave — double check them).
3. In the Supabase SQL editor, run `supabase/schema.sql` once to create the
   `bills`, `customers`, `settings` tables, RLS policies, and helper functions.
4. In Supabase → Authentication, add one admin user (email + password) — the
   app requires signing in as this user (RLS is authenticated-only).
5. `npm run dev` to run locally.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under
   Project Settings → Environment Variables.
4. Deploy — `vercel.json` handles SPA routing.

## Build order

The app was built phase-by-phase per `phases.md`:
0. Scaffold + Supabase setup
1. Bill form + live calculation
2. Slip rendering + blank-field suppression
3. Print / WhatsApp / PNG export
4. Saved customers
5. Bill history + search
6. Settings + presets
7. Polish (totals dashboard, responsive QA)

See `app.md`, `rules.md`, `structure.md`, `security.md` for the full spec
this build follows.
