// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://spencerwsolomon.com',
  // Pages are built as /about.html rather than /about/index.html, so every URL is written without a
  // trailing slash (/about, /work/slick-bets). That matches the site's links and canonical URLs, and
  // Cloudflare serves them without a redirect.
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
});
