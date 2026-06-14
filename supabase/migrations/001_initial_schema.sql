-- Marathonazza — Initial schema + seed
-- Run in Supabase SQL Editor. RLS disabled (private event, no auth).

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  handicap INTEGER NOT NULL,
  starting_hole INTEGER NOT NULL CHECK (starting_hole BETWEEN 1 AND 7),
  access_code TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS holes (
  hole_number INTEGER PRIMARY KEY CHECK (hole_number BETWEEN 1 AND 9),
  par INTEGER CHECK (par BETWEEN 3 AND 6),
  map_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hole_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 5),
  hole_number INTEGER NOT NULL CHECK (hole_number BETWEEN 1 AND 9),
  strokes INTEGER CHECK (strokes BETWEEN 1 AND 20),
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (pair_id, round_number, hole_number)
);

CREATE TABLE IF NOT EXISTS rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 5),
  is_submitted BOOLEAN NOT NULL DEFAULT FALSE,
  raw_strokes INTEGER,
  net_strokes INTEGER,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (pair_id, round_number)
);

CREATE TABLE IF NOT EXISTS nearest_to_pin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name TEXT NOT NULL,
  pair_id UUID NOT NULL REFERENCES pairs(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 5),
  distance_cm INTEGER NOT NULL CHECK (distance_cm > 0),
  entered_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS special_winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_type TEXT NOT NULL CHECK (competition_type IN ('closest_to_line', 'drive_in_contest')),
  winning_pair_id UUID REFERENCES pairs(id) ON DELETE SET NULL,
  set_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (competition_type)
);

-- ============================================================
-- SEED: holes (par NULL until admin sets; hole 8 fixed par 3)
-- ============================================================

INSERT INTO holes (hole_number, par) VALUES
  (1, NULL), (2, NULL), (3, NULL), (4, NULL), (5, NULL),
  (6, NULL), (7, NULL), (8, 3), (9, NULL)
ON CONFLICT (hole_number) DO NOTHING;

-- ============================================================
-- SEED: 14 pairs across 7 tee groups
-- ============================================================

-- BUCA 1
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Villanova / Donadini', 'Luca Villanova', 'Marco Donadini', 8, 1, 'BUCA1', 1),
('Bristot / De Biasi', 'Alessandro Bristot', 'Gianluca De Biasi', 7, 1, 'BUCA1', 2);

-- BUCA 2
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Gotti / Lazzarini S.', 'Luca Gotti', 'Sandro Lazzarini', 9, 2, 'BUCA2', 3),
('Grassi / Lazzarini L.', 'Nadir Grassi', 'Luca Lazzarini', 6, 2, 'BUCA2', 4);

-- BUCA 3
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Cosner / Bosetto', 'Alberto Cosner', 'Paolo Bosetto', 6, 3, 'BUCA3', 5),
('Panzan / Coletto', 'Roberto Panzan', 'Laura Coletto', 7, 3, 'BUCA3', 6);

-- BUCA 4
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Prevarin / Lesimo', 'Luca Prevarin', 'Luca Lesimo', 8, 4, 'BUCA4', 7),
('Maione / Buzzatti', 'Riccardo Maione', 'Giacomo Buzzatti', 13, 4, 'BUCA4', 8);

-- BUCA 5
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Zanotto / Minoia', 'Riccardo Zanotto', 'Alberto Minoia', 13, 5, 'BUCA5', 9),
('De Luca / Toffolin', 'Stefano De Luca', 'Marco Toffolin', 13, 5, 'BUCA5', 10);

-- BUCA 6
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Talamini / Manfroi', 'Luca Talamini', 'Mauro Manfroi', 8, 6, 'BUCA6', 11),
('Zulian / Burigana', 'Francesco Zulian', 'Massimo Burigana', 4, 6, 'BUCA6', 12);

-- BUCA 7
INSERT INTO pairs (name, player1_name, player2_name, handicap, starting_hole, access_code, display_order) VALUES
('Manarin / Sandrin', 'Janos Manarin', 'Fabio Sandrin', 8, 7, 'BUCA7', 13),
('Zanatta / Garbuio', 'Sergio Zanatta', 'Mauro Garbuio', 8, 7, 'BUCA7', 14);

-- ============================================================
-- SEED: special winners placeholders
-- ============================================================

INSERT INTO special_winners (competition_type, winning_pair_id) VALUES
('closest_to_line', NULL),
('drive_in_contest', NULL)
ON CONFLICT (competition_type) DO NOTHING;

-- ============================================================
-- REALTIME: add tables to the supabase_realtime publication
-- (safe to ignore "already member" errors on re-run)
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE hole_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE rounds;
ALTER PUBLICATION supabase_realtime ADD TABLE nearest_to_pin;
ALTER PUBLICATION supabase_realtime ADD TABLE special_winners;
