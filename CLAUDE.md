# CLAUDE.md

This repo is Spencer Solomon's portfolio site. It supports his search for product, technical program and builder roles, and it is his long-term public home for projects and writing. Spencer builds by directing Claude Code and is not a hand-coder, so explain changes in plain language, make concrete choices instead of offering lists of options, and keep the site simple enough that adding a project takes one file.

## Stack

- Astro, fully static output. No server code, database, login or CMS.
- Content is Markdown or MDX in Astro content collections.
- Styling and fonts are open (see Design direction). Use whatever serves the design.
- Hosting is Cloudflare Workers with static assets (Cloudflare's current recommendation for static Astro sites), built by Workers Builds from the `main` branch on GitHub. Settings are in `wrangler.jsonc`, and the Node version is in `.node-version`. Analytics is Cloudflare Web Analytics, which sets no cookies.
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
    og/[slug].png.ts             share images (1200x630), drawn at build time for home and each project
  styles/global.css              design tokens and base styles
public/
  resume.pdf                     résumé with no phone number
  robots.txt                     points to the sitemap
scripts/check-copy.mjs           the copy check behind npm run lint:copy
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
coverAlt: "What the screenshot shows"   # required whenever cover is set
proof: "71.5% of winners picked correctly"   # the one proof line on the homepage row
proofNote: "648 games, each prediction locked in before tip-off"
repo: https://...              # optional
demo: https://...              # optional
```

Every project page body uses these sections in this order: The problem, What I built, How I built it, Outcome, What I learned.

A project that was stopped may call its Outcome section "Why I stopped".

Repo and demo links live in the facts row at the top of the page, so the body never ends with a separate Links section.

Writing (`src/content/writing/<slug>.md`): `title`, `date`, `summary`, `tags`, and an optional `project` slug that links back to a project.

### Adding a project

1. Create `src/content/projects/<slug>/index.md` with the frontmatter above and the five sections.
2. Put screenshots in the same folder.
3. Run `npm run build` and `npm run lint:copy`, then look at `/work/<slug>` locally.

Nothing else should need to change. If adding a project requires editing a page or component, fix the template so the next one doesn't.

## Design direction

The visual design is an open experiment, and Spencer has removed the earlier design restrictions (the "Workbench" spec, light-only, the navy accent, Geist-only type, pill and frame shapes, and the restrained-motion rule). Treat `docs/design-spec.md` and `docs/reference/workbench.html` as history, not rules.

- Spencer's own reactions are the bar. He will say what he likes and what he hates, and that overrides any default taste.
- Colors, type, layout, motion, dark or light, and styling tools are all open. Add fonts or packages when the design needs them.
- Keep accessibility basics (readable contrast, `prefers-reduced-motion` respected for non-essential motion) and the no-sideways-scrolling check below.
- Do not use the design-taste-frontend skill. Spencer had it removed on 2026-10-20, and it should not be reinstalled.
- The copy rules below still apply to every word on the site.

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
3. `npm run lint:copy` passes. It scans `src/` for:
   - em-dashes and en-dashes
   - anything that looks like a phone number
   - "Block", "Square", "Cash App" or "Afterpay" inside `src/content/projects/support-content-hub/`

   It scans the text of `public/resume.pdf` for phone numbers only. Dashes are allowed in the PDF.
4. Look at the changed pages at phone width (375px) and desktop width. There should be no sideways scrolling.

## Deploys

Pushing to `main` deploys to production through Cloudflare Workers Builds, and every other branch gets a preview link. Spencer reviews a preview before anything merges to `main`. Never push straight to `main` unless Spencer asks you to.

## Don't

- Don't add a CMS, a database, login, comments, a newsletter, cookies or tracking beyond Cloudflare Web Analytics.
- Don't add tag pages or project filters until there are about 8 or more projects.
- Don't show the Writing link until a post exists.
- Don't commit anything from Spencer's employers' internal documents.
