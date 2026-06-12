# Marathonazza Full App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Marathonazza real-time golf tournament scoring web app (4 pages, 4 special competitions, Supabase backend) ready to use live on Monday.

**Architecture:** React + Vite SPA, React Router v6 for the 4 pages. All state comes from Supabase (Postgres + Realtime + Storage); no custom server. Pure scoring logic isolated in `src/lib/scoring.ts` (unit-tested with Vitest). Data access via typed hooks (`useLeaderboard`, `useRoundScores`, `useSpecials`) that wrap supabase-js and own Realtime subscriptions. Tailwind for styling with the golf palette from DESIGN.md.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, @supabase/supabase-js v2, react-router-dom v6, lucide-react, Vitest + @testing-library/react.

**Method note:** TDD (failing test first) is applied to `src/lib/scoring.ts` only — it is pure and the spec calls it "unit-testable". UI tasks are build-then-verify-in-browser, per the CLAUDE.md "build fast" constraint (Monday event). Each UI task ends with a manual verification step against the dev server.

**Prerequisite (user-provided):** Supabase project exists. User supplies `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The migration SQL (Task 4) is run by the user in the Supabase SQL editor, and Realtime + Storage buckets are enabled per Task 5.

---

## File Structure

**Config / root**
- `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `.env.local`, `.gitignore`
- `src/main.tsx` — app entry, router
- `src/App.tsx` — route definitions + nav shell
- `src/styles/globals.css` — Tailwind directives + custom keyframes/fonts

**Lib (no React)**
- `src/lib/supabase.ts` — supabase client singleton
- `src/lib/constants.ts` — access codes, hole order helper re-exports, static UI maps
- `src/lib/scoring.ts` — pure scoring functions (TDD)
- `src/lib/types.ts` — shared TS types (Pair, Hole, HoleScore, Round, etc.)
- `src/lib/scoring.test.ts` — Vitest unit tests

**Hooks**
- `src/hooks/usePairs.ts` — fetch pairs (static-ish)
- `src/hooks/useHoles.ts` — fetch/edit holes (par, maps)
- `src/hooks/useLeaderboard.ts` — leaderboard rows + Realtime on `rounds`
- `src/hooks/useRoundScores.ts` — per-round hole_scores fetch/upsert/submit + Realtime
- `src/hooks/useSpecials.ts` — NTP, BirdieCup, special_winners + Realtime

**Components**
- `src/components/ui/` — `Button.tsx`, `Badge.tsx`, `Modal.tsx`, `Spinner.tsx`, `Avatar.tsx`, `NavBar.tsx`
- `src/components/leaderboard/` — `MainTable.tsx`, `PodiumRow.tsx`, `SpecialCards.tsx`, `Hero.tsx`
- `src/components/live/` — `RoundTable.tsx`, `HoleHeader.tsx`, `HoleModal.tsx`, `RoundSelector.tsx`
- `src/components/entry/` — `CodeGate.tsx`, `ScoreTable.tsx`, `StrokeStepper.tsx`, `NearestPinForm.tsx`
- `src/components/admin/` — `PhotoUpload.tsx`, `MapUpload.tsx`, `ParEditor.tsx`, `WinnerSelect.tsx`, `ScoreManager.tsx`

**Pages**
- `src/pages/Leaderboard.tsx`, `src/pages/LiveRound.tsx`, `src/pages/ScoreEntry.tsx`, `src/pages/Admin.tsx`

**Supabase**
- `supabase/migrations/001_initial_schema.sql` — schema + seed (from DATABASE.md)

---

## Task 1: Scaffold Vite + React + TS project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.gitignore`

- [ ] **Step 1: Scaffold with Vite**

Run: `npm create vite@latest . -- --template react-ts` (accept overwrite into current dir; keep existing .md files). If prompted about non-empty dir, choose "Ignore files and continue".

- [ ] **Step 2: Install deps**

Run:
```bash
npm install react-router-dom @supabase/supabase-js lucide-react
npm install -D tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 3: Verify dev server boots**

Run: `npm run dev` then open the printed URL.
Expected: default Vite React page renders, no console errors. Stop the server.

- [ ] **Step 4: Add Vitest config to `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
})
```

Create `src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
```

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 5: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Vite React TS project"
```

---

