// Share images (1200x630) in the Midnight Garden style, drawn at build time with satori and resvg.
// One for the homepage (/og/home.png) and one per project (/og/<slug>.png), so a new project
// gets its own image automatically. Other pages use the homepage image.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { baseTheme, themeAt, type Theme } from '../../lib/themes';

interface Props {
  title: string;
  summary: string;
  theme: Theme;
}

export const getStaticPaths = (async () => {
  // Same order as the project pages, so each image wears the same colors as its page.
  const projects = (await getCollection('projects')).sort(
    (a, b) => (a.data.featured ?? Infinity) - (b.data.featured ?? Infinity) || a.data.title.localeCompare(b.data.title),
  );
  return [
    {
      params: { slug: 'home' },
      props: {
        title: 'Built with AI. Shipped to real users.',
        summary: 'Work tools and personal products I built with AI and put in front of real users.',
        theme: baseTheme,
      },
    },
    ...projects.map((project, i) => ({
      params: { slug: project.id },
      props: { title: project.data.title, summary: project.data.summary, theme: themeAt(i, project.data.theme) },
    })),
  ];
}) satisfies GetStaticPaths;

// Satori cannot read variable or woff2 fonts, so it uses the static font files.
const require = createRequire(import.meta.url);
const file = (pkg: string, name: string) => readFile(require.resolve(`@fontsource/${pkg}/files/${name}.woff`));
const fonts = Promise.all([
  file('big-shoulders-display', 'big-shoulders-display-latin-900-normal'),
  file('instrument-sans', 'instrument-sans-latin-400-normal'),
  file('instrument-sans', 'instrument-sans-latin-600-normal'),
]);

// The paper and ink colors from src/styles/global.css. Each image takes its project's accent and background.
const color = { cream: '#F3EDDC', ink: '#0C1F1E', muted: '#B5C2B6' };

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

export const GET: APIRoute<Props> = async ({ props }) => {
  const [display, regular, semibold] = await fonts;
  const { theme } = props;

  const card = el(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 80px 76px',
      background: theme.bg,
      backgroundImage: `radial-gradient(900px 600px at 0% 0%, ${theme.glow}99, ${theme.bg}00)`,
      fontFamily: 'Instrument Sans',
      position: 'relative',
    },
    [
      el('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
        el('div', { width: 48, height: 48, borderRadius: 14, background: theme.accent, color: color.ink, fontFamily: 'Big Shoulders Display', fontSize: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }, 'S'),
        el('div', { fontFamily: 'Big Shoulders Display', fontSize: 34, color: color.cream, textTransform: 'uppercase', letterSpacing: 1 }, 'Spencer Solomon'),
      ]),
      el('div', { display: 'flex', flexDirection: 'column', gap: 24 }, [
        el('div', { fontFamily: 'Big Shoulders Display', fontSize: 104, lineHeight: 0.92, color: color.cream, textTransform: 'uppercase', maxWidth: 1040, lineClamp: 3 }, props.title),
        el('div', { fontSize: 27, lineHeight: 1.4, color: color.muted, maxWidth: 980, lineClamp: 2 }, props.summary),
      ]),
      el('div', { fontSize: 22, color: theme.accent, fontWeight: 600 }, 'spencerwsolomon.com'),
      el('div', { position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: theme.accent }),
    ],
  );

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Big Shoulders Display', data: display, weight: 900, style: 'normal' },
      { name: 'Instrument Sans', data: regular, weight: 400, style: 'normal' },
      { name: 'Instrument Sans', data: semibold, weight: 600, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
