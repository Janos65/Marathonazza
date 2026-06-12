# Marathonazza — Detailed Requirements

## Page 1: Leaderboard (`/`)

### Hero Section
- Full-viewport-height hero with a **golf stock video** as background (use a free CDN-hosted golf video, e.g. from Pexels/Pixabay: `https://www.pexels.com/video/golf-player-playing-golf-on-a-course-3770234/` or similar embeddable CDN URL)
- Semi-transparent dark green overlay on video for readability
- Centered layout: Marathonazza logo (`public/logo.png`) displayed top-right or centered-top
- Main headline: `"Benvenuto alla Marathonazza"` in Playfair Display, large, white, with subtle gold underline accent
- Subtitle: current date + round indicator (e.g. "Giro 3 di 5 in corso")
- Smooth scroll indicator (arrow) pointing down to the leaderboard

### Main Leaderboard Table
- Shows all 14 pairs sorted by **total net score ascending** (best = least strokes)
- Updates in real-time via Supabase Realtime (when a round is submitted anywhere)
- Columns: Position | Pair (photo + name) | R1 | R2 | R3 | R4 | R5 | HCP | **Totale Netto**
- R1–R5 columns show the **net score** for that round (or `—` if not submitted yet)
- "Totale Netto" = sum of all submitted net rounds
- Pairs with an in-progress round show a small "⛳ in corso" badge in their row
- **Podium styling:**
  - 1st place: gold gradient row background, animated crown 👑 icon, bold name
  - 2nd place: silver gradient row
  - 3rd place: bronze gradient row
  - 1st place row has a subtle pulsing glow animation
- Pair photo: circular avatar (40px), fallback to initials if no photo uploaded
- Pair name displayed as "Nome1 / Nome2" format

### Special Competitions Section
Below the main table, 4 cards in a 2×2 grid (or horizontal scroll on mobile):

**Card 1 — Nearest to the Pin 📍 (Buca 2)**
- Shows current leader: photo + name + distance in cm
- If multiple entries: shows only the best (lowest cm)
- Subtitle: "Prima pallina alla buca 2 più vicina alla bandiera"

**Card 2 — BirdieCup 🐦 (Buca 8)**
- Top 3 pairs by birdie count at hole 8 (score of 2, par 3)
- Shows: rank, pair photo+name, birdie count (e.g. "3 birdie")
- Pairs with 0 birdies not shown
- Auto-calculated from `hole_scores` table (hole_number=8, strokes=2)
- Subtitle: "Birdie totali alla buca 8 (par 3)"

**Card 3 — Closest to the Line ⊕ (Buca 7)**
- Shows: winner pair photo + name, or "Da assegnare" if not set
- Dropdown to select winning pair (visible to everyone, no auth)
- On selection: show confirmation, then save to `special_winners`
- Subtitle: "Prima pallina più vicina alla linea di metà fairway, buca 7"

**Card 4 — Drive in Contest 📏 (Buca 9, Giro 5)**
- Same structure as Card 3
- Note: "(Solo giro 5)" subtitle
- Subtitle: "Drive più lungo alla buca 9 nell'ultimo giro"

---

## Page 2: Live Round (`/live`)

### Round Selector
- Tabs or segmented control at top: "Giro 1" → "Giro 5"
- Default: show the round with the most recent activity (or round 1)

### Main Scoring Table
- Rows: 14 pairs (sorted by starting hole, then pair within group)
- Columns: Pair Name | Buca 1 | Buca 2 | … | Buca 9 | Totale grezzo
- Cell value: strokes entered (or `—` if not yet entered)
- **Cell color coding:**
  - Hole 8, strokes = 2 (birdie): bright green `#40916C` with white text
  - Strokes < par (any hole): light green tint
  - Strokes = par: neutral/white
  - Strokes > par (bogey+): warm amber/red tint
  - Empty / not entered: gray `—`
- Total column: sum of entered strokes so far (partial, no handicap deducted here — this is raw data only)
- Table header sticky when scrolling vertically

### Hole Header Cells
Each hole column header shows:
- Hole number (large)
- Par value (small, e.g. "Par 4") — fetched from `holes` table
- Special icon for special holes:
  - Hole 2: 📍 pin flag icon (Nearest to the Pin)
  - Hole 7: ⊕ crosshair icon (Closest to the Line)
  - Hole 8: 🐦 bird icon (BirdieCup) — header styled in gold
  - Hole 9: 📏 ruler/distance icon (Drive in Contest)
- Click on header → opens HoleModal

### Hole Modal
- Opens on click of any hole header
- Shows: hole number, par, special competition info (if applicable)
- Shows hole map image if uploaded (from Supabase Storage), else placeholder
- Future: "Chi sta giocando" — SUSPENDED, do not implement now

### Par Edit (Admin-only feel, but open)
- Small "✏️ Edit par" button in table header or footer
- Opens inline input to set par for that hole
- Saves to `holes` table in Supabase
- Note: no auth required, this is an admin convenience feature

---

## Page 3: Score Entry (`/enter`)

