// Turns a project's rendered Markdown into the case-study layout:
//   - the first paragraph (bold status line) becomes the lede
//   - a paragraph holding one screenshot becomes a figure in a browser frame
//   - a paragraph holding two screenshots becomes a figure with two phone frames
//   - the italic line right under a screenshot is its caption
//   - any other italic-only paragraph is a side note
//   - screenshots listed in `visuals` are placed as HTML visuals (tables) instead of images
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/content/projects/*/*.{png,jpg,jpeg}', { eager: true });

export type Segment = { html: string } | { visual: string; caption?: string };

const entities: Record<string, string> = { '&quot;': '"', '&#x22;': '"', '&#34;': '"', '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>', '&amp;': '&' };
const decode = (s: string) => s.replace(/&(?:quot|lt|gt|amp|#x22|#34|#x27|#39);/g, (m) => entities[m]);
const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

interface Shot {
  alt: string;
  src: string;
}

const shotsIn = (html: string): Shot[] =>
  [...html.matchAll(/<img [^>]*__ASTRO_IMAGE_="([^"]*)"[^>]*>/g)].map((m) => {
    const data = JSON.parse(decode(m[1]));
    return { alt: data.alt as string, src: data.src as string };
  });

async function img(projectId: string, shot: Shot, width: number) {
  const meta = images[`/src/content/projects/${projectId}/${shot.src.replace(/^\.\//, '')}`]?.default;
  if (!meta) throw new Error(`Case study image not found: ${projectId}/${shot.src}`);
  const out = await getImage({ src: meta, width, format: 'webp' });
  return `<img src="${out.src}" width="${out.attributes.width}" height="${out.attributes.height}" alt="${escapeAttr(shot.alt)}" loading="lazy" decoding="async" />`;
}

export async function caseStudySegments(html: string, projectId: string, visuals: Record<string, unknown>): Promise<Segment[]> {
  const pending: Segment[] = [];
  const marker = (i: number) => `\u0000${i}\u0000`;

  // Screenshot paragraphs, with the caption paragraph that may follow.
  const figures = [...html.matchAll(/<p>((?:<img [^>]*>\s*)+)<\/p>\s*(?:<p><em>([\s\S]*?)<\/em><\/p>)?/g)];
  let out = '';
  let last = 0;
  for (const m of figures) {
    const [whole, imgs, caption] = m;
    const shots = shotsIn(imgs);
    const cap = caption ? `<figcaption>${caption}</figcaption>` : '';
    let replacement: string;
    const name = shots[0]?.src.replace(/^\.\//, '');
    if (shots.length === 1 && name in visuals) {
      pending.push({ visual: name, caption });
      replacement = marker(pending.length - 1);
    } else if (shots.length === 2) {
      const phones = (await Promise.all(shots.map((s) => img(projectId, s, 520)))).map((tag) => `<div class="phone">${tag}</div>`).join('');
      replacement = `<figure class="fig fig-phones rv"><div class="phones">${phones}</div>${cap}</figure>`;
    } else {
      const tag = await img(projectId, shots[0], 1600);
      replacement = `<figure class="fig rv"><div class="browser"><span class="browser-bar" aria-hidden="true"><i></i><i></i><i></i></span>${tag}</div>${cap}</figure>`;
    }
    out += html.slice(last, m.index) + replacement;
    last = m.index! + whole.length;
  }
  out += html.slice(last);

  // Italic-only paragraphs that are not captions are side notes ("Stack, for the curious").
  out = out.replace(/<p><em>([\s\S]*?)<\/em><\/p>/g, '<p class="aside-note">$1</p>');
  // The first paragraph, which starts with the bold status, is the lede.
  out = out.replace(/^\s*<p>(<strong>)/, '<p class="lede-p">$1');

  // Splitting on a capturing group puts the marker numbers at the odd positions.
  const segments: Segment[] = [];
  out.split(/\u0000(\d+)\u0000/).forEach((part, i) => {
    if (i % 2) segments.push(pending[Number(part)]);
    else if (part.trim()) segments.push({ html: part });
  });
  return segments;
}
