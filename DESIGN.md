# Marathonazza — Design System

## Design Philosophy

**Vibe:** Luxury modern golf. Think Augusta National meets a boutique Italian country club.
**Keywords:** Elegante, esclusivo, fresco, pulito, verde, oro.
**Audience:** Italian golf players, mostly on mobile phones, outdoors in sunlight.
**Priority:** Readability and usability > decoration. Beautiful but never at the expense of function.

---

## Color Palette

```css
/* Primary Golf Greens */
--color-green-900: #0D2B1D;   /* darkest, used for deep backgrounds */
--color-green-800: #1B4332;   /* primary brand green — main backgrounds, headers */
--color-green-700: #2D6A4F;   /* secondary green */
--color-green-600: #40916C;   /* accent / interactive elements */
--color-green-400: #74C69D;   /* light accent, borders */
--color-green-100: #D8F3DC;   /* very light tint, row hover, card backgrounds */
--color-green-50:  #F0FAF3;   /* near-white green tint, page backgrounds */

/* Neutrals */
--color-cream:     #F8FAF5;   /* primary background — warm off-white */
--color-white:     #FFFFFF;
--color-gray-100:  #F1F3F0;
--color-gray-300:  #CDD5C8;
--color-gray-500:  #7A8A75;
--color-gray-700:  #3D4A38;
--color-gray-900:  #1C2B1A;   /* primary text */

/* Podium / Special */
--color-gold:      #C9A84C;   /* 1st place, special competition headers */
--color-gold-light:#F0D98A;   /* gold glow, light gold tint */
--color-silver:    #A8B5A0;   /* 2nd place */
--color-bronze:    #C17F3A;   /* 3rd place */

/* Semantic */
--color-birdie:    #2D9E5A;   /* birdie cell background */
--color-eagle:     #1A6B3A;   /* eagle (rare) */
--color-bogey:     #E8A050;   /* bogey */
--color-double:    #D4604A;   /* double bogey+ */
--color-error:     #C0392B;
--color-success:   #27AE60;
```

