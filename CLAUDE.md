# CLAUDE.md

This repo is Spencer Solomon's portfolio site. It supports his search for product, technical program and builder roles, and it is his long-term public home for projects and writing. Spencer builds by directing Claude Code and is not a hand-coder, so explain changes in plain language, make concrete choices instead of offering lists of options, and keep the site simple enough that adding a project takes one file.

## Stack

- Astro, fully static output. No server code, database, login or CMS.
- Content is Markdown or MDX in Astro content collections.
- Styling is plain CSS with design tokens in `src/styles/global.css`. Fonts are Plus Jakarta Sans and DM Sans, self-hosted through Fontsource.
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
  components/                    Headline, ProjectCard, ProjectVisual, ContactBlock, Arrow, and visuals/ (the HTML versions of project screenshots)
  layouts/Base.astro             head tags, fonts, nav, footer
  pages/
    index.astro                  Home
    work/index.astro             Work list
    work/[slug].astro            Project page
    about.astro                  Bio, experience, contact
    writing/index.astro, writing/[slug].astro, rss.xml.js, 404.astro
    og/[slug].png.ts             share images (1200x630), drawn at build time for home and each project
  styles/global.css              design tokens, base styles, header, hero, homepage sections and contact field
  styles/pages.css               About, Work, case study and 404 styles
  lib/site.ts                    HOLDING flag for the public holding page
  lib/projects.ts                project order, each project's color field and status style
  lib/case-study.ts              turns a case study's Markdown into the figure and phone-frame layout
  scripts/site.js                scroll reveal, header surface, copy-email button
public/
  robots.txt                     points to the sitemap
  _redirects                     /resume.pdf goes to the homepage, always
scripts/check-copy.mjs           the copy check behind npm run lint:copy
src/lib/site.ts                  HOLDING flag: true serves the short public page
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

The live design is a bright pastel one: a peach field (#F6D9C8) with a lighter surface (#FFF3EA), ink (#2A1C16), and coral (#FF7A62) and mint (#5ED0B0) as accent fills, set in Plus Jakarta Sans and DM Sans. Spencer chose it after comparing it with the earlier "Midnight Garden" dark theme, which is gone. `docs/garden-redesign-plan.md`, `docs/design-spec.md` and `docs/reference/workbench.html` are history, not rules.

- Spencer's own reactions are the bar. He will say what he likes and what he hates, and that overrides any default taste.
- The headline "From the roadmap to the repo." has a dark code-lines pill after "roadmap" and a laptop pill after "repo", and no underline.
- Each project takes one of three color fields (mint, coral, peach) by its place in the homepage order. Accent colors are fills, never small text.
- The nav is Work, About, then Contact as the dark pill. There is no résumé link.
- The Slick Bets and Auction Draft screenshots in the case studies are HTML tables built from the real values in the repo screenshots. Use only values that are in the originals.
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
- **The support-content case study names Block but never its brands (Square, Cash App, Afterpay).** Block may also be named on About. Public vendor names (Zendesk, Salesforce Knowledge, Contentful, Bloomfire) are fine.
- **Credit:** Spencer led the content migration only. A product manager led the broader CRM migration. Copy must credit her role and must never imply Spencer led it.
- The phone number never appears anywhere on the site.
- There is no résumé on the site and no résumé PDF in the repo. Spencer keeps role-specific résumés elsewhere and points people to LinkedIn. Do not add a résumé page, link or file without his OK.

## Checks before every commit

1. `npm run build` passes.
2. `npm run check` passes.
3. `npm run lint:copy` passes. It scans `src/` for:
   - em-dashes and en-dashes
   - anything that looks like a phone number
   - "Block", "Square", "Cash App" or "Afterpay" inside `src/content/projects/support-content-hub/`
4. Look at the changed pages at phone width (375px) and desktop width. There should be no sideways scrolling.

## Holding page

While Spencer is job hunting, the public site is a short holding page: his name, the line "From the roadmap to the repo.", his email with a copy button, and a LinkedIn link. The full site stays in the repo.

To turn the holding page on or off, set `HOLDING` in `src/lib/site.ts` and run `npm run build`.

- `HOLDING = true` (current): the homepage uses `src/components/HomeHolding.astro`. `/about`, `/work` and `/work/*` 301 to `/` (the build adds these rules to `dist/_redirects` and removes those pages from `dist`). `/resume.pdf` always 301s to `/`, whether or not the holding page is on, through `public/_redirects`. The sitemap lists only `/`. The branch `full-site-snapshot` points at the last full-site commit on `main` as a restore point.
- `HOLDING = false`: the homepage uses `src/components/HomeFull.astro`, the about and work pages are built as usual. No holding redirects are written.

Flipping the flag is enough to restore the full site.

## Deploys

Pushing to `main` deploys to production through Cloudflare Workers Builds, and every other branch gets a preview link. Spencer reviews a preview before anything merges to `main`. Never push straight to `main` unless Spencer asks you to.

## Don't

- Don't add a CMS, a database, login, comments, a newsletter, cookies or tracking beyond Cloudflare Web Analytics.
- Don't add tag pages or project filters until there are about 8 or more projects.
- Don't show the Writing link until a post exists.
- Don't commit anything from Spencer's employers' internal documents.
