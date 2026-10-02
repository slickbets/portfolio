# Phase 5: Build plan (draft for Spencer's review, 2026-10-02)

You'll build the site on your Mac with Claude Code, one step at a time. Each step ends with something you can see. Paste the prompt for a step into Claude Code, check the result, and commit before moving on.

## Before you start

- **Domain:** done. You bought `spencerwsolomon.com` on Cloudflare (2026-10-02).
- **Hosting:** create a free Cloudflare account. Cloudflare Pages hosts the site for free, and its Web Analytics is free and sets no cookies. The domain can be bought there too.
- **Résumé:** make a copy of your résumé with the phone number removed, export it as a PDF, and name it `resume.pdf`.
- **Files to have on your Mac:** `CLAUDE.md` and `build-plan.md` from `portfolio/build/`, the whole `portfolio/design/` folder, the three case studies, `core-copy.md`, and the screenshots in `portfolio/inventory/assets/`.

## Step 1: Create the repo

Make a new public GitHub repo called `portfolio` under your slickbets account, then run this:

> Create a new Astro project in this folder with the minimal template, TypeScript strict, and npm. Put CLAUDE.md at the root. Copy design-spec.md and the reference folder into docs/. Copy the taste-skill SKILL.md to .claude/skills/design-taste-frontend/SKILL.md. Commit and push to main.

You should see the Astro starter page running at localhost:4321.

## Step 2: Design system and layout

> Read CLAUDE.md and docs/design-spec.md. Set up global.css with the design tokens, self-host Geist and Geist Mono, and build the Base layout with the nav and footer from docs/reference/workbench.html. Add the BrowserFrame, PhoneFrame and StatusPill components. Show them on a temporary /styleguide page.

**Check:** the fonts, colors, frames and pills match the reference page.

## Step 3: Content collections and the project page

> Add the projects and writing collections with the schema in CLAUDE.md, including the proof and proofNote fields. Move the three case studies into src/content/projects/ with their screenshots. Build work/[slug].astro to match the project page in the reference.

The case study files need `proof`, `proofNote`, `tags` and `cover` added to their frontmatter. These are new fields so the homepage rows can be generated from the files. Claude should fill them in from the approved text without changing that text.

On the Slick Bets picks screenshot, crop out rows where the win percentage and the spread disagree (UTA @ WAS, for example).

**Check:** all three project pages read correctly at phone and desktop widths.

## Step 4: Home, Work and About

> Build the homepage to match docs/reference/workbench.html, with the project rows generated from featured projects in order, and the support-content row using a Diagram component. Build /work as a list of every project, newest first. Build /about from core-copy.md, with the bio, web résumé and contact, and add the résumé PDF at public/resume.pdf.

**Check:** the homepage looks like the approved mockup, and the résumé downloads without a phone number.

## Step 5: Motion

> Add the motion from the design spec: the hero load-in cascade, the IntersectionObserver reveal for frames below the first screen, and the hover states. Everything goes under prefers-reduced-motion: no-preference. Don't add any motion beyond what's in docs/reference/workbench.html.

**Check:** turn on "Reduce motion" in macOS settings and confirm the page is fully still.

## Step 6: Copy check script, SEO and share images

> Write scripts/check-copy.mjs as described in CLAUDE.md and add it as npm run lint:copy. Add page titles and descriptions, the sitemap, a canonical URL, a robots.txt, an RSS feed for writing, a 404 page, and a share image for each page in the Workbench style.

**Check:** paste a project link into a LinkedIn post draft and confirm the preview looks right (don't post it).

## Step 7: Deploy

> Walk me through connecting this repo to Cloudflare Pages, adding my custom domain, and turning on Cloudflare Web Analytics.

**Check:** the site loads on your domain over https, and a preview link appears when you push a branch.

## Step 8: Launch check

- Run Lighthouse in Chrome on the home page and one project page. Aim for 95 or higher on every score.
- Read every page out loud once. If you can't defend a sentence in an interview, cut it.
- Click every link, including the résumé, the email, LinkedIn and the two GitHub repos.
- Update your LinkedIn profile and résumé with the site's URL.

## After launch

- **Extra motion:** nothing new is added before launch (Spencer, 2026-10-02). Afterward, a draw-in animation for the support-content diagram is the best candidate for one standout moment.
- **First post:** the AI leadership briefing (about 100 leads submit updates, and a scheduled Claude task writes the summary). The Writing link appears once it's published.
- **Next project:** when your next tool is built, add it as one folder in `src/content/projects/`.
- **RAG prototype:** revisit it when it's finished.
- **Cleanup:** check Fly.io billing for the retired Slick Bets backend.