## Task 2: Tailwind config with golf palette

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/styles/globals.css` (create), `src/main.tsx`, `index.html`

- [ ] **Step 1: Init Tailwind**

Run: `npx tailwindcss init -p`

- [ ] **Step 2: Write `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#F0FAF3', 100: '#D8F3DC', 400: '#74C69D',
          600: '#40916C', 700: '#2D6A4F', 800: '#1B4332', 900: '#0D2B1D',
        },
        cream: '#F8FAF5',
        gold: { DEFAULT: '#C9A84C', light: '#F0D98A' },
        silver: '#A8B5A0',
        bronze: '#C17F3A',
        birdie: '#2D9E5A', bogey: '#E8A050', double: '#D4604A',
        error: '#C0392B', success: '#27AE60',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Create `src/styles/globals.css`**

Tailwind directives + the 4 keyframes from DESIGN.md (`slideInRow`, `goldPulse`, `borderPulse`, `shake`) and utility classes `.leaderboard-row`, `.rank-1`, `.btn-submit-active`, `.shake`, `.bg-golf-pattern`. Set `body { @apply bg-cream text-gray-900 font-sans; }` (use literal `#1C2B1A` for text since gray-900 custom not in palette — add `gray` scale to config or use arbitrary value `text-[#1C2B1A]`).

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-cream text-[#1C2B1A] font-sans antialiased; }
  h1, h2, h3 { @apply font-serif; }
}

