-- Marathonazza — migration 002
-- Adds staffettisti (substitutes), person-based special winners,
-- and allows Nearest-to-the-Pin entries without a pair.

-- Substitutes / staffettisti (access via BUCA10, NTP entry only)
CREATE TABLE IF NOT EXISTS substitutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  access_code TEXT NOT NULL DEFAULT 'BUCA10',
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO substitutes (name, display_order) VALUES
('Alberto Bellè', 1),
('Massimo Osti', 2),
('Mirko Sech', 3)
ON CONFLICT DO NOTHING;

-- Nearest to the Pin: substitutes have no pair, so pair_id becomes optional
ALTER TABLE nearest_to_pin ALTER COLUMN pair_id DROP NOT NULL;

-- Closest to the Line + Driving contest winners are single people, by name
ALTER TABLE special_winners ADD COLUMN IF NOT EXISTS winner_name TEXT;

-- grants for the new table (RLS off, private event)
GRANT ALL ON substitutes TO anon, authenticated;
