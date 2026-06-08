# ChatApp Demo — Design System & UI Quality Standard

**Version**: 1.0.0
**Project**: ChatApp Demo — Static Frontend Chat Application
**Stack**: Vite + React JS (JavaScript/JSX) + Tailwind CSS
**Deployment**: Vercel (static hosting)
**Design Tone**: Soft-Industrial — utilitarian clarity with warmth. A chat app that feels like a well-built tool, not a toy. Clean, fast, keyboard-native, with subtle polish that rewards attention without demanding it.

---

## Table of Contents

1. [Anti-Slop Manifesto & Banned Defaults](#1-anti-slop-manifesto--banned-defaults)
2. [Typography System](#2-typography-system)
3. [Colour Palette & Semantic Tokens](#3-colour-palette--semantic-tokens)
4. [Spacing & Layout Rhythm](#4-spacing--layout-rhythm)
5. [Component Recipes](#5-component-recipes)
6. [Motion & Animation](#6-motion--animation)
7. [State Handling (Loading / Empty / Error / Success)](#7-state-handling)
8. [Accessibility (Non-Negotiable)](#8-accessibility)
9. [Responsive Breakpoints & Rules](#9-responsive-breakpoints--rules)
10. [Page-Specific Layout Contracts](#10-page-specific-layout-contracts)
11. [Premier Motion Catalog](#11-premier-motion-catalog)
12. [Worker Acceptance Checklist](#12-worker-acceptance-checklist)

---

## 1. Anti-Slop Manifesto & Banned Defaults

This is a chat application — not a generic SaaS landing page. The UI must feel like a communication tool: dense where it needs to be (conversation list), airy where it helps focus (message thread), and always responsive. Every screen must commit to the **Soft-Industrial** aesthetic: warm neutrals, one strong accent, clean typography, and zero gratuitous decoration.

### 1.1 Banned Defaults (Do Not Use)

The following patterns are **forbidden** in this codebase. If a screen contains any of these, it fails review:

| Banned Pattern | Why It's Banned | What To Use Instead |
|---|---|---|
| `font-family: Inter, Roboto, Arial, system-ui` as the brand voice | Default LLM font choice; reads as generic | Geist for UI, Geist Mono for code/timestamps (see §2) |
| Purple-to-pink gradients on white backgrounds | The #1 AI-generated UI tell | Warm stone/slate neutral backgrounds; accent used sparingly on interactive elements only |
| Pure `#000` on pure `#fff` | Harsh contrast; reads as unstyled | `stone-900` on `stone-50` (see §3) |
| Centred card stack with three feature columns and a CTA at the bottom | Generic landing page pattern; inappropriate for a chat app | Chat app uses a two-pane layout: conversation list (left) + message thread (right). No "feature cards" exist. |
| `bg-gradient-to-r from-purple-500 to-pink-500` | Overused gradient cliché | No gradients on structural elements. Accent is a single solid hue. |
| `rounded-md` everywhere | Inconsistent radius identity | `rounded-2xl` for cards/panels, `rounded-xl` for buttons, `rounded-full` for avatars (see §5) |
| Icon = emoji (🚀 ⚡ 🎨) | Reads as unpolished; inaccessible | SVG icons only (Lucide via `lucide-react`). Emoji are user-generated content in messages only, not structural UI icons. |
| "Get Started" buttons that are just `bg-blue-500 text-white` | Generic CTA styling | Primary buttons use `bg-accent` (amber-500) with proper hover/focus/active states (see §5.2) |
| Placeholders used as the only label on inputs | Inaccessible; disappears on focus | Every input has a visible `<label>` above it. Placeholder provides example format only. |
| The same animation easing (`ease-in-out`) on everything | LLM-default easing; feels mechanical | Enter: `ease-out`. Exit: `ease-in`. Micro: `cubic-bezier(0.16, 1, 0.3, 1)` for spring feel (see §6) |
| Em-dashes in UI microcopy | Overused in AI-generated copy | Use en-dashes for ranges, colons for labels, or simple punctuation |
| "Trusted by" + fake logo strips | Not applicable to a chat app | N/A — this app has no marketing pages |
| Fake product screenshots | Misleading | N/A — the app IS the product |
| Placeholder names like "Jane Doe" / "Acme Inc" | Generic | Use PRD-specified demo names: "Alice Demo", "Bob Test", "Charlie Mock", "Diana Fake", "Eve Example" |
| Neon glows on dark | Overused; reads as gamer aesthetic | No glows. Depth comes from subtle shadows and ring borders. |
| Gradient text on everything | Overused; reduces readability | Accent colour on links only. Body text is always solid `stone-900`. |
| Lorem ipsum | Placeholder text that survived to production | Use realistic demo message content: "Hey, are we still on for tomorrow?", "Just pushed the update — can you review?", etc. |

### 1.2 Design Variance Dials

These dials define the project's aesthetic intensity. Every component decision should align with these settings:

| Dial | Value | Meaning |
|---|---|---|
| **DESIGN_VARIANCE** | 5/10 | Distinctive but not experimental. The chat UI should feel polished and intentional, not weird. |
| **MOTION_INTENSITY** | 4/10 | Subtle, functional motion. Typing indicators, message entry animations, read receipt transitions. No bouncy/cartoonish easing. |
| **VISUAL_DENSITY** | 7/10 | Chat apps are information-dense by nature. Conversation list is compact; message thread has breathing room between messages but tight within. |

---

## 2. Typography System

### 2.1 Font Pairing

**Selected Pairing**: **Geist** (UI sans) + **Geist Mono** (code, timestamps, data)

- **Geist** (weights 400, 500, 600, 700) — Primary UI font. Clean, modern grotesk with excellent readability at small sizes. Used for all body text, headings, labels, and UI chrome.
- **Geist Mono** (weights 400, 500) — Monospace companion. Used for message timestamps, code blocks in messages, and the character counter in the message composer.

**Why not Inter?** Inter is the default LLM font choice. Geist provides the same readability but with a more distinctive, modern character. It's designed by Vercel specifically for UI work and pairs naturally with the Vite + Vercel stack.

**Font Loading**: Self-hosted via `vite-plugin-fonts` or imported from `geist/font` packages. `font-display: swap` on all `@font-face` declarations.

```css
/* Global stylesheet — font-face declarations */
@font-face {
  font-family: 'Geist';
  src: url('/fonts/Geist-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
/* ... repeat for 500, 600, 700 weights ... */
@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/GeistMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

### 2.2 Typographic Scale (Tailwind Tokens)

Use these exact Tailwind classes. Do not invent arbitrary font sizes.

| Role | Tailwind Class | Weight | Tracking | Line Height | Use |
|---|---|---|---|---|---|
| **Display** | `text-5xl md:text-6xl` | 700 | `tracking-tighter` | `leading-tight` (1.25) | Auth screen app title only |
| **H1** | `text-2xl md:text-3xl` | 600 | `tracking-tight` | `leading-tight` (1.25) | Conversation header (contact/group name) |
| **H2** | `text-xl` | 600 | `tracking-tight` | `leading-snug` (1.375) | Modal titles, settings section headers |
| **H3** | `text-lg` | 500 | `tracking-normal` | `leading-snug` | Card titles, group member names |
| **Body L** | `text-base` | 400 | `tracking-normal` | `leading-relaxed` (1.625) | Message body text |
| **Body** | `text-sm` | 400 | `tracking-normal` | `leading-relaxed` | Conversation list previews, form labels |
| **Body S** | `text-xs` | 400 | `tracking-normal` | `leading-normal` (1.5) | Timestamps, captions, helper text |
| **Mono** | `font-mono text-xs` | 400 | `tracking-normal` | `leading-normal` | Message timestamps (HH:MM format), character counter, code blocks |
| **Label** | `text-xs` | 500 | `tracking-wider` | `leading-none` | Uppercase labels (e.g., "ONLINE", "ADMIN") |

### 2.3 Typography Rules

- **Line length**: Message body text max-width `max-w-[65ch]`. Conversation list previews truncated to 2 lines with `line-clamp-2`.
- **Numbers**: All timestamps, unread counts, and character counters use `tabular-nums` to prevent column jitter.
- **Message timestamps**: Use Geist Mono at `text-xs` with `tabular-nums`. Format: `HH:MM` for today, `MMM D` for older.
- **No 800/900 weights**: Maximum weight is 700 (Display). Heavier weights shout and reduce readability at small sizes.
- **Heading hierarchy**: Sequential only — h1 → h2 → h3. No skipping levels.

### 2.4 Typography in Context

**Auth Screen (Login/Register)**:
- App name: `text-5xl md:text-6xl font-bold tracking-tighter` in Geist 700
- Form labels: `text-sm font-medium` in Geist 500
- Input text: `text-base` in Geist 400
- Error messages: `text-xs` in Geist 400, coloured `text-danger`
- Demo user buttons: `text-sm font-medium` in Geist 500

**Conversation List**:
- Contact/group name: `text-sm font-medium truncate` in Geist 500
- Last message preview: `text-xs text-text-muted truncate` in Geist 400
- Timestamp: `text-xs tabular-nums text-text-muted` in Geist Mono 400
- Unread badge: `text-[10px] font-bold tabular-nums` in Geist 600

**Message Thread**:
- Sender name (group only): `text-xs font-medium` in Geist 500
- Message body: `text-base leading-relaxed` in Geist 400
- Timestamp: `text-[11px] tabular-nums text-text-muted` in Geist Mono 400
- Date separator: `text-xs font-medium uppercase tracking-wider` in Geist 500

**Message Composer**:
- Input text: `text-base` in Geist 400
- Character counter: `text-xs tabular-nums` in Geist Mono 400
- Placeholder: `text-base text-text-muted` in Geist 400

---

## 3. Colour Palette & Semantic Tokens

### 3.1 Palette Identity

**Accent**: **Amber** — warm, energetic, signals "new message" without being aggressive. Amber conveys warmth and approachability, fitting a chat app for friends and small teams.

**Neutrals**: **Stone** — warm grey family. Stone-50 for canvas, stone-100 for surfaces, stone-200 for borders, stone-900 for body text. Stone reads as warmer and more intentional than pure gray.

### 3.2 Semantic Colour Tokens

Declare these as CSS custom properties in the global stylesheet. **Never use raw hex values inside components** — always reference the semantic token.

```css
:root {
  /* Canvas & Surfaces */
  --color-bg:           #fafaf9;  /* stone-50  — main canvas */
  --color-surface:      #ffffff;  /* white     — cards, panels, message bubbles (own) */
  --color-surface-2:    #f5f5f4;  /* stone-100 — elevated surfaces, message bubbles (others), hover states */
  --color-surface-3:    #e7e5e4;  /* stone-200 — input backgrounds, selected conversation */

  /* Text */
  --color-text:         #1c1917;  /* stone-900 — body text, headings */
  --color-text-muted:   #78716c;  /* stone-500 — secondary text, timestamps, placeholders */
  --color-text-inverse: #fafaf9;  /* stone-50  — text on dark/accent backgrounds */

  /* Borders & Dividers */
  --color-border:       #e7e5e4;  /* stone-200 — card rings, input borders, dividers */
  --color-border-light: #f5f5f4;  /* stone-100 — subtle separators */

  /* Accent */
  --color-accent:       #f59e0b;  /* amber-500 — primary CTAs, links, unread badges, focus rings */
  --color-accent-hover: #d97706;  /* amber-600 — hover state for accent buttons */
  --color-accent-fg:    #1c1917;  /* stone-900 — text on accent background (amber is light enough for dark text) */
  --color-accent-muted: #fef3c7;  /* amber-100 — accent background for badges, highlights */

  /* Semantic */
  --color-success:      #10b981;  /* emerald-500 — sent/delivered indicators, success toasts */
  --color-success-bg:   #d1fae5;  /* emerald-100 — success background */
  --color-warning:      #f59e0b;  /* amber-500 — warning toasts (reuses accent) */
  --color-warning-bg:   #fef3c7;  /* amber-100 */
  --color-danger:       #ef4444;  /* red-500 — error messages, failed delivery */
  --color-danger-bg:    #fee2e2;  /* red-100 — error background */
  --color-info:         #3b82f6;  /* blue-500 — info toasts */
  --color-info-bg:      #dbeafe;  /* blue-100 — info background */

  /* Focus */
  --color-focus:        #f59e0b;  /* amber-500 — focus ring colour */

  /* Presence */
  --color-online:       #10b981;  /* emerald-500 — online dot */
  --color-offline:      #78716c;  /* stone-500 — offline dot */
  --color-typing:       #f59e0b;  /* amber-500 — typing indicator dot */

  /* Shadows (as colour tokens for consistency) */
  --shadow-color:       0 0 0;    /* black — base shadow colour */
}
```

### 3.3 Dark Mode Palette

Dark mode is not inverted light mode. Surfaces desaturate and drop one tonal step. Accent retains hue but reduces saturation ~10%.

```css
.dark {
  --color-bg:           #1c1917;  /* stone-900 */
  --color-surface:      #292524;  /* stone-800 */
  --color-surface-2:    #44403c;  /* stone-700 */
  --color-surface-3:    #57534e;  /* stone-600 */

  --color-text:         #fafaf9;  /* stone-50 */
  --color-text-muted:   #a8a29e;  /* stone-400 */
  --color-text-inverse: #1c1917;  /* stone-900 */

  --color-border:       #44403c;  /* stone-700 */
  --color-border-light: #292524;  /* stone-800 */

  --color-accent:       #fbbf24;  /* amber-400 — slightly brighter for dark bg */
  --color-accent-hover: #f59e0b;  /* amber-500 */
  --color-accent-fg:    #1c1917;  /* stone-900 */
  --color-accent-muted: #78350f;  /* amber-900 — darker muted bg for dark mode */

  --color-success:      #34d399;  /* emerald-400 */
  --color-success-bg:   #064e3b;  /* emerald-900 */
  --color-danger:       #f87171;  /* red-400 */
  --color-danger-bg:    #7f1d1d;  /* red-900 */
  --color-info:         #60a5fa;  /* blue-400 */
  --color-info-bg:      #1e3a5f;  /* blue-900 */

  --color-focus:        #fbbf24;  /* amber-400 */
  --color-online:       #34d399;  /* emerald-400 */
  --color-offline:      #a8a29e;  /* stone-400 */

  --shadow-color:       0 0 0;
}
```

### 3.4 Contrast Requirements (Non-Negotiable)

| Element | Minimum

# Craft — Design Quality Standard (BINDING)

This is the single source of truth for HOW every UI file in this codebase
must look and feel. Every worker reads this before writing markup, styles,
or component code. The rules are concrete and measurable. When the LLD or
PRD is silent on a visual decision, this file decides.

> Goal: ship interfaces that look like a senior designer made them on
> purpose — not interfaces that look like an LLM generated them by default.

---

## 0. Anti-Slop Manifesto

Default LLM output is generic, centred, purple-gradient, Inter on white,
shadow-md, rounded-md, three-card grid. We do not ship that. Every screen
must commit to a clear aesthetic direction (editorial, brutalist,
high-end-agency, soft-luxury, industrial-utilitarian, etc.) and execute
that direction with precision.

If a screen could belong to any AI-generated SaaS demo, it is wrong.

**Banned defaults (do not use unless PRD/design.md overrides explicitly):**

- `font-family: Inter, Roboto, Arial, system-ui` as the brand voice
- purple-to-pink gradients on white backgrounds
- pure `#000` on pure `#fff`
- centred card stack with three feature columns and a CTA at the bottom
- `bg-gradient-to-r from-purple-500 to-pink-500`
- `rounded-md` everywhere
- icon = emoji (🚀 ⚡ 🎨)
- "Get Started" buttons that are just `bg-blue-500 text-white`
- placeholders used as the only label on inputs
- the same animation easing (`ease-in-out`) on everything

---

## 1. Typography (binding)

**Pairing rule:** one display/serif/expressive heading face + one calm
sans body face. Never use a single font for everything.

**Scale (Tailwind tokens — use these, not arbitrary values):**

| Role | Class | Use |
|---|---|---|
| Display | `text-6xl md:text-7xl` | hero h1 once per page |
| H1 | `text-4xl md:text-5xl` | section headers |
| H2 | `text-2xl md:text-3xl` | subsection |
| H3 | `text-xl` | card titles |
| Body L | `text-lg leading-relaxed` | hero subhead, intro |
| Body | `text-base leading-relaxed` | default |
| Body S | `text-sm leading-relaxed` | meta, captions |
| Mono | `font-mono text-sm` | code, data, prices |

**Weights:** display 600-700 with tight tracking (`tracking-tight` /
`tracking-tighter`). Body 400. Labels 500. Never use 800/900 as
default — they shout.

**Line length:** body prose `max-w-prose` or `max-w-[65ch]`. Never
edge-to-edge paragraphs on desktop.

**Line height:** body `leading-relaxed` (1.625). Headings `leading-tight`
(1.25). Never `leading-normal` (1.5) on display type.

**Numbers in data tables / prices / timers:** `tabular-nums` to stop
column jitter.

**Suggested font families** (pick ONE pairing per project, declare in
design.md or the global stylesheet):

- *Editorial* — Fraunces / Söhne (or Inter Tight as cheap fallback)
- *Modern Agency* — Geist / Geist Mono
- *Soft Luxury* — Cormorant Garamond / Manrope
- *Industrial* — Space Grotesk / JetBrains Mono *(use sparingly — overused)*
- *Brutalist* — Archivo Black / IBM Plex Mono

Use Google Fonts or self-host. Add `font-display: swap`.

---

## 2. Colour (binding)

**Palette rule:** ONE expressive accent + ONE warm neutral family +
small set of semantic tokens. Never invent ad-hoc hex values inside
components.

**Neutrals:** prefer `stone` / `slate` / `zinc` warm scales over Tailwind's
default `gray`. Pure `#fff` is too cold — use `stone-50` (`#FAFAF9`) for
canvas and `stone-900` (`#1C1917`) for body text.

**Accent rule:** pick ONE accent hue that carries the brand. Use it
sparingly — links, primary CTA, focus rings, key data points. If every
button is the accent colour, the accent is dead.

**Contrast (non-negotiable):**

- Body text vs background: ≥ 4.5:1
- Large text (≥18pt or 14pt bold): ≥ 3:1
- Icons and disabled text: ≥ 3:1
- Focus ring vs adjacent surface: ≥ 3:1

**Semantic tokens** (declare in the global stylesheet's Tailwind v4 `@theme`
block as `--color-*` tokens — NOT a `tailwind.config.js`; reference through the
generated token utilities, never raw hex inside components):

```
--color-bg          (canvas)
--color-surface     (cards, panels)
--color-surface-2   (elevated)
--color-text        (body)
--color-text-muted  (secondary)
--color-border      (dividers)
--color-accent      (primary CTA, links)
--color-accent-fg   (text on accent)
--color-success
--color-warning
--color-danger
--color-focus       (focus ring)
```

**Dark mode:** design light/dark together. Dark mode is NOT inverted
light mode — desaturate, drop one tonal step on surfaces, keep accent
hue but reduce saturation 10-15%. Test contrast independently.

**Functional colour must never be the only signal.** Error rows also
get an icon + label. Success states also get a check icon. Colour-blind
users exist.

---

## 3. Spacing & Layout (binding)

**8-pt rhythm.** All padding, gap, margin step in 4px / 8px units.
Use Tailwind's spacing scale (`p-4`, `gap-6`, `py-16`) — never raw `px`.

**Section spacing tiers** (pick a tier and stick to it within the page):

| Tier | Token | Use |
|---|---|---|
| Tight | `space-y-3` / `gap-3` | inside cards, inline meta |
| Default | `space-y-6` / `gap-6` | between paragraphs, list items |
| Section | `space-y-12 py-16 md:py-24` | between top-level sections |
| Hero | `py-24 md:py-32 lg:py-40` | landing hero, only once |

**Generous default.** When in doubt, add MORE space. Cramped is the #1
signal of generic AI output.

**Container width:** `max-w-6xl px-6 mx-auto` for content. `max-w-7xl`
for dashboards. Never edge-to-edge text on desktop.

**Layout patterns to prefer over centred-card-on-white:**

1. **Editorial split** — large display text left, body + CTA right,
   asymmetric column widths (e.g. `grid-cols-12` with `col-span-7` / `col-span-5`).
2. **Bento grid** — uneven tiles, 2-3 visual weights per row, varies
   density. Tailwind `grid-cols-6` with `col-span-{2,3,4}` mixes.
3. **Hero + sidebar** — dashboard pattern with persistent left nav,
   content takes the rest.
4. **Sticky aside** — long-form content with `sticky top-24` table of
   contents on the right.
5. **Magazine** — asymmetric overlap, oversized headings break the grid,
   small caption text on the margin.

**Banned layouts:** centred stack with three identical feature cards
under a hero. Use it only if PRD explicitly demands it.

### 3.0 Hero / Landing Page (BINDING — first impression rules)

Landing + hero are the #1 generic-AI-output target. Defaults look the
same across every demo on the internet. Make ours feel intentional.

**Hard rules:**

- **Display type must dominate.** Hero headline ≥ `text-6xl md:text-7xl
  lg:text-8xl` with `tracking-tighter leading-[0.95]`. Bigger than
  feels comfortable. Pair with display/serif face (Fraunces, Inter
  Tight, Söhne, GT Walsheim) — never default sans.
- **Asymmetric, never centred-card.** Use one of:
  1. *Editorial split* — display headline left (`col-span-7`), body +
     CTA + meta right (`col-span-5`). Visual line breaks across the
     grid.
  2. *Magazine* — oversized title overlaps a hero image / GIF / shader
     canvas. Sub-line offset 12-16ch from the title.
  3. *Hero + sticky aside* — long-form lead paragraph centre, persistent
     CTA / TOC stuck to the right (`sticky top-24`).
  4. *Bento above the fold* — title in one tile, social proof / metric
     tiles in others, CTA tile spans 2 columns.
- **One primary CTA only.** Visually loud. Secondary actions read as
  ghost links (`underline-offset-4 hover:underline`), not buttons.
- **Background MUST have depth.** Solid `bg-white` is forbidden. Pick:
  noise/grain overlay, gradient mesh (3 stops, large blur), low-opacity
  decorative SVG (grid / dots / lines), shader canvas (3-5 KB WebGL),
  or animated marquee strip near the top/bottom. Layer transparency
  with `mix-blend-` tasteful.
- **Hero motion (subtle, premium).** On first paint: stagger title
  lines 80ms apart, fade-up body 200ms after, CTA scale-in last. Image
  ken-burns over 8-12s. NEVER: bouncing arrows, parallax scrolling on
  body, autoplay video with sound, looping scale on CTAs.
- **Social proof on the fold.** Logo wall (5-8 grayscale logos, hover
  to colour), or a stat strip (3-4 numbers with `tabular-nums`), or a
  pull-quote with face + name. Never "Trusted by 1000+ teams" with no
  evidence.
- **Concrete copy.** Headline names the OUTCOME, not the product
  category. "Ship docs reviewers actually read" beats "AI-powered docs
  platform". Sub-line gives the proof: who/how. CTA verb leads with
  user action ("Start writing", "Open the demo").
- **Above-the-fold height ≈ 100vh on desktop, ≥ 700px on laptop.** Use
  `min-h-[100svh]` (small viewport) to avoid mobile chrome cutting it.
- **Scroll cue is implied, never explicit.** No bouncing chevron — let
  the next section show 10-15% above the fold and the user infers.

**Section flow below the hero (default — adapt to product):**

1. **Problem framing** (1-paragraph editorial). Italic display quote
   that names the user pain.
2. **Featured value triplet** — three asymmetric cards, NOT three
   identical ones. Different sizes, different content shapes
   (text-only / icon-heavy / metric-heavy).
3. **Demo / product surface** — large hero screenshot or video,
   browser-chrome'd with `rounded-2xl shadow-2xl ring-1 ring-black/5`,
   ideally with annotated callouts.
4. **Logos / social proof** — if not on fold.
5. **Feature deep-dive** — bento grid, 4-6 tiles, varied densities.
6. **FAQ / objection handling** — accordion or 2-column Q&A.
7. **Pricing or final CTA** — generous spacing, single block.
8. **Footer** — multi-column with secondary nav + brand.

**Banned hero defaults (do not ship):**

- `bg-gradient-to-r from-purple-500 to-pink-500` hero banner
- centred 60ch column with title + subtitle + two buttons
- "Get Started" + "Learn More" button pair below dead-centre title
- floating phone mockup in front of a wave / blob SVG
- emoji in headline ("🚀 Build faster")
- "AI-powered" as the primary value proposition
- generic stock photo of a smiling person at a laptop
- the same Tailwind purple as the only accent

**Worker self-check (landing + hero page):**

- [ ] headline ≥ `text-6xl` with tight tracking + display font
- [ ] layout is asymmetric (NOT centred-on-white)
- [ ] background has depth (gradient mesh / grain / pattern / shader)
- [ ] one primary CTA, secondary is ghost link
- [ ] social proof appears above or just after the fold
- [ ] copy names outcome, not product category
- [ ] hero motion is staged on first paint (no scattered bounces)
- [ ] no banned default from the list above

### 3.1 Layout vs Page Contract (BINDING — prevents duplicate chrome)

This is the #1 source of "two header" / "double navbar" bugs when many
workers generate pages in parallel without seeing each other's output.

**Layout chrome is owned by ONE file** — usually `App.jsx`,
`src/layouts/RootLayout.jsx`, or `src/components/Layout.jsx`. That file
renders `<Navbar/>`, `<Sidebar/>`, `<Footer/>`, the page wrapper
container, and `<Outlet/>` (or `{children}`). Page files render ONLY
their own content.

**Hard rules:**

- Page files (anything in `src/pages/**` or `src/routes/**`) MUST NOT
  import or render `<Navbar/>`, `<Header/>`, `<Sidebar/>`, `<Footer/>`,
  or any top-level brand wordmark.
- Page files MUST NOT add their own `min-h-screen` body wrapper, page
  background colour, or full-bleed gradient banner that conflicts with
  the layout's canvas. Pages start from `<main>` content level.
- The layout owns: navigation, auth chrome (avatar/login button),
  background, max-width container, vertical gutters. Pages fill the
  layout's slot — they don't recreate it.
- If a page truly needs custom chrome (marketing landing with no nav),
  it must use a SEPARATE layout (e.g. `MarketingLayout`) declared in
  the router. Never inline duplicate chrome inside a page.
- App.jsx / router setup is responsible for choosing which layout wraps
  which route. Workers writing page files trust the layout is there.

**Worker self-check before complete_job:**

- [ ] No `<Navbar/>`, `<Header/>`, `<Sidebar/>`, `<Footer/>` imported in
      this page.
- [ ] No second wordmark / logo at the top of this page.
- [ ] No full-width sticky bar at `top-0` (that's layout chrome).

### 3.2 Uniqueness Rules (BINDING — prevents duplicate labels / IDs)

Same isolation bug produces duplicate stat cards, duplicate sidebar
items, duplicate route definitions. Enforce uniqueness at construction:

- **Stat / metric arrays** must have unique `label` AND unique `key`.
  If you find yourself listing `["Total Users", "Total Users"]`, STOP —
  recompute from the PRD/LLD spec. Re-read the source to find what the
  second card should actually be (`Active Today`, `New This Week`,
  `Admins`, etc.).
- **List rendering** must use stable unique React keys; never `key={i}`
  for a list whose entries are themselves duplicable.
- **Route paths** declared in `App.jsx` / `router.tsx` must be unique.
  No two `<Route path="/users">` definitions.
- **Sidebar nav items** must be unique by `to` (route target).
- **Form field names** must be unique within a single form.

**Worker self-check before complete_job:**

- [ ] Every array of items I'm rendering has unique labels AND unique
      keys.
- [ ] No two stat cards / nav items / routes share the same label.

---

## 4. Components (binding)

**Corner radius:** pick ONE radius identity per project:
- Editorial / Modern → `rounded-2xl` for cards, `rounded-xl` for buttons
- Brutalist → `rounded-none` everywhere
- Soft / Playful → `rounded-3xl` for cards, `rounded-full` for buttons

Never mix `rounded-md` cards with `rounded-2xl` buttons — that's tell #1.

**Shadow scale** (declare 3 levels max, use consistently):

| Level | Class | Use |
|---|---|---|
| Flat | `shadow-none ring-1 ring-stone-200` | default cards |
| Lift | `shadow-lg hover:shadow-xl transition-shadow` | interactive cards |
| Modal | `shadow-2xl` | dialogs, popovers |

**Borders / rings:** prefer `ring-1 ring-stone-200/80` over heavy
`border-2 border-gray-300`. Hairline rings read more refined.

**Buttons:**

```html
<!-- Primary -->
<button class="px-5 py-2.5 rounded-xl bg-stone-900 text-stone-50
               hover:bg-stone-800 focus-visible:outline-none
               focus-visible:ring-2 focus-visible:ring-stone-900
               focus-visible:ring-offset-2 transition-colors
               text-sm font-medium">
  Continue
</button>

<!-- Secondary -->
<button class="px-5 py-2.5 rounded-xl ring-1 ring-stone-300
               bg-white hover:bg-stone-50 text-stone-900 ...">
  Cancel
</button>
```

- min touch target 44×44px (use `py-2.5` minimum on mobile)
- `cursor-pointer` on every clickable
- visible focus ring on EVERY interactive element (`focus-visible:ring-2`)
- disabled = `opacity-50 cursor-not-allowed` + `aria-disabled="true"`
- loading state = spinner + disabled, never hide the button label

**Inputs:**

- visible label above input (placeholder is NOT a label)
- helper text persistent under input, not just placeholder
- error message below the field, in `text-danger` + icon
- inline validation on blur, never keystroke
- mobile input height ≥ 44px
- semantic `type=` (email/tel/number) for correct mobile keyboard

**Cards:**

```
rounded-2xl bg-white p-6 md:p-8
ring-1 ring-stone-200
hover:ring-stone-300 hover:shadow-lg
transition-all duration-200
```

**Icons:** SVG only (Lucide / Heroicons). Stroke width consistent across
the product (1.5 or 2, pick one). NEVER emoji as structural icons.

---

## 5. Motion (binding)

**Durations:** micro 150-200ms, normal 200-300ms, complex 300-400ms.
Never > 500ms.

**Easing:**
- enter / reveal: `ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)` for spring feel)
- exit / dismiss: `ease-in` (faster — exit ≈ 60-70% of enter duration)
- never `linear` on UI transitions
- never `ease-in-out` as the default (it's the LLM-default tell)

**Property rule:** animate `transform` and `opacity` ONLY. Never
`width` / `height` / `top` / `left` — they cause reflow and jank.

**Hover:** subtle. `hover:scale-[1.02]` on cards, `hover:shadow-lg`
transition, colour shift on buttons. Never bouncy or cartoonish.

**Stagger:** list/grid entrances stagger 30-50ms per item. Use
`animation-delay` or Motion's `delay`.

**Reduced motion:** wrap every animation with
`@media (prefers-reduced-motion: reduce)` → instant transitions, no
parallax. Tailwind has `motion-reduce:` variant — use it.

**No blocking animation.** User can always click through; animation
never holds input.

**Page load:** one orchestrated reveal beats scattered micro-interactions.
Stagger the hero in 3-4 phases on first paint.

### 5.1 Premier Motion — small touches that earn their wage

These are the little, unobvious animations that separate "shipped" from
"premium". Use them — they are cheap, low-risk, and add perceived quality.

- **Button press scale.** `active:scale-[0.97] transition-transform
  duration-100` on every primary button. The pressed state should *feel*
  pressed, not just look pressed.
- **Card lift on hover.** `transition-all duration-200 hover:-translate-y-0.5
  hover:shadow-xl`. Subtle vertical lift > naive shadow change.
- **Image / hero ken-burns.** On the hero image, slow `scale(1) → scale(1.04)`
  over 8-12s with `ease-out`. Brings static photography to life.
- **Number count-up.** Dashboard stat cards count from `0 → final` over
  ~600ms on first paint (use `motion`'s `animate` or a small RAF helper).
- **Skeleton shimmer.** Loading skeletons get a left-to-right gradient
  `animate-pulse` PLUS a slow shimmer overlay — feels alive, not frozen.
- **Reveal-on-scroll.** Section enters with `opacity-0 translate-y-4 →
  opacity-100 translate-y-0` once it crosses viewport. Use
  `IntersectionObserver` or Motion's `whileInView`. Stagger 50ms per child.
- **Underline grow on link hover.** `bg-gradient` underline expands from
  left or center — never the default `underline` toggle.
- **Magnetic CTA.** Buttons on landing/marketing pages tilt 2-4° toward
  the cursor. Motion library: `useMotionValue` + `useTransform`.
- **Carousel/tab indicator.** Active tab underline / dot SLIDES between
  positions (`layoutId` in Motion) instead of fading in-out.
- **Toast slide-in.** Toasts enter from the trigger origin or a screen
  edge with a spring (`stiffness ~ 300, damping ~ 24`), exit faster.
- **Modal scale-from-trigger.** Modals scale from `0.96 → 1` + fade.
  Backdrop fades to ~40-60% black at the same time.
- **Input focus halo.** `focus:ring-2 ring-accent/40` with a 200ms
  transition. Plus a 1px border colour shift. Tells the user where they are.
- **Disabled crossfade.** When a button toggles disabled, opacity slides
  `1 → 0.5` over 150ms — never an instant snap.
- **Form field error shake.** On submit error, the invalid input does a
  4-frame `translateX(-4, 4, -4, 0)` over 200ms. One per submit, not loop.
- **Checkbox / toggle spring.** Checkbox tick draws in (SVG `stroke-
  dashoffset` 0→100), toggle thumb springs across the track. Native HTML
  checkboxes are tell #2 of generic AI UI.
- **Drag affordance.** When draggable, item lifts (`scale-[1.02]
  shadow-2xl`) on `pointerdown`, drops back smoothly on release.
- **Route transitions.** Page navigation crossfades content + slides 8px
  in the navigation direction. 250ms. Never a hard cut.
- **Cursor follower (optional).** On landing / portfolio sites, a
  small accent-colour dot follows the cursor with `lerp` smoothing —
  scales up on interactive hover. Tasteful, not gimmicky.
- **Marquee / text scroll.** Long pill rows of logos / categories move
  horizontally on a slow infinite loop. Pauses on hover.
- **Chart bar grow-in.** Bar charts animate `height: 0 → final` on first
  paint with 50ms stagger. Lines draw with `stroke-dasharray`.
- **Theme toggle morph.** Sun/moon icon rotates and morphs (SVG
  `transition-transform rotate-180`) on theme switch.

**Respect reduced-motion.** Wrap every entry above in
`motion-reduce:transition-none motion-reduce:transform-none` or
equivalent. Honour the user, or be inaccessible.

---

## 6. States (binding — never skip)

Every component that fetches or computes data MUST handle four states.
A blank screen during load is a bug.

| State | What to render |
|---|---|
| **Loading** | Skeleton with same shape as final content (not a centred spinner). For ≤300ms operations, no spinner at all. |
| **Empty** | Friendly heading + one-line explanation + primary CTA to populate. Never an empty `<div>`. |
| **Error** | Heading naming the failure + retry action + secondary "help" link. Never just "Error". |
| **Success** | Inline confirmation (toast / check icon / colour flash). Auto-dismiss in 3-5s. |

Toasts: `aria-live="polite"`, never steal focus.

---

## 7. Accessibility (binding — non-negotiable)

- semantic HTML: `<button>` for buttons, `<a>` for links, `<nav>` for nav,
  `<main>` for main content. Never `<div onClick>`.
- every icon-only button has `aria-label`.
- focus ring visible on EVERY interactive element. Removing it is a bug.
- tab order matches visual order. Test with keyboard only.
- heading hierarchy sequential: h1 → h2 → h3. No skipping.
- form errors use `role="alert"` or `aria-live`.
- after submit error, focus the first invalid field.
- support `prefers-reduced-motion` and dynamic text scaling.
- colour is never the only signal — pair with icon or text.

---

## 8. Responsive (binding)

**Breakpoints** (Tailwind defaults — do not invent new ones):

| Token | Width | Target |
|---|---|---|
| (default) | 0 | mobile portrait |
| `sm:` | 640 | large phone landscape |
| `md:` | 768 | tablet |
| `lg:` | 1024 | small laptop |
| `xl:` | 1280 | desktop |
| `2xl:` | 1536 | large desktop |

**Mobile-first.** Write the mobile rule first, scale up. Never `md:hidden`
to hide critical content.

**No horizontal scroll on mobile.** Test at 375px width.

**Container gutters** widen with breakpoint: `px-4 md:px-6 lg:px-8`.

**Hero text shrinks**: `text-4xl md:text-5xl lg:text-7xl` (do not pin
display sizes at one value).

---

## 9. Final Acceptance Checklist (every worker self-checks)

Before calling `complete_job`, the worker confirms:

- [ ] no banned default in the file (see §0)
- [ ] typography pair declared, scale uses tokens
- [ ] palette uses semantic tokens, no raw hex in component
- [ ] contrast checked (body ≥ 4.5:1, icons ≥ 3:1)
- [ ] 8pt spacing rhythm, no random `gap-[7px]`
- [ ] corner-radius identity consistent with rest of project
- [ ] focus ring on every interactive
- [ ] all four states handled if fetching data (loading/empty/error/success)
- [ ] touch targets ≥ 44px on mobile
- [ ] motion uses transform/opacity only, ≤ 400ms, honours `motion-reduce`
- [ ] no emoji as structural icon
- [ ] tested mental render at 375px and at desktop

If any item fails, fix before completing.

---

*This file is loaded into every `design.md` deterministically. Edit it
here, not inside generated artefacts. Variants live next to it as
`craft_brutal.md`, `craft_editorial.md`, etc., selected via
`CRAFT_VARIANT` env var (default = `craft`).*