# Garden redesign plan

Goal: move the live site from the light "Workbench" look to the "Midnight Garden" look from mockup K (`docs/redesign/k-wheel-garden.html`), without losing any approved copy, project pages or checks.

## Decisions

- **Palette (Midnight Garden).** Deep green and navy backgrounds, warm paper text, and one soft accent per project: jade `#8CC5A8`, powder blue `#B4C3E4`, peach `#F0B79C`. Ink `#0C1F1E`, paper `#F3EDDC`.
- **Fonts.** Big Shoulders Display for headlines, Instrument Serif italic for one accent phrase, Instrument Sans for body, Geist Mono for tags and labels. All self-hosted with `@fontsource` packages.
- **Project colors live with the project.** Each project can set an optional `theme` (accent, bg, bg2, glow) in its frontmatter. Without one, projects take the next Garden preset in homepage order, so adding a project is still one file.
- **Cards use real images.** The mockup drew its card art by hand. On the real site each card shows the project's own `cover` screenshot (or the support-content diagram) on its accent color, so nothing illustrative or invented appears.
- **Copy is not changed.** The headline, hero line, Work intro, About text and contact copy are the live words. New copy from the mockup (the hero status chip, the About chapters with photos, the Experience blurbs, the new About heading) is left out until Spencer approves it.

## Steps

1. Branch `design/garden-redesign` from `main`.
2. Commit the design-rule changes to `CLAUDE.md` and the taste-skill removal.
3. Commit the mockups, the palette pages and this plan under `docs/`.
4. Add the fonts and swap the global tokens in `src/styles/global.css` (dark theme, new type, aura background, grain).
5. Rework `Base.astro`: new header (badge, pill nav, résumé pill), new footer, per-page theme, scroll reveal, theme-color.
6. Add the optional `theme` field to `content.config.ts` and a small `src/lib/themes.ts` with the presets.
7. Rebuild the homepage: animated headline, stack strip (built from the projects' real stacks), the project wheel, and the contact card.
8. Restyle the shared components (frames, stats, diagram, status pill, email row) so they work on the dark theme.
9. Restyle Work, project pages, About (Experience as a company-left list using the existing role lines) and 404. Project pages take their project's colors.
10. Redraw the share images in the new palette and fonts.
11. Run `npm run build`, `npm run check` and `npm run lint:copy`, then look at every page at 375px and 1440px.
12. Push the branch and open a draft PR. Nothing merges to `main` until Spencer reviews the preview.

## Not in this PR

- Photo chapters on About (needs photos and approved copy).
- Experience blurbs and the new About heading.
- Looping project videos.
- The optional phone-screen piece.