### Code Gate Screen
- Clean centered screen with Marathonazza logo
- Prompt: "Inserisci il codice del tuo gruppo"
- Large text input + "Accedi" button
- Codes: `BUCA1` through `BUCA7` (case-insensitive)
- On valid code: smooth transition to score entry
- On invalid code: shake animation + "Codice non valido" error
- Code persists in sessionStorage so refresh doesn't log out

### Score Entry Main View (after code entry)
- **Header bar:**
  - Left: Marathonazza logo (small)
  - Right: Round selector — segmented control "G1 / G2 / G3 / G4 / G5"
  - Below header: group name (e.g. "Gruppo Buca 3")

- **Two score tables** (one per pair in the group):
  - Pair name as table title: "Nome1 / Nome2" with circular photo
  - Handicap shown: "HCP: 8"
  - Table columns: Buca | Colpi | Par | +/-
  - Holes displayed in correct starting order (e.g. starting hole 3: shows 3,4,5,6,7,8,9,1,2)
  - "Colpi" column: number input (stepper +/−) for each hole, min 1, max 15
  - "+/-" column: shows difference from par (e.g. "+1", "−1", "B" for birdie) — calculated live
  - Special hole rows highlighted: hole 8 row has gold/green tint
  - Running totals at bottom: "Lordo: X | Netto: X − HCP = Y"

- **"Conferma giro" button** (per pair):
  - Disabled / grayed until all 9 holes are filled
  - When active: green, pulsing gently
  - On click: confirmation dialog "Confermi i colpi del Giro N per [Coppia]? Questa azione può essere modificata dall'admin."
  - On confirm: saves to `rounds` and locks that pair+round
  - Already-submitted rounds show "✅ Giro N confermato" instead of the form
  - Player can switch to a different round to enter/view other rounds

- **BirdieCup counter** (per pair, shown below their table):
  - "🐦 BirdieCup: X birdie alla buca 8 (su N giri confermati)"
  - Updates live as rounds are submitted

### Nearest to the Pin Section
Below both pair tables, a separate card:

- Title: "📍 Nearest to the Pin — Buca 2"
- Description: "Inserisci la distanza dal primo colpo alla buca 2"
- Form fields:
  - Dropdown: "Giocatore" — lists all 4 players in the current group (player1 and player2 of both pairs)
  - Number input: "Distanza in cm" (integer, min 1)
  - Round selector: "Giro" (1–5 dropdown)
  - Submit button: "Invia misura"
- Can submit multiple entries (e.g. different rounds)
- After submit: shows confirmation + list of this group's past submissions
- The global minimum across all submissions determines the leaderboard winner

---

## Page 4: Admin Panel (`/admin`)

No authentication. Simple utility page for the organizer.

### Section 1 — Foto Profilo Coppie
- Grid of all 14 pairs
- Each pair shows: name, current photo (or placeholder avatar), "Carica foto" button
- Upload to Supabase Storage bucket `pair-photos`
- On upload: update `pairs.photo_url`, show preview immediately
- Accept: JPG, PNG, WebP — max 2MB per image

### Section 2 — Mappe Buche
- Grid of holes 1–9
- Each hole shows: number, current map image (or placeholder), "Carica mappa" button
- Upload to Supabase Storage bucket `hole-maps`
- On upload: update `holes.map_image_url`
- Accept: JPG, PNG — max 5MB per image

### Section 3 — Par delle Buche
- Simple table: hole 1–9, par input (number, 3–5 typically)
- "Salva par" button per hole or a global "Salva tutti" button
- Updates `holes.par` in Supabase

### Section 4 — Vincitori Gare Speciali
- **Closest to the Line (Buca 7):**
  - Dropdown of all 14 pair names
  - "Imposta vincitore" button
  - Shows current winner if set
- **Drive in Contest (Buca 9, Giro 5):**
  - Same structure

### Section 5 — Gestione Punteggi (Emergency Edit)
- Table showing all submitted rounds
- Each row: pair name, round number, raw strokes, net strokes, "Sblocca" button
- "Sblocca" sets `is_submitted = false`, allowing the pair to re-enter
- Confirmation required before unlocking

---

## Navigation

Simple top navigation bar on all pages:
- Links: "Classifica" | "Live" | "Inserisci Colpi" | "Admin"
- Active link highlighted
- Marathonazza wordmark/logo on the left
- Mobile: hamburger menu or bottom tab bar

---

## Mobile Considerations

Page 3 (Score Entry) is the most critical for mobile:
- Stepper buttons must be at least 44×44px tap targets
- Tables scroll horizontally if needed (but prefer vertical layout on mobile)
- Large, readable fonts (min 16px for inputs to prevent iOS zoom)
- "Conferma giro" button fixed at bottom of screen on mobile

---

## Real-time Behavior

| Page | Realtime subscription |
|------|-----------------------|
| Leaderboard (`/`) | `rounds` table — update leaderboard when new round submitted |
| Live Round (`/live`) | `hole_scores` table — update cells as strokes are entered |
| Score Entry (`/enter`) | `hole_scores` for current group only — show other pair's updates |

Use Supabase `channel().on('postgres_changes', ...)` subscriptions.