@keyframes slideInRow { from { opacity:0; transform:translateX(-16px);} to {opacity:1; transform:translateX(0);} }
@keyframes goldPulse { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0);} 50%{box-shadow:0 0 16px 4px rgba(201,168,76,0.3);} }
@keyframes borderPulse { 0%,100%{box-shadow:0 0 0 0 rgba(27,67,50,0);} 50%{box-shadow:0 0 0 4px rgba(27,67,50,0.3);} }
@keyframes shake { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-6px);} 40%,80%{transform:translateX(6px);} }
.leaderboard-row { animation: slideInRow .3s ease forwards; }
.rank-1 { animation: goldPulse 2s ease-in-out infinite; }
.btn-submit-active { animation: borderPulse 1.5s ease-in-out infinite; }
.shake { animation: shake .4s ease; }
.bg-golf-pattern { background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%231B4332' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E"); }
```

- [ ] **Step 4: Import CSS + fonts**

In `src/main.tsx` replace default css import with `import './styles/globals.css'`. In `index.html` `<head>` add the Google Fonts links (Playfair Display 400;600;700 + Inter 400;500;600) from DESIGN.md and set `<title>Marathonazza</title>`.

- [ ] **Step 5: Verify Tailwind applies**

Temporarily set `App.tsx` body to `<h1 className="text-4xl font-serif text-green-800">Marathonazza</h1>`. Run `npm run dev`, confirm Playfair green heading. Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: tailwind config with golf palette and fonts"
```

---

## Task 3: Shared types + Supabase client + constants

**Files:**
- Create: `src/lib/types.ts`, `src/lib/supabase.ts`, `src/lib/constants.ts`, `.env.local`, `.env.example`

- [ ] **Step 1: `.env.local` + `.env.example`**

`.env.local` (user fills real values; ensure `.env.local` is gitignored — Vite scaffold already ignores it):
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```
`.env.example` mirrors keys with placeholder values (committed).

- [ ] **Step 2: `src/lib/types.ts`**

```ts
export interface Pair {
  id: string
  name: string
  player1_name: string
  player2_name: string
  handicap: number
  starting_hole: number
  access_code: string
  photo_url: string | null
  display_order: number | null
}
export interface Hole { hole_number: number; par: number | null; map_image_url: string | null }
export interface HoleScore {
  id: string; pair_id: string; round_number: number; hole_number: number; strokes: number | null
}
export interface Round {
  id: string; pair_id: string; round_number: number; is_submitted: boolean
  raw_strokes: number | null; net_strokes: number | null; submitted_at: string | null
}
export interface NearestToPin {
  id: string; player_name: string; pair_id: string; round_number: number; distance_cm: number
}
export type CompetitionType = 'closest_to_line' | 'drive_in_contest'
export interface SpecialWinner { id: string; competition_type: CompetitionType; winning_pair_id: string | null }
```

- [ ] **Step 3: `src/lib/supabase.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string
if (!url || !key) console.error('Missing Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)')

export const supabase = createClient(url, key)
```

- [ ] **Step 4: `src/lib/constants.ts`**

```ts
export const ACCESS_CODES = ['BUCA1','BUCA2','BUCA3','BUCA4','BUCA5','BUCA6','BUCA7'] as const
export const ROUNDS = [1, 2, 3, 4, 5] as const
export const HOLES = [1,2,3,4,5,6,7,8,9] as const
export const TOTAL_ROUNDS = 5

export const SPECIAL_HOLES: Record<number, { key: string; label: string }> = {
  2: { key: 'ntp',  label: 'Nearest to the Pin' },
  7: { key: 'line', label: 'Closest to the Line' },
  8: { key: 'birdie', label: 'BirdieCup' },
  9: { key: 'drive', label: 'Drive in Contest' },
}
export function normalizeCode(input: string): string { return input.trim().toUpperCase() }
export function isValidCode(input: string): boolean {
  return (ACCESS_CODES as readonly string[]).includes(normalizeCode(input))
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: types, supabase client, constants"
```

---

## Task 4: Database migration file

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Write the full migration**

Copy verbatim from DATABASE.md: the 6 `CREATE TABLE` statements (`pairs`, `holes`, `hole_scores`, `rounds`, `nearest_to_pin`, `special_winners`), the holes seed (hole 8 par=3, rest NULL), all 14 pair INSERTs across the 7 BUCA groups, and the 2 `special_winners` placeholder rows. Wrap in a single file in that order (tables → holes seed → pairs seed → special_winners seed).

- [ ] **Step 2: Add Realtime publication statements at end of file**

```sql
-- Enable Realtime (idempotent-ish; ignore errors if already added)
ALTER PUBLICATION supabase_realtime ADD TABLE hole_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE rounds;
ALTER PUBLICATION supabase_realtime ADD TABLE nearest_to_pin;
ALTER PUBLICATION supabase_realtime ADD TABLE special_winners;
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: initial Supabase schema + seed migration"
```

---

## Task 5: Run migration + configure Supabase (USER-ASSISTED, manual)

**Files:** none (Supabase dashboard work). Agent provides instructions; user executes and confirms.

- [ ] **Step 1:** User pastes `supabase/migrations/001_initial_schema.sql` into Supabase SQL Editor and runs it. Confirm 14 rows in `pairs`, 9 in `holes`.
- [ ] **Step 2:** User creates Storage buckets `pair-photos` (public) and `hole-maps` (public).
- [ ] **Step 3:** User confirms Realtime is enabled for the 4 tables (the ALTER PUBLICATION ran, or toggle in Database → Replication).
- [ ] **Step 4:** User pastes real `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` into `.env.local`.
- [ ] **Step 5: Verify connection**

Temporary check: add a throwaway button/log in App that runs `supabase.from('pairs').select('count')` and logs result. Run `npm run dev`, confirm count = 14 in console. Remove the throwaway code after.

---

## Task 6: Scoring logic (TDD)

**Files:**
- Create: `src/lib/scoring.ts`, `src/lib/scoring.test.ts`

- [ ] **Step 1: Write failing tests**

`src/lib/scoring.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { getHoleOrder, calcNetScore, isRoundComplete, scoreLabel, sumStrokes, isBirdieHole8 } from './scoring'

describe('getHoleOrder', () => {
  it('wraps from starting hole 3', () => {
    expect(getHoleOrder(3)).toEqual([3,4,5,6,7,8,9,1,2])
  })
  it('returns 1..9 for starting hole 1', () => {
    expect(getHoleOrder(1)).toEqual([1,2,3,4,5,6,7,8,9])
  })
  it('wraps from starting hole 7', () => {
    expect(getHoleOrder(7)).toEqual([7,8,9,1,2,3,4,5,6])
  })
})

describe('calcNetScore', () => {
  it('subtracts handicap once', () => {
    expect(calcNetScore(40, 8)).toBe(32)
  })
})

describe('sumStrokes', () => {
  it('sums entered holes, ignoring nulls', () => {
    expect(sumStrokes({ 1: 4, 2: 3, 3: null })).toBe(7)
  })
})

describe('isRoundComplete', () => {
  it('false when a hole is missing', () => {
    const s: Record<number, number|null> = { 1:4,2:3,3:4,4:5,5:4,6:3,7:4,8:2,9:null }
    expect(isRoundComplete(s)).toBe(false)
  })
  it('true when all 9 filled and > 0', () => {
    const s: Record<number, number|null> = { 1:4,2:3,3:4,4:5,5:4,6:3,7:4,8:2,9:4 }
    expect(isRoundComplete(s)).toBe(true)
  })
})

describe('scoreLabel', () => {
  it('returns raw strokes when par null', () => { expect(scoreLabel(4, null)).toBe('4') })
  it('Birdie at -1', () => { expect(scoreLabel(2, 3)).toBe('Birdie') })
  it('Par at 0', () => { expect(scoreLabel(3, 3)).toBe('Par') })
  it('Eagle at -2', () => { expect(scoreLabel(2, 4)).toBe('Eagle') })
  it('+3 over', () => { expect(scoreLabel(7, 4)).toBe('+3') })
})

describe('isBirdieHole8', () => {
  it('true only for hole 8 with 2 strokes', () => {
    expect(isBirdieHole8(8, 2)).toBe(true)
    expect(isBirdieHole8(8, 3)).toBe(false)
    expect(isBirdieHole8(7, 2)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests, verify they FAIL**

Run: `npm test`
Expected: FAIL — module `./scoring` has no exports yet.

- [ ] **Step 3: Implement `src/lib/scoring.ts`**

```ts
export function getHoleOrder(startingHole: number): number[] {
  const order: number[] = []
  for (let i = 0; i < 9; i++) order.push(((startingHole - 1 + i) % 9) + 1)
  return order
}

export function calcNetScore(rawStrokes: number, handicap: number): number {
  return rawStrokes - handicap
}

export function sumStrokes(scores: Record<number, number | null>): number {
  return Object.values(scores).reduce<number>((a, v) => a + (v ?? 0), 0)
}

export function isRoundComplete(scores: Record<number, number | null>): boolean {
  return Array.from({ length: 9 }, (_, i) => i + 1).every(h => scores[h] != null && scores[h]! > 0)
}

export function scoreLabel(strokes: number, par: number | null): string {
  if (!par) return String(strokes)
  const diff = strokes - par
  if (diff <= -2) return 'Eagle'
  if (diff === -1) return 'Birdie'
  if (diff === 0) return 'Par'
  if (diff === 1) return 'Bogey'
  if (diff === 2) return 'Double'
  return `+${diff}`
}

export function isBirdieHole8(holeNumber: number, strokes: number | null): boolean {
  return holeNumber === 8 && strokes === 2
}
```

- [ ] **Step 4: Run tests, verify they PASS**

Run: `npm test`
Expected: PASS (all suites green).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: scoring logic with unit tests"
```

---

## Task 7: UI primitives + NavBar + routing shell

**Files:**
- Create: `src/components/ui/Button.tsx`, `Badge.tsx`, `Modal.tsx`, `Spinner.tsx`, `Avatar.tsx`, `NavBar.tsx`
- Modify: `src/App.tsx`, `src/main.tsx`

- [ ] **Step 1: Build UI primitives**

`Button.tsx`: variant prop (`primary` green-800, `ghost`, `gold`), size, disabled styles, full-width option, 52px height default. `Badge.tsx`: pill, color prop, used for "⛳ in corso". `Spinner.tsx`: simple SVG spinner green-600. `Modal.tsx`: fixed overlay `rgba(13,43,29,0.6)`, centered card rounded-2xl, close on backdrop/Esc, children. `Avatar.tsx`: props `{ name, photoUrl, size }` — circular img with 2px white border + shadow; fallback to initials (first letters of player1/player2 or name words) on green-700 bg, white text; optional `ring` prop for podium gold/silver/bronze border.

- [ ] **Step 2: Build `NavBar.tsx`**

Top bar: logo (`/logo.png`, fallback wordmark "Marathonazza" Playfair) left; links "Classifica" `/`, "Live" `/live`, "Inserisci Colpi" `/enter`, "Admin" `/admin` using `NavLink` with active style (gold underline / green-800 text). Mobile: bottom fixed tab bar with the 4 links + lucide icons (`Trophy`, `Activity`, `PenLine`, `Settings`).

- [ ] **Step 3: Wire router in `App.tsx`**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/ui/NavBar'
import Leaderboard from './pages/Leaderboard'
import LiveRound from './pages/LiveRound'
import ScoreEntry from './pages/ScoreEntry'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="mx-auto max-w-[1280px] px-6 md:px-12 pb-24">
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/live" element={<LiveRound />} />
          <Route path="/enter" element={<ScoreEntry />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
```

Create the 4 page files as stubs (`export default function X(){ return <div>X</div> }`) so imports resolve.

- [ ] **Step 4: Verify navigation**

Run `npm run dev`. Click all 4 nav links, confirm each stub renders and active link highlights. Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: UI primitives, NavBar, router shell"
```

---

## Task 8: Data hooks

**Files:**
- Create: `src/hooks/usePairs.ts`, `useHoles.ts`, `useLeaderboard.ts`, `useRoundScores.ts`, `useSpecials.ts`

- [ ] **Step 1: `usePairs.ts`**

Fetch all pairs ordered by `display_order`. Returns `{ pairs, loading, error, refetch }`. Also export `usePairsByCode(code)` deriving the 2 pairs whose `access_code === normalizeCode(code)`.

- [ ] **Step 2: `useHoles.ts`**

Fetch all 9 holes ordered by `hole_number`. Returns `{ holes, loading, parByHole (Record<number, number|null>), updatePar(holeNumber, par), updateMap(holeNumber, url), refetch }`. `updatePar` upserts `holes.par`; `updateMap` sets `map_image_url`.

- [ ] **Step 3: `useLeaderboard.ts`**

Fetch pairs + their `rounds`, compute per-pair `{ rounds: {1..5: net|null}, totalNet, hasInProgress }`. `totalNet` = sum of `net_strokes` where `is_submitted`. `hasInProgress` = exists a `hole_scores` row for pair in a round with no submitted `rounds` row (or a `rounds` row with `is_submitted=false`). Sort ascending by `totalNet`, tiebreak `display_order`. Subscribe to Realtime on `rounds` (and `hole_scores` for in-progress badge) → refetch on change. Returns `{ rows, loading }`. Cleanup channel on unmount.

- [ ] **Step 4: `useRoundScores.ts`**

Params: `pairIds: string[]`, `roundNumber`. Fetch `hole_scores` for those pairs+round into `Record<pairId, Record<hole, strokes|null>>`. Fetch `rounds` submit status per pair. Expose:
- `setStroke(pairId, hole, strokes)` → upsert `hole_scores` (onConflict `pair_id,round_number,hole_number`).
- `submitRound(pairId, handicap)` → compute raw=sumStrokes, net=calcNetScore; upsert `rounds` row `is_submitted=true, raw_strokes, net_strokes, submitted_at=now()`.
- `isSubmitted(pairId)`, `scores`, `loading`.
Subscribe to Realtime on `hole_scores` filtered to round (refetch on change) so the other pair's edits appear. Cleanup on unmount.

- [ ] **Step 5: `useSpecials.ts`**

Provides:
- `ntpLeader` — lowest `distance_cm` from `nearest_to_pin` joined to pair.
- `ntpEntries(pairIds?)` — list, optionally filtered to a group.
- `addNtp(player_name, pair_id, round_number, distance_cm)`.
- `birdieStandings` — top 3 pairs by count of `hole_scores` where hole=8 & strokes=2 (compute client-side from a fetch, or RPC; client-side fetch is fine for this scale).
- `birdieCountForPair(pairId)`.
- `winners` — map of `competition_type → winning_pair_id`; `setWinner(type, pairId)` upserts `special_winners` (onConflict `competition_type`).
Subscribe Realtime to `nearest_to_pin`, `special_winners`, `hole_scores` (for birdies) → refetch.

- [ ] **Step 6: Verify hooks compile + fetch**

Run `npm run dev`. Temporarily render counts from each hook in the Leaderboard stub (e.g. `pairs.length`, `holes.length`). Confirm 14 / 9 and no console errors. Remove temp output.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: data hooks with Realtime subscriptions"
```

---

## Task 9: Page 4 — Admin (`/admin`)

**Files:**
- Create: `src/components/admin/PhotoUpload.tsx`, `MapUpload.tsx`, `ParEditor.tsx`, `WinnerSelect.tsx`, `ScoreManager.tsx`
- Modify: `src/pages/Admin.tsx`

Built first per CLAUDE.md dev order (photos/maps/par needed before event).

- [ ] **Step 1: `PhotoUpload.tsx` + Section 1**

Grid of 14 pairs (from `usePairs`). Each card: Avatar, name, "Carica foto" file input (accept jpg/png/webp, max 2MB — validate size, show error if exceeded). On select: upload to `pair-photos` bucket as `${pair.id}.${ext}` (upsert true), get public URL, update `pairs.photo_url`, optimistic preview.

- [ ] **Step 2: `MapUpload.tsx` + Section 2**

Grid of holes 1–9 (from `useHoles`). Each: hole number, current map thumb or placeholder, "Carica mappa" (jpg/png, max 5MB). Upload to `hole-maps` as `${hole_number}.${ext}`, update `holes.map_image_url`.

- [ ] **Step 3: `ParEditor.tsx` + Section 3**

Table holes 1–9 with number input (3–6) bound to `parByHole`. "Salva tutti" calls `updatePar` for each changed hole. Show saved toast/checkmark.

- [ ] **Step 4: `WinnerSelect.tsx` + Section 4**

Two blocks: Closest to the Line, Drive in Contest. Each: dropdown of 14 pair names + "Imposta vincitore" → `setWinner(type, pairId)`. Show current winner name.

- [ ] **Step 5: `ScoreManager.tsx` + Section 5**

Table of all submitted `rounds` (join pair name): pair, round, raw, net, "Sblocca" button → confirm dialog (Modal) → set `rounds.is_submitted=false`. Refetch after.

- [ ] **Step 6: Assemble `Admin.tsx`**

Page heading "Pannello Admin" (Playfair), 5 sections stacked with gold dividers between.

- [ ] **Step 7: Verify**

Run dev. Upload a test photo to one pair (confirm it appears + persists on refresh from Storage URL). Set all 9 pars and save (confirm persisted). Set a Closest-to-Line winner. Stop server.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: Admin page (photos, maps, par, winners, score unlock)"
```

---

## Task 10: Page 3 — Score Entry (`/enter`)

**Files:**
- Create: `src/components/entry/CodeGate.tsx`, `StrokeStepper.tsx`, `ScoreTable.tsx`, `NearestPinForm.tsx`
- Modify: `src/pages/ScoreEntry.tsx`

Core game functionality. Mobile-critical.

- [ ] **Step 1: `CodeGate.tsx`**

Centered screen, logo, "Inserisci il codice del tuo gruppo", large text input + "Accedi". On submit: `isValidCode` → store `normalizeCode` in `sessionStorage['mz_code']` and call `onUnlock(code)`. Invalid → add `.shake` class for 400ms + "Codice non valido" in error red. 16px+ input to avoid iOS zoom.

- [ ] **Step 2: `StrokeStepper.tsx`**

Props `{ value: number|null, onChange, min=1, max=15 }`. Layout `[−] value [+]`, 52px min-height, buttons 44×44px, number 24px bold. Green-100 bg when filled. Disable − at min, + at max. `null` shows em-dash placeholder; first tap on + sets to min.

- [ ] **Step 3: `ScoreTable.tsx`**

Props `{ pair, roundNumber, parByHole, scores, onSetStroke, onSubmit, submitted, birdieCount, submittedRoundsCount }`.
- Title: Avatar (56px) + "player1 / player2", "HCP: N".
- If `submitted`: render "✅ Giro N confermato" card instead of inputs.
- Else: rows in `getHoleOrder(pair.starting_hole)` order. Columns Buca | Colpi (StrokeStepper) | Par | +/- (`scoreLabel`, "B" shorthand for Birdie). Hole 8 row gold/green tint.
- Footer running totals: `Lordo: X | Netto: X − HCP = Y` using `sumStrokes`/`calcNetScore`.
- "Conferma giro" button: disabled until `isRoundComplete(scores)`; active → `.btn-submit-active` pulse, green-800. On click → confirmation Modal "Confermi i colpi del Giro N per [Coppia]? Questa azione può essere modificata dall'admin." → `onSubmit`. On mobile, button fixed at bottom.
- BirdieCup counter line below: "🐦 BirdieCup: X birdie alla buca 8 (su N giri confermati)".

- [ ] **Step 4: `NearestPinForm.tsx`**

Card "📍 Nearest to the Pin — Buca 2". Fields: Giocatore dropdown (4 players from the 2 group pairs), Distanza cm (number, min 1), Giro dropdown (1–5), "Invia misura" → `addNtp`. Below: list of this group's submissions (from `ntpEntries(groupPairIds)`).

- [ ] **Step 5: Assemble `ScoreEntry.tsx`**

Read `sessionStorage['mz_code']`; if absent show `CodeGate`. Once unlocked: header (logo, segmented round selector G1–G5, "Gruppo Buca N"). Use `usePairsByCode(code)` → 2 pairs; `useRoundScores(pairIds, round)`. Render 2 `ScoreTable`, then `NearestPinForm`. Round selector switches the active round.

- [ ] **Step 6: Verify (two-window Realtime test)**

Run dev. Open `/enter`, enter `BUCA7`. Enter 9 strokes for one pair (include a 2 at hole 8). Confirm "Conferma giro" enables only at 9/9; submit via dialog; row flips to "✅". Open a second browser window on the same group → confirm the other pair's live strokes appear (Realtime). Submit an NTP measure. Stop server.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: Score Entry page (code gate, steppers, submit, NTP)"
```

---

## Task 11: Page 2 — Live Round (`/live`)

**Files:**
- Create: `src/components/live/RoundSelector.tsx`, `HoleHeader.tsx`, `RoundTable.tsx`, `HoleModal.tsx`
- Modify: `src/pages/LiveRound.tsx`

Read-only real-time table.

- [ ] **Step 1: `RoundSelector.tsx`**

Segmented control "Giro 1"–"Giro 5". Controlled via prop + onChange. Default round = 1 (or round with most recent activity if easily available; round 1 acceptable).

- [ ] **Step 2: `HoleHeader.tsx`**

Per hole column header: big hole number, small "Par N" (from parByHole), special icon for holes 2/7/8/9 (lucide `Flag`/`Target`/bird-SVG/`Ruler`), hole 8 header gold gradient. Clickable → opens HoleModal.

- [ ] **Step 3: `RoundTable.tsx`**

Rows = 14 pairs sorted by `starting_hole` then `display_order`. Columns Pair Name | Buca 1..9 | Totale grezzo. Cells from `useRoundScores(allPairIds, round)` scores. Color coding via helper: birdie hole8(=2) → green-100 bold green-800; under par → `#E8F5E9`; par → white; over par → `#FFF3E0`; double+ → `#FDECEA`; empty → gray "—". Total column = `sumStrokes` of entered (raw, no handicap). Sticky header row on vertical scroll. Horizontal scroll on mobile.

- [ ] **Step 4: `HoleModal.tsx`**

Opens on header click. Shows hole number, par, special competition info (if 2/7/8/9), hole map image from `holes.map_image_url` or placeholder. ("Chi sta giocando" SUSPENDED — do not implement.)

- [ ] **Step 5: Par edit affordance**

Small "✏️ Edit par" control in table header/footer → inline number input → `updatePar` (no auth). Reuse `useHoles`.

- [ ] **Step 6: Assemble `LiveRound.tsx`**

RoundSelector + RoundTable; manage selected hole for modal. Realtime already handled by `useRoundScores` → cells update as strokes entered elsewhere.

- [ ] **Step 7: Verify**

Run dev in two windows: one on `/enter` (BUCA7) entering strokes, one on `/live` same round → confirm cells update live with correct color coding (hole-8 birdie green). Open a hole header modal, confirm par + map placeholder. Stop server.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: Live Round page (real-time table, hole modal, par edit)"
```

---

## Task 12: Page 1 — Leaderboard (`/`)

**Files:**
- Create: `src/components/leaderboard/Hero.tsx`, `MainTable.tsx`, `PodiumRow.tsx`, `SpecialCards.tsx`
- Modify: `src/pages/Leaderboard.tsx`

- [ ] **Step 1: `Hero.tsx`**

Full-viewport hero. `<video autoPlay muted loop playsInline>` src `https://www.pexels.com/video/download/3770234/`; on error fallback to gradient `linear-gradient(135deg,#0D2B1D,#2D6A4F)`. Dark green overlay gradient. Logo top. Headline "Benvenuto alla Marathonazza" (Playfair, white, gold underline 60% centered). Subtitle: current date (it-IT) + round indicator (e.g. "Giro 3 di 5 in corso" — derive current round = max round with any activity, else 1). Down-arrow scroll indicator scrolling to table.

- [ ] **Step 2: `PodiumRow.tsx` + `MainTable.tsx`**

`MainTable`: header Position | Pair | R1..R5 | HCP | Totale Netto. Rows from `useLeaderboard`. Each row staggered `.leaderboard-row` entrance. R columns show net or "—". "Totale Netto" bold. "⛳ in corso" Badge when `hasInProgress`. `PodiumRow` styling for ranks 1–3: gold gradient + animated `Crown` + `.rank-1` glow (1st), silver (2nd), bronze (3rd), left border in podium color; Avatar with matching ring. Avatar 40px + "Nome1 / Nome2".

- [ ] **Step 3: `SpecialCards.tsx`**

2×2 grid (horizontal scroll on mobile), 4 cards from `useSpecials`:
1. NTP 📍 — `ntpLeader` photo+name+`distance_cm` cm, subtitle from REQUIREMENTS.
2. BirdieCup 🐦 — `birdieStandings` top 3 with counts ("N birdie"), gold header stripe, hide 0-birdie.
3. Closest to the Line ⊕ — winner name or "Da assegnare" + dropdown (`setWinner('closest_to_line', …)`) with confirm.
4. Drive in Contest 📏 — same pattern, `drive_in_contest`, "(Solo giro 5)" note.

- [ ] **Step 4: Assemble `Leaderboard.tsx`**

`<Hero />` then `<MainTable />` then gold divider then `<SpecialCards />`. Realtime via `useLeaderboard`/`useSpecials`.

- [ ] **Step 5: Verify**

Run dev. With a submitted round (from earlier tests) confirm pair appears with net + sorted position, podium styling on top 3, "in corso" badge on a pair mid-round, NTP + BirdieCup cards populated. Submit another round in a second window → leaderboard updates live without refresh. Stop server.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: Leaderboard page (hero, podium table, special cards)"
```

---

## Task 13: Mobile responsiveness + design polish pass

**Files:** touch any component needing responsive fixes; `src/styles/globals.css`.

- [ ] **Step 1: Mobile audit**

Run dev, use browser devtools at 375px width. Walk all 4 pages. Fix: Score Entry single-column + fixed bottom "Conferma giro"; tables horizontal-scroll; tap targets ≥44px; inputs ≥16px; NavBar bottom tab bar on mobile. Verify against DESIGN.md breakpoints.

- [ ] **Step 2: Polish**

Confirm entrance/crown/glow/shake animations fire. Card shadows, gold dividers, avatar fallbacks, sticky live header, hover states. Check contrast for outdoor readability.

- [ ] **Step 3: Add `public/logo.png` fallback handling**

Ensure missing-logo path degrades to Playfair wordmark everywhere it's used (Hero, NavBar, CodeGate). (User adds real `public/logo.png` manually.)

- [ ] **Step 4: Verify build**

Run: `npm run build` then `npm run preview`. Confirm production build succeeds with no type errors and pages render.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "polish: mobile responsiveness and design pass"
```

---

## Task 14: Deploy prep (Vercel)

**Files:** Create `vercel.json` (SPA rewrite).

- [ ] **Step 1: SPA rewrite**

`vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

- [ ] **Step 2: Deploy instructions (user)**

User imports repo in Vercel, sets `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` env vars, deploys. Confirm all 4 routes work on the deployed URL (SPA rewrite handles deep links).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: Vercel SPA config"
```

---

## Self-Review Notes

- **Spec coverage:** All 4 pages (Tasks 9–12), all 4 special competitions (NTP auto, BirdieCup auto, Closest-to-Line manual, Drive manual — Tasks 9/10/12), scoring rules (Task 6), shotgun hole order (Task 6 + ScoreTable), access codes (Task 3 + CodeGate), round submit/lock + admin unlock (Tasks 10/9), Realtime on all 3 pages (Task 8 hooks), Storage uploads (Task 9), par editing in admin + live (Tasks 9/11), mobile (Task 13). Covered.
- **Type consistency:** Function names fixed across tasks — `getHoleOrder`, `calcNetScore`, `sumStrokes`, `isRoundComplete`, `scoreLabel`, `isBirdieHole8`; hook methods `setStroke`/`submitRound`/`updatePar`/`updateMap`/`addNtp`/`setWinner`. Types from `src/lib/types.ts`.
- **Known deferred / assumptions:** Pexels video URL may hotlink-block → gradient fallback required (Task 12 Step 1). "Current round" indicator derived from activity, simple heuristic. BirdieCup computed client-side (fine at this scale). "Chi sta giocando" intentionally not implemented.
