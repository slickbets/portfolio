# CLAUDE.md

This repo is Spencer Solomon's portfolio site. It supports his search for product, technical program and builder roles, and it is his long-term public home for projects and writing. Spencer builds by directing Claude Code and is not a hand-coder, so explain changes in plain language, make concrete choices instead of offering lists of options, and keep the site simple enough that adding a project takes one file.

## Stack

- Astro, fully static output. No server code, database, login or CMS.
- Content is Markdown or MDX in Astro content collections.
- Plain CSS with custom properties in `src/styles/global.css`. No Tailwind and no UI kit.
- Fonts are self-hosted with `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`.
- Hosting is Cloudflare Pages, deployed from the `main` branch on GitHub. Analytics is Cloudflare Web Analytics, which sets no cookies.
- Images go through `astro:assets` (`<Image />`) so they are resized and served as WebP.

## Commands

- `npm run dev` starts the local site at http://localhost:4321.
- `npm run build` builds the static site into `dist/`. Run it before every commit.
- `npm run check` runs `astro check` for type and content-schema errors.
- `npm run lint:copy` runs `scripts/check-copy.mjs`, which fails on banned characters and private details (see "Checks before every commit").

## Structure

```
src/
  content/
    projects/<slug>/index.md     one case study per folder, with its images beside it
    writing/<slug>.md            posts (the Writing menu link appears only once one exists)
  content.config.ts              schemas for both collections
  components/                    Nav, Footer, ProjectRow, BrowserFrame, PhoneFrame, StatusPill, Diagram
  layouts/Base.astro             head tags, fonts, nav, footer
  pages/
    index.astro                  Home
    work/index.astro             Work list
    work/[slug].astro            Project page
    about.astro                  Bio, web résumé, contact
    writing/index.astro, writing/[slug].astro, rss.xml.js, 404.astro
  styles/global.css              design tokens and base styles
public/
  resume.pdf                     résumé with no phone number
  og/                            share images
.claude/skills/design-taste-frontend/SKILL.md   the reviewed taste-skill, copied in by hand
```

## Content model

Projects (`src/content/projects/<slug>/index.md`):

```yaml
title: "Slick Bets: an NBA prediction model"
summary: "One sentence shown on cards and in share previews."
status: Live | Shipped | Prototype | Concept | Retired
type: Work | Personal
year: 2026
stack: [Python, Streamlit]
tags: [sports, data]           # only: ai-building, internal-tools, sports, data, product
featured: 2                    # homepage order; omit to show only on /work
cover: ./cover.png             # optional; Work projects may use a diagram component instead
proof: "71.5% of winners picked correctly"   # the one proof line on the homepage row
proofNote: "648 games, each prediction locked in before tip-off"
repo: https://...              # optional
demo: https://...              # optional
```

Every project page body uses these sections in this order: The problem, What I built, How I built it, Outcome, What I learned.

Writing (`src/content/writing/<slug>.md`): `title`, `date`, `summary`, `tags`, and an optional `project` slug that links back to a project.

### Adding a project

1. Create `src/content/projects/<slug>/index.md` with the frontmatter above and the five sections.
2. Put screenshots in the same folder.
3. Run `npm run build` and `npm run lint:copy`, then look at `/work/<slug>` locally.

Nothing else should need to change. If adding a project requires editing a page or component, fix the template so the next one doesn't.

## Design system

The approved design is "Workbench" with a navy accent. The full spec is in `docs/design-spec.md`, and `docs/reference/workbench.html` is the approved mockup. Match it.

- **Light only.** There is no dark mode and no dark section with light text. This was Spencer's explicit call because dark sections look AI-generated to him.
- **Tokens:** `--bg #fafaf9`, `--tint #f2f3f1`, `--fg #18191b`, `--muted #5b5f66`, `--rule #e4e5e2`, `--accent #2148b8` (navy, the only accent), `--accent-ink #fafaf9`, with shadows tinted from `rgb(24 40 80)`. Never use pure `#000` or `#fff`.
- **Type:** Geist for everything, and Geist Mono only for pills, chips, the email address and captions. No serif.
- **Shape:** 999px pills and buttons, 14px frames and cards, 34px phone frame.
- **Screenshots** always sit in a browser frame or a phone frame. Confidential work uses a diagram instead.
- **Motion:** use exactly the motion in the reference page (hero load-in, scroll reveal, hover states) and nothing more until Spencer asks. Keep it restrained and purposeful. Animate only `transform` and `opacity`, use IntersectionObserver for scroll reveals, and wrap all motion in `prefers-reduced-motion: no-preference`.

### Using the taste-skill

Use `.claude/skills/design-taste-frontend/SKILL.md` for any visual work. It was reviewed for safety on 2026-10-02 and copied in by hand. Do not install or update it with `npx skills add`, because that pulls in unreviewed changes. These project rules override the skill where they conflict:

- Light only, even though the skill asks for dark mode.
- Fonts are Geist and Geist Mono, as decided above.
- Astro and plain CSS, not the skill's framework defaults.
- The skill's 20- and 25-word caps apply to the hero subtext only. Body copy follows the voice rules below.

## Copy rules

These apply to every word on the site, including alt text and share text.

- **Write full, plain, flowing sentences.** Never use short punchy fragments or slogan triplets like "Scope it. Build it. Ship it." Spencer finds them AI-sounding.
- **No em-dashes (—) or en-dashes (–).** Use a comma, a colon, parentheses or a new sentence. Write ranges as "2017 to 2020".
- Write in first person, in Spencer's voice: direct, honest, and specific.
- **Never inflate.** Every claim must be something Spencer can defend in an interview. If you are unsure, leave it out and ask him. Label prototypes and retired projects plainly.
- Lead with building and product judgment, not coordination. Being AI-built is a strength to state openly.
- Do not present Spencer as a security expert.
- The job-search line on About stays direct.
- Do not change the approved copy in the content files without Spencer's OK. Fixing a typo is fine.

## Confidentiality rules

- Nothing confidential from any employer: no internal tool names, people's names, ticket numbers, internal URLs, dollar figures, unconfirmed metrics, internal screenshots or data.
- **The support-content case study never names Block or its brands (Square, Cash App, Afterpay).** It says "a leading fintech." Block may be named on About and the résumé. Public vendor names (Zendesk, Salesforce Knowledge, Contentful, Bloomfire) are fine.
- **Credit:** Spencer led the content migration only. A product manager led the broader CRM migration. Copy must credit her role and must never imply Spencer led it.
- The phone number never appears anywhere on the site, including `resume.pdf`.

## Checks before every commit

1. `npm run build` passes.
2. `npm run check` passes.
3. `npm run lint:copy` passes. It scans `src/` and the text of `public/resume.pdf` for:
   - em-dashes and en-dashes
   - anything that looks like a phone number
   - "Block", "Square", "Cash App" or "Afterpay" inside `src/content/projects/support-content-hub/`
4. Look at the changed pages at phone width (375px) and desktop width. There should be no sideways scrolling.

## Deploys

Pushing to `main` deploys to production through Cloudflare Pages, and every other branch gets a preview link. Spencer reviews a preview before anything merges to `main`. Never push straight to `main` unless Spencer asks you to.

## Don't

- Don't add a CMS, a database, login, comments, a newsletter, cookies or tracking beyond Cloudflare Web Analytics.
- Don't add tag pages or project filters until there are about 8 or more projects.
- Don't show the Writing link until a post exists.
- Don't commit anything from Spencer's employers' internal documents.
