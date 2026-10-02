# Phase 4: Design (FINAL, approved by Spencer 2026-10-02)

Direction C, "Workbench," refined with the taste-skill. Accent: **navy**.

The reference page is `design/reference/workbench.html`, with its images in `design/reference/img/`. It is also published at https://claude.ai/artifact/VQVuHpREXes3xrEZJe6C63. The review bar at the top of that page is for review only and is not part of the site.

## Design read

This is a personal portfolio for recruiters and hiring managers. It uses a clean product-studio look with native CSS and restrained motion.

Taste-skill dials: DESIGN_VARIANCE 6, MOTION_INTENSITY 5, VISUAL_DENSITY 3.

## Color tokens (light only)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#fafaf9` | Page background (never pure white) |
| `--tint` | `#f2f3f1` | Alternate section background, chips |
| `--fg` | `#18191b` | Body text (never pure black) |
| `--muted` | `#5b5f66` | Secondary text |
| `--rule` | `#e4e5e2` | Borders and dividers |
| `--frame` | `#1d1f22` | Phone frame bezel only |
| `--chrome` | `#ececea` | Browser frame title bar |
| `--dot` | `#cfd0cc` | Browser frame window dots |
| `--accent` | `#2148b8` | Navy. The one accent: primary button, links, focus ring, highlight word |
| `--accent-ink` | `#fafaf9` | Text on the accent |
| `--shadow` | `24 40 80` | RGB for tinted shadows, used as `rgb(var(--shadow) / .35)` |

There is no dark mode. Set `color-scheme: light`. Never put light text on a dark section.

## Type

- **Geist** for everything, at weights 400, 500, 600 and 700. Headings use 600 with `letter-spacing: -0.025em` and `text-wrap: balance`.
- **Geist Mono** for small details only: status pills, stack chips, the email address and diagram captions.
- Body text is 17px with a line height of 1.6. The h1 is `clamp(36px, 4.6vw, 58px)`.
- Self-host both fonts (`@fontsource-variable/geist` and `@fontsource-variable/geist-mono`). Do not load them from Google Fonts in production.

## Shape

Buttons and pills are fully rounded (999px). Browser frames, diagrams and cards use 14px corners. The phone frame uses 34px. Nothing else gets its own radius.

## Layout

- Content width is 1180px max, with side padding of `clamp(16px, 4vw, 40px)`. Long text is capped at about 56 to 68 characters per line.
- **Home:** nav, then a split hero (text left; a TV-board browser frame with a phone frame overlapping it on the right), then three project rows, then the contact block, then the footer.
- **Project rows:** row 1 (support content) is full width and stacked, with a diagram instead of screenshots. Row 2 (Slick Bets) is a split on the tinted background. Row 3 (draft room) is a split with the image on the left. Never stack three splits that alternate sides in the same pattern.
- Each row has a status pill, "Work, 2026" or "Personal, 2026", a title, one paragraph, one proof line and a "Read the case study" link.
- **Project page:** back link, title, summary, a facts grid (status, type, year, stack chips, links), a hero frame, then the article at 680px wide.
- Below 768px, everything stacks into one column.

## Motion

- On load, the hero text rises in a cascade 90ms apart, then the browser frame rises and the phone floats in.
- Frames below the first screen ease up 28px when they scroll into view. Use IntersectionObserver, never a scroll listener.
- On hover, buttons lift 1px, the arrow on the "more" link slides, and split-row frames lift 4px.
- Animate only `transform` and `opacity`. Everything sits under `prefers-reduced-motion: no-preference`.

## Banned

- Dark sections, gradients behind text, glass effects and glows
- Decorative status dots, eyebrow labels above headings, and emoji
- Em-dashes and en-dashes anywhere in copy
- Short slogan-style fragments
- Stock photos or illustrations (use real screenshots, or a diagram for confidential work)
