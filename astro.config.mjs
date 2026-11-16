// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { cp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HOLDING } from './src/lib/site.ts';

const root = fileURLToPath(new URL('.', import.meta.url));

// Old full-site URLs 301 to the homepage while the holding page is up.
// Exact rules first, then the splat. Both slash forms and the built .html files.
// Cloudflare Workers static assets always apply _redirects, even if a matching file exists.
// https://developers.cloudflare.com/workers/static-assets/redirects/
const HOLDING_REDIRECTS = `# Holding page: old full-site URLs go home. This file is written at build time when HOLDING is true.
/about / 301
/about/ / 301
/about.html / 301
/work / 301
/work/ / 301
/work.html / 301
/resume.pdf / 301
/resume.PDF / 301
/resume.pdf/ / 301
/work/* / 301
`;

/** @returns {import('astro').AstroIntegration} */
function holdingIntegration() {
  return {
    name: 'holding-page',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        if (HOLDING) {
          await rm(join(dist, 'about.html'), { force: true });
          await rm(join(dist, 'work.html'), { force: true });
          await rm(join(dist, 'work'), { recursive: true, force: true });
          await writeFile(join(dist, '_redirects'), HOLDING_REDIRECTS);
          logger.info('Holding page: removed about/work from dist and wrote _redirects.');
        } else {
          await cp(join(root, 'assets-hidden', 'resume.pdf'), join(dist, 'resume.pdf'));
          logger.info('Full site: copied assets-hidden/resume.pdf into dist.');
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://spencerwsolomon.com',
  // Pages are built as /about.html rather than /about/index.html, so every URL is written without a
  // trailing slash (/about, /work/slick-bets). That matches the site's links and canonical URLs, and
  // Cloudflare serves them without a redirect.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      filter: (page) => {
        if (!HOLDING) return true;
        return new URL(page).pathname === '/';
      },
    }),
    holdingIntegration(),
  ],
});
