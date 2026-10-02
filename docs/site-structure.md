# Phase 3: Site structure (FINAL, approved by Spencer 2026-10-02; "How I build" strip removed in Phase 4 because Spencer found it too AI-sounding)

## Sitemap

| Page | URL | What's on it |
|---|---|---|
| Home | `/` | Intro, featured projects, latest writing (once there is some), contact line |
| Work | `/work` | Every project as a card, newest first |
| Project page | `/work/<slug>` | One case study each |
| Writing | `/writing` | Shorter posts: lessons, how-I-built-it notes (**hidden from the menu until the first post exists**) |
| Post | `/writing/<slug>` | One post each |
| About | `/about` | Bio, web résumé, contact, résumé PDF download |
| — | `/resume.pdf` | Résumé without the phone number |
| — | `/rss.xml`, 404 page | Feed for writing; a simple not-found page |

The menu has **Work · About**, plus **Writing** once a post exists. Every page footer has your email, LinkedIn and GitHub.

**Picks:**
- **About, résumé and contact are one page.** Three thin pages are worse than one good one, and a recruiter gets everything in one click.
- **Writing stays hidden until it has a post.** An empty "Writing" link reads as abandoned. A strong first post is the AI leadership briefing story.

## Homepage, top to bottom

1. **Intro.** The Option A headline and paragraph, with two buttons: "See my work" and "Résumé."
2. **Featured work.** Three large cards in this order:
   1. Support content migration (work, real users, strongest proof)
   2. Slick Bets (measured result)
   3. Auction draft room (process and judgment)

   Each card shows a screenshot or diagram, the title, the one-line summary, a status badge and the type (Work/Personal).
3. **Latest writing.** Up to three posts. It only appears once posts exist.
4. **Contact line.** "Hiring for product, program or builder roles? Email me." with the address.

## Project page layout

This is the fixed Phase 2 format, the same on every page:
- **Header:** title, one-line summary, status badge, type, year, stack chips, and links (repo/demo) when they exist
- **Hero image:** screenshot, or a diagram for confidential work
- **Sections:** The problem → What I built → How I built it → Outcome → What I learned
- **Footer:** next project, back to Work

## Content model

These fields are what makes "add a project = add one file" work.

**Projects:** one Markdown file per project in `src/content/projects/`, with images in a matching folder.

```yaml
title: "Slick Bets: an NBA prediction model"
summary: "One line, shown on cards"
status: Live | Shipped | Prototype | Concept | Retired
type: Work | Personal
year: 2026
stack: [Python, Streamlit, ...]
tags: [sports, data]
featured: 2          # homepage order; leave out to show only on /work
cover: ./cover.png
repo: https://...    # optional
demo: https://...    # optional
```

I added **Shipped** to your status list. It means the project went to production, but you no longer run it, which is the case for the support-content work.

**Writing:** one Markdown file per post in `src/content/writing/`.

```yaml
title: "..."
date: 2026-10-15
summary: "One line"
tags: [ai-building]
project: slick-bets   # optional link back to a project
```

## Projects vs. writing

- **A project** is something you built, with a status. It always uses the full case-study format.
- **A post** is shorter and looser: a lesson, a how-I-did-it, an opinion, or an update on a project. No fixed format. Good fits: the leadership briefing, "how I direct Claude Code," the RAG prototype while it's still a learning project, and brainstorms for your next tool.

## Tags

A small fixed set, so they stay useful: **ai-building, internal-tools, sports, data, product.** Tags show on cards and posts. There are no tag pages until there are enough items to fill them (around 8 or more).

## What's deliberately left out

No blog-style home page, no project filters (with 3 projects they add nothing), no comments, no newsletter, no dark-mode toggle decision yet (that's Phase 4).
