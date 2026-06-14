# Marathonazza — Database Schema (Supabase)

## Overview

All data lives in Supabase PostgreSQL.
Realtime enabled on: `hole_scores`, `rounds`, `nearest_to_pin`, `special_winners`
Storage buckets: `pair-photos` (public), `hole-maps` (public)
RLS: disabled (private event, no auth)

---

## Tables

### `pairs`
Stores the 14 competing pairs with their group assignment and handicap.

```sql
CREATE TABLE pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- e.g. "Villanova / Donadini"
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  handicap INTEGER NOT NULL,
  starting_hole INTEGER NOT NULL CHECK (starting_hole BETWEEN 1 AND 7),
  access_code TEXT NOT NULL,             -- 'BUCA1' through 'BUCA7'
  photo_url TEXT,                        -- Supabase Storage URL
  display_order INTEGER,                 -- for consistent ordering in UI
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `holes`
The 9 holes — par and map image. Par starts as NULL, set from admin panel.

```sql
CREATE TABLE holes (
  hole_number INTEGER PRIMARY KEY CHECK (hole_number BETWEEN 1 AND 9),
  par INTEGER CHECK (par BETWEEN 3 AND 6),   -- NULL until set by admin
  map_image_url TEXT,                         -- Supabase Storage URL
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `hole_scores`
Individual hole stroke entries. One row per pair × round × hole.

```sql
CREATE TABLE hole_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 5),
  hole_number INTEGER NOT NULL CHECK (hole_number BETWEEN 1 AND 9),
  strokes INTEGER CHECK (strokes BETWEEN 1 AND 20),  -- NULL = not entered yet
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (pair_id, round_number, hole_number)
);
```

### `rounds`
Tracks round submission status. Created when a pair confirms a round.

```sql
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 5),
  is_submitted BOOLEAN NOT NULL DEFAULT FALSE,
  raw_strokes INTEGER,        -- sum of all 9 hole strokes
  net_strokes INTEGER,        -- raw_strokes - handicap
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (pair_id, round_number)
);
```

### `nearest_to_pin`
Entries for the Nearest to the Pin special competition (hole 2, first shot).

```sql
CREATE TABLE nearest_to_pin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 5),
  distance_cm INTEGER NOT NULL CHECK (distance_cm > 0),
  entered_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `special_winners`
Stores the manually-set winners for Closest to Line and Drive in Contest.

```sql
CREATE TABLE special_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_type TEXT NOT NULL CHECK (competition_type IN ('closest_to_line', 'drive_in_contest')),
  winning_pair_id UUID REFERENCES pairs(id) ON DELETE SET NULL,
  set_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (competition_type)   -- only one winner per competition
);
```

---

## Seed Data

### Holes (par = NULL until admin sets them)

```sql
INSERT INTO holes (hole_number, par) VALUES
  (1, NULL), (2, NULL), (3, NULL), (4, NULL), (5, NULL),
  (6, NULL), (7, NULL), (8, 3), (9, NULL);
-- Note: hole 8 par = 3 is confirmed (birdie = 2 strokes)
-- All other pars to be set by admin before the event
```

### Pairs (14 pairs in 7 tee groups)

```sql
-- BUCA 1 group
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Villanova / Donadini', 'Luca Villanova', 'Marco Donadini', 8, 1, 'BUCA1', 1),
('Bristot / De Biasi', 'Alessandro Bristot', 'Gianluca De Biasi', 7, 1, 'BUCA1', 2);

-- BUCA 2 group
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Gotti / Lazzarini S.', 'Luca Gotti', 'Sandro Lazzarini', 9, 2, 'BUCA2', 3),
('Grassi / Lazzarini L.', 'Nadir Grassi', 'Luca Lazzarini', 6, 2, 'BUCA2', 4);

-- BUCA 3 group
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Cosner / Bosetto', 'Alberto Cosner', 'Paolo Bosetto', 6, 3, 'BUCA3', 5),
('Panzan / Coletto', 'Roberto Panzan', 'Laura Coletto', 7, 3, 'BUCA3', 6);

-- BUCA 4 group
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Prevarin / Lesimo', 'Luca Prevarin', 'Luca Lesimo', 8, 4, 'BUCA4', 7),
('Maione / Buzzatti', 'Riccardo Maione', 'Giacomo Buzzatti', 13, 4, 'BUCA4', 8);

-- BUCA 5 group
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Zanotto / Minoia', 'Riccardo Zanotto', 'Alberto Minoia', 13, 5, 'BUCA5', 9),
('De Luca / Toffolin', 'Stefano De Luca', 'Marco Toffolin', 13, 5, 'BUCA5', 10);

