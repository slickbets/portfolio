// Share images (1200x630) in the Workbench style, drawn at build time with satori and resvg.
// One for the homepage (/og/home.png) and one per project (/og/<slug>.png), so a new project
// gets its own image automatically. Other pages use the homepage image.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

interface Props {
  title: string;
  summary: string;
}

export const getStaticPaths = (async () => {
  const projects = await getCollection('projects');
  return [
    {
      params: { slug: 'home' },
      props: {
        title: "I'm Spencer. I build software by directing AI, and I ship it.",
        summary: 'A technical program manager who builds working software with Claude Code and makes the product calls along the way.',
      },
    },
    ...projects.map((project) => ({
      params: { slug: project.id },
      props: { title: project.data.title, summary: project.data.summary },
    })),
  ];
}) satisfies GetStaticPaths;

// Satori cannot read variable or woff2 fonts, so it uses the static Geist files.
const require = createRequire(import.meta.url);
const geist = (weight: number) => readFile(require.resolve(`@fontsource/geist/files/geist-latin-${weight}-normal.woff`));
const fonts = Promise.all([geist(400), geist(600)]);

// The same tokens as src/styles/global.css.
const color = { bg: '#fafaf9', fg: '#18191b', muted: '#5b5f66', rule: '#e4e5e2', accent: '#2148b8' };

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

export const GET: APIRoute<Props> = async ({ props }) => {
  const [regular, semibold] = await fonts;

  const card = el(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '68px 80px 76px',
      background: color.bg,
      fontFamily: 'Geist',
      position: 'relative',
    },
    [
      el('div', { fontSize: 30, fontWeight: 600, color: color.fg }, 'Spencer Solomon'),
      el('div', { display: 'flex', flexDirection: 'column', gap: 24 }, [
        el('div', { fontSize: 62, fontWeight: 600, lineHeight: 1.08, letterSpacing: -1.5, color: color.fg, maxWidth: 1000, lineClamp: 3 }, props.title),
        el('div', { fontSize: 27, lineHeight: 1.4, color: color.muted, maxWidth: 980, lineClamp: 3 }, props.summary),
      ]),
      el('div', { fontSize: 22, color: color.muted }, 'spencerwsolomon.com'),
      el('div', { position: 'absolute', left: 0, right: 0, bottom: 0, height: 14, background: color.accent }),
    ],
  );

  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', data: regular, weight: 400, style: 'normal' },
      { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
