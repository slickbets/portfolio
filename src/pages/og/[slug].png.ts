// Share images (1200x630) in the pastel style, drawn at build time with satori and resvg.
// One for the homepage (/og/home.png) and one per project (/og/<slug>.png), so a new project
// gets its own image automatically. Other pages use the homepage image.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { orderedProjects, type FieldColor } from '../../lib/projects';
import { HOLDING } from '../../lib/site';

// The palette from src/styles/global.css.
const palette = { peach: '#F6D9C8', surface: '#FFF3EA', ink: '#2A1C16', muted: '#7A5C4E', coral: '#FF7A62', mint: '#5ED0B0' } satisfies Record<'peach' | 'surface' | 'ink' | 'muted' | FieldColor, string>;

interface Props {
  title: string;
  summary: string;
  /** The accent stripe: the project's color field, or coral for the homepage. */
  accent: string;
}

export const getStaticPaths = (async () => {
  // Same order as the project pages, so each image wears the same color as its page.
  const projects = await orderedProjects();
  return [
    {
      params: { slug: 'home' },
      props: {
        title: 'From the roadmap to the repo.',
        summary: HOLDING
          ? 'Spencer Solomon, a PM who builds.'
          : "I'm Spencer, a PM who builds.",
        accent: palette.coral,
      },
    },
    ...(HOLDING
      ? []
      : projects.map(({ project, color }) => ({
          params: { slug: project.id },
          props: { title: project.data.title, summary: project.data.summary, accent: color === 'peach' ? palette.ink : palette[color] },
        }))),
  ];
}) satisfies GetStaticPaths;

// Satori cannot read variable or woff2 fonts, so it uses the static font files.
const require = createRequire(import.meta.url);
const file = (pkg: string, name: string) => readFile(require.resolve(`@fontsource/${pkg}/files/${name}.woff`));
const fonts = Promise.all([
  file('plus-jakarta-sans', 'plus-jakarta-sans-latin-800-normal'),
  file('plus-jakarta-sans', 'plus-jakarta-sans-latin-700-normal'),
  file('dm-sans', 'dm-sans-latin-400-normal'),
]);

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

export const GET: APIRoute<Props> = async ({ props }) => {
  const [display, bold, regular] = await fonts;
  const { accent } = props;

  const card = el(
    'div',
    {
      // Satori 0.63+ defaults to content-box, which would add the padding outside the 1200x630 canvas.
      boxSizing: 'border-box',
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 80px 76px',
      background: palette.peach,
      fontFamily: 'DM Sans',
      position: 'relative',
    },
    [
      el('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
        el('div', { width: 48, height: 48, borderRadius: 14, background: palette.coral, color: palette.ink, fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }, 'S'),
        el('div', { fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 30, color: palette.ink }, 'Spencer Solomon'),
      ]),
      el('div', { display: 'flex', flexDirection: 'column', gap: 24 }, [
        el('div', { fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 70, lineHeight: 1.08, color: palette.ink, maxWidth: 1040, lineClamp: 3 }, props.title),
        el('div', { fontSize: 27, lineHeight: 1.4, color: palette.muted, maxWidth: 980, lineClamp: 3 }, props.summary),
      ]),
      el('div', { fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 22, color: palette.ink }, 'spencerwsolomon.com'),
      el('div', { position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: accent }),
    ],
  );

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Plus Jakarta Sans', data: display, weight: 800, style: 'normal' },
      { name: 'Plus Jakarta Sans', data: bold, weight: 700, style: 'normal' },
      { name: 'DM Sans', data: regular, weight: 400, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
