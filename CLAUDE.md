# Marathonazza — Golf Tournament Web App

## Project Overview

**Marathonazza** is a real-time golf tournament scoring web app for a private competition among friends. It tracks scores live, displays leaderboards, and manages 4 special competitions.

**Tournament format:** Greensome Medal (pairs), 14 pairs, 5 rounds of 9 holes.
**Event date:** Monday (imminent — build fast and correctly).

---

## Tech Stack

- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwind CSS (custom config with golf palette)
- **Database & Backend:** Supabase (PostgreSQL + Realtime subscriptions + Storage)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Fonts:** Playfair Display (headings) + Inter (body) via Google Fonts
- **Deploy:** Vercel

---

## Project Structure

```
marathonazza/
├── src/
│   ├── pages/
│   │   ├── Leaderboard.tsx      # Page 1: public leaderboard (/)
│   │   ├── LiveRound.tsx        # Page 2: live hole-by-hole view (/live)
│   │   ├── ScoreEntry.tsx       # Page 3: score input for players (/enter)
│   │   └── Admin.tsx            # Page 4: admin panel (/admin)
│   ├── components/
│   │   ├── leaderboard/         # MainTable, PodiumCard, SpecialCards
│   │   ├── live/                # RoundTable, HoleHeader, HoleModal
│   │   ├── entry/               # CodeGate, ScoreTable, NearestPinForm
│   │   ├── admin/               # PhotoUpload, MapUpload, WinnerSelect
│   │   └── ui/                  # Shared: Button, Badge, Modal, Spinner
│   ├── lib/
│   │   ├── supabase.ts          # Supabase client init
│   │   ├── scoring.ts           # Net score calculations, BirdieCup logic
│   │   └── constants.ts         # Pairs data, access codes, hole order
│   ├── hooks/
│   │   ├── useLeaderboard.ts    # Realtime leaderboard subscription
│   │   ├── useRoundScores.ts    # Round score fetching & submission
│   │   └── useSpecials.ts       # Special competitions data
│   └── styles/
│       └── globals.css
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── public/
│   └── logo.png                 # Add Marathonazza logo here
├── CLAUDE.md                    # ← you are here
├── REQUIREMENTS.md              # Detailed per-page feature requirements
├── DATABASE.md                  # Full Supabase schema + seed SQL
└── DESIGN.md                    # Design system, palette, component guidelines
```

---

## Key Domain Rules

### Tournament Structure
- 28 players → 14 pairs → 7 tee groups (2 pairs per group)
- Shotgun start: each group always starts from the same hole (1–7) every round
- 5 rounds × 9 holes = 45 holes total per pair
- Holes 8 and 9 are never starting holes

### Score Calculation
- Each pair plays as a single unit (ONE stroke count per hole per pair)
- **Net score per round** = sum of 9 hole strokes − pair's handicap
- **Total net score** = sum of net scores across all submitted rounds (lower is better)
- Handicap is subtracted once per completed round (NOT per hole, NOT mid-round)
- Leaderboard updates only when a pair submits a complete round

### Hole Play Order (Shotgun Start)
A pair starting from hole N plays holes in this sequence:
`N, N+1, N+2, ..., 9, 1, 2, ..., N-1`

Example: starting hole 3 → plays [3,4,5,6,7,8,9,1,2]

### Access Codes
7 fixed codes, one per tee group. Each code unlocks score entry for exactly 2 pairs.
Codes: `BUCA1` through `BUCA7` (case-insensitive).
No real authentication — these are simple unlock codes for a private event.

### Round Submission Flow
- Player enters strokes for all 9 holes in the correct starting order
- "Conferma giro" button activates only when all 9 holes are filled
- Confirmation dialog shown before final submission
- Once submitted, the round is locked and included in the leaderboard
- Admin can unlock/edit submitted rounds from the admin panel

---

## Special Competitions

| Name | Hole | Rule | How winner is set |
|------|------|------|-------------------|
| Nearest to the Pin | 2 | First shot closest to pin (lowest cm) | Auto from entered distances |
| BirdieCup | 8 | Most birdie scores (= 2 strokes, par 3) at hole 8 across all rounds | Auto-calculated |
| Closest to the Line | 7 | First shot closest to fairway center line | Manual dropdown (anyone) |
| Drive in Contest | 9 | Longest drive on hole 9 in round 5 only | Manual dropdown (anyone) |

---

## Supabase Setup Notes

- Enable **Realtime** on tables: `hole_scores`, `rounds`, `nearest_to_pin`, `special_winners`
- Enable **Storage** buckets: `pair-photos` (public), `hole-maps` (public)
- Row Level Security: disabled (private event, no real auth)
- Supabase URL and anon key go in `.env.local`:
  ```
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_ANON_KEY=...
  ```

---

## Development Order

1. `supabase/migrations/001_initial_schema.sql` — schema + seed data
2. `src/lib/supabase.ts` + `src/lib/constants.ts` — client + static data
3. `src/lib/scoring.ts` — all calculation logic (unit-testable)
4. **Page 4 — Admin** (`/admin`) — needed first to load photos/maps before event
5. **Page 3 — Score Entry** (`/enter`) — core game functionality
6. **Page 2 — Live Round** (`/live`) — read-only real-time table
7. **Page 1 — Leaderboard** (`/`) — hero, rankings, specials
8. Supabase Realtime wiring on leaderboard + live pages
9. Mobile responsiveness pass (players use phones during the round)
10. Final design polish

---

## Design Principles

See `DESIGN.md` for full system. In brief:
- **Vibe:** luxury modern golf — think Augusta meets a boutique Italian club
- **Palette:** deep golf green `#1B4332`, accent `#40916C`, gold `#C9A84C`, off-white `#F8FAF5`
- **Typography:** Playfair Display for all headings, Inter for body/UI
- **Mobile-first:** score entry page especially must be thumb-friendly (large tap targets)
- **Animations:** subtle entrance animations on leaderboard rows, crown animation for 1st place

---

## Important Constraints

- The app will be used live during a golf round — keep UI dead simple on Page 3
- Players use phones outdoors → high contrast, large text, minimal taps
- No user accounts, no email, no passwords — just the 7 access codes
- Supabase Realtime is the only backend; no custom server or API routes
- Par values for the 9 holes are editable from the Admin panel (not hardcoded)
- Hole map images are uploaded via Admin panel to Supabase Storage (not bundled in repo)
- Logo file: `public/logo.png` — player will add this file manually