-- BUCA 6 group
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Talamini / Manfroi', 'Luca Talamini', 'Mauro Manfroi', 8, 6, 'BUCA6', 11),
('Zulian / Burigana', 'Francesco Zulian', 'Massimo Burigana', 4, 6, 'BUCA6', 12);

-- BUCA 7 group
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Manarin / Sandrin', 'Janos Manarin', 'Fabio Sandrin', 8, 7, 'BUCA7', 13),
('Zanatta / Garbuio', 'Sergio Zanatta', 'Mauro Garbuio', 8, 7, 'BUCA7', 14);
```

### Special winners placeholders (empty, ready for admin input)

```sql
INSERT INTO special_winners (competition_type, winning_pair_id) VALUES
('closest_to_line', NULL),
('drive_in_contest', NULL);
```

---

## Key Queries

### Leaderboard (main)
```sql
SELECT
  p.id,
  p.name,
  p.player1_name,
  p.player2_name,
  p.handicap,
  p.photo_url,
  p.starting_hole,
  COALESCE(SUM(r.net_strokes) FILTER (WHERE r.is_submitted), 0) AS total_net,
  JSON_AGG(
    JSON_BUILD_OBJECT('round', r.round_number, 'net', r.net_strokes, 'submitted', r.is_submitted)
    ORDER BY r.round_number
  ) FILTER (WHERE r.round_number IS NOT NULL) AS rounds_detail
FROM pairs p
LEFT JOIN rounds r ON r.pair_id = p.id
GROUP BY p.id
ORDER BY total_net ASC, p.display_order ASC;
```

### BirdieCup standings
```sql
SELECT
  p.id,
  p.name,
  p.photo_url,
  COUNT(hs.id) AS birdie_count
FROM pairs p
LEFT JOIN hole_scores hs
  ON hs.pair_id = p.id
  AND hs.hole_number = 8
  AND hs.strokes = 2
GROUP BY p.id, p.name, p.photo_url
ORDER BY birdie_count DESC
LIMIT 3;
```

### Nearest to the Pin leader
```sql
SELECT
  n.player_name,
  n.distance_cm,
  n.round_number,
  p.name AS pair_name,
  p.photo_url
FROM nearest_to_pin n
JOIN pairs p ON p.id = n.pair_id
ORDER BY n.distance_cm ASC
LIMIT 1;
```

### Live round scores (for /live page)
```sql
SELECT
  p.name AS pair_name,
  p.starting_hole,
  p.display_order,
  hs.hole_number,
  hs.strokes
FROM pairs p
LEFT JOIN hole_scores hs
  ON hs.pair_id = p.id
  AND hs.round_number = $1   -- bind: selected round
ORDER BY p.display_order, hs.hole_number;
```

---

## Scoring Logic (implement in `src/lib/scoring.ts`)

```typescript
// Hole play order for a given starting hole (1-indexed)
export function getHoleOrder(startingHole: number): number[] {
  const order: number[] = [];
  for (let i = 0; i < 9; i++) {
    order.push(((startingHole - 1 + i) % 9) + 1);
  }
  return order;
}
// Example: getHoleOrder(3) → [3,4,5,6,7,8,9,1,2]

// Calculate net score for a round
export function calcNetScore(rawStrokes: number, handicap: number): number {
  return rawStrokes - handicap;
}

// Check if all holes are filled (ready to submit)
export function isRoundComplete(scores: Record<number, number | null>): boolean {
  return Array.from({length: 9}, (_, i) => i + 1).every(h => scores[h] != null && scores[h]! > 0);
}

// Score label relative to par
export function scoreLabel(strokes: number, par: number | null): string {
  if (!par) return String(strokes);
  const diff = strokes - par;
  if (diff <= -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double';
  return `+${diff}`;
}
```

---

## Supabase Storage Setup

```
Buckets:
  pair-photos   → public, max file size 2MB, allowed: image/*
  hole-maps     → public, max file size 5MB, allowed: image/*

URL pattern:
  https://<project>.supabase.co/storage/v1/object/public/pair-photos/<uuid>.<ext>
```

---

## Realtime Channels

```typescript
// Enable in Supabase dashboard: Database → Replication → enable for each table

// Leaderboard: listen for round submissions
supabase.channel('leaderboard')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'rounds' }, callback)
  .subscribe();

// Live round: listen for hole score entries
supabase.channel('live-round')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'hole_scores' }, callback)
  .subscribe();
```