### Tailwind Config Extension
```js
// tailwind.config.js
module.exports = {
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
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

## Typography

### Font Import (index.html or globals.css)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Usage
| Element | Font | Weight | Size |
|---------|------|--------|------|
| Page titles / Hero | Playfair Display | 700 | 3rem–5rem |
| Section headings (h2) | Playfair Display | 600 | 1.75rem |
| Card headings (h3) | Playfair Display | 600 | 1.25rem |
| Table headers | Inter | 600 | 0.875rem |
| Body text | Inter | 400 | 1rem |
| Labels / captions | Inter | 500 | 0.75rem |
| Score numbers | Inter | 700 | 1rem–1.5rem (tabular nums) |
| Stepper numbers | Inter | 700 | 1.25rem |

Score numbers should use `font-variant-numeric: tabular-nums` for alignment in tables.

---

## Spacing & Layout

- **Base unit:** 4px (Tailwind default)
- **Page max-width:** 1280px, centered
- **Page padding:** 24px mobile, 48px desktop
- **Card border-radius:** 12px (rounded-xl)
- **Table border-radius:** 16px (outer container)
- **Section gap:** 48px desktop, 32px mobile

---

## Components

### Pair Avatar
- Circle, 40px (leaderboard) / 56px (score entry) / 80px (podium)
- Border: 2px white, box-shadow: `0 2px 8px rgba(0,0,0,0.15)`
- Fallback: initials on `--color-green-700` background, white text
- Podium: gold border for 1st, silver for 2nd, bronze for 3rd

### Leaderboard Row
```
┌─────────────────────────────────────────────────────────┐
│ #1 👑  [photo] Nome1 / Nome2    R1  R2  R3  R4  R5  HCP  NET │
└─────────────────────────────────────────────────────────┘
```
- Background: white with subtle left border (4px solid) in podium color
- 1st: gold border + `background: linear-gradient(90deg, #FFF9E6 0%, white 40%)`
- 2nd: silver border + silver tint
- 3rd: bronze border + bronze tint
- Others: white, hover: `--color-green-50`
- "In corso" badge: small green pill "⛳ in corso" with pulse animation

### Score Cell (Live Round table)
- Birdie (hole 8, strokes=2): `background: #D8F3DC; color: #1B4332; font-weight: 700`
- Under par: `background: #E8F5E9`
- Par: white/default
- Over par: `background: #FFF3E0`
- Double+: `background: #FDECEA`
- Empty: gray `—` centered

### Stroke Stepper (Score Entry)
```
┌────────────────────────┐
│   [−]    5    [+]      │
└────────────────────────┘
```
- Min-height: 52px — large tap target
- Buttons: 44×44px minimum
- Number: 24px Inter bold, centered
- Color: green-800 text, green-100 background when filled

### Special Competition Card
- White card, border: `1px solid --color-green-100`
- Header: colored stripe (gold for BirdieCup, green for others)
- Icon: large (32px) emoji or Lucide icon
- Shadow: `0 4px 16px rgba(27,67,50,0.08)`

### "Conferma giro" Button
- Default (incomplete): `bg-gray-300 text-gray-500 cursor-not-allowed`
- Active (all holes filled): `bg-green-800 text-white` with `animate-pulse` on the border
- Active hover: `bg-green-700`
- Height: 52px, full width, rounded-xl

---

## Page 1 — Hero Design

```
┌─────────────────────────────────────────────────────────┐
│                 [Golf video background]                  │
│                                                         │
│   [LOGO]                                                │
│                                                         │
│        Benvenuto alla Marathonazza                      │
│        ─────────────────────────── (gold underline)    │
│           Giro 3 di 5 · 14 giugno 2025                 │
│                                                         │
│                      ▼                                  │
└─────────────────────────────────────────────────────────┘
```
- Overlay: `background: linear-gradient(180deg, rgba(13,43,29,0.6) 0%, rgba(13,43,29,0.85) 100%)`
- Title: 4xl–6xl Playfair Display white
- Gold underline: `border-bottom: 3px solid #C9A84C` with `width: 60%` centered

### Golf Background Video
Use a free Pexels/Pixabay CDN URL. Suggested embed (no autoplay restrictions):
```html
<video autoPlay muted loop playsInline>
  <source src="https://www.pexels.com/video/download/3770234/" type="video/mp4" />
</video>
```
Note: fallback to a static green grass background image if video fails.
Fallback CSS: `background: linear-gradient(135deg, #0D2B1D 0%, #2D6A4F 100%)`

---

## Special Hole Visual Treatment (Page 2)

| Hole | Icon | Header accent |
|------|------|---------------|
| 2 | 📍 (or `<Flag>` Lucide) | Blue-green tint |
| 7 | ⊕ (or `<Target>` Lucide) | Teal tint |
| 8 | 🐦 (or custom bird SVG) | **Gold** background — most prominent |
| 9 | 📏 (or `<ArrowRight>` Lucide) | Orange-gold tint |

Hole 8 header: `background: linear-gradient(135deg, #C9A84C 0%, #F0D98A 100%); color: #1B4332`

---

## Animations

```css
/* Leaderboard entrance — staggered rows */
@keyframes slideInRow {
  from { opacity: 0; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}
.leaderboard-row { animation: slideInRow 0.3s ease forwards; }
.leaderboard-row:nth-child(n) { animation-delay: calc(n * 0.05s); }

/* 1st place glow pulse */
@keyframes goldPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
  50% { box-shadow: 0 0 16px 4px rgba(201,168,76,0.3); }
}
.rank-1 { animation: goldPulse 2s ease-in-out infinite; }

/* Submit button pulse when active */
@keyframes borderPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(27,67,50,0); }
  50% { box-shadow: 0 0 0 4px rgba(27,67,50,0.3); }
}
.btn-submit-active { animation: borderPulse 1.5s ease-in-out infinite; }

/* Code input shake on error */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.shake { animation: shake 0.4s ease; }
```

---

## Iconography

Use **Lucide React** for all icons.
Key icons:
- `<Flag>` — Nearest to the Pin
- `<Target>` — Closest to the Line
- `<Ruler>` — Drive in Contest
- `<Trophy>` — Leaderboard / podium
- `<Crown>` — 1st place badge
- `<CheckCircle>` — submitted round confirmation
- `<Edit>` — admin edit
- `<Upload>` — photo/map upload
- `<ChevronDown>` — dropdowns
- `<Golf>` — (custom or use `<Disc>`) — general golf reference

Custom SVG bird for BirdieCup (simple swallow silhouette, or use emoji 🐦):
```svg
<!-- Simple bird silhouette for hole 8 BirdieCup badge -->
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M22 2L12 8 2 2c2 4 4 6 6 7l-2 3h8l-2-3c2-1 4-3 6-7z"/>
</svg>
```

---

## Mobile-First Breakpoints

```
xs: < 480px   → single column, full-width cards
sm: 480–768px → some 2-column layouts
md: 768–1024px → 2-column leaderboard + specials
lg: > 1024px  → full 4-column specials grid
```

Page 3 (Score Entry): always single-column on mobile. Score tables scroll horizontally.
The stepper component must pass WCAG 2.1 AA touch target size (44×44px minimum).

---

## Texture & Decoration

- Subtle grass texture overlay on hero: semi-transparent SVG pattern or CSS `background-image`
- Golf ball pattern: optional very subtle watermark behind leaderboard section
- Gold divider lines between sections: `<hr>` with `border-color: #C9A84C; opacity: 0.3`
- Card shadows: `box-shadow: 0 4px 24px rgba(13,43,29,0.08)`

```css
/* Subtle golf ball pattern (optional, very faint) */
.bg-golf-pattern {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='8' fill='none' stroke='%231B4332' stroke-width='0.5' opacity='0.08'/%3E%3C/svg%3E");
}
```
