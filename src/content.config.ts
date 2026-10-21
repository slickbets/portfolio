import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a six-digit hex color like #8CC5A8');

const tags = z.enum(['ai-building', 'internal-tools', 'sports', 'data', 'product']);

// One case study per folder: src/content/projects/<slug>/index.md, with its images beside it.
const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      status: z.enum(['Live', 'Shipped', 'Prototype', 'Concept', 'Retired']),
      type: z.enum(['Work', 'Personal']),
      year: z.number().int(),
      stack: z.array(z.string()),
      tags: z.array(tags),
      featured: z.number().int().positive().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      proof: z.string(),
      proofNote: z.string(),
      cardSummary: z.string().optional(),
      // Optional colors for this project's card and page. Without it, see src/lib/themes.ts.
      theme: z.object({ accent: hex, bg: hex, bg2: hex, glow: hex }).optional(),
      // The at-a-glance block under a project title. Each is one plain sentence.
      role: z.string().optional(),
      timeline: z.string().optional(),
      outcome: z.string().optional(),
      stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
      repo: z.url().optional(),
      demo: z.url().optional(),
    })
    .refine((data) => !data.cover || data.coverAlt, {
      message: 'coverAlt is required whenever cover is set',
      path: ['coverAlt'],
    }),
});

const writing = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(tags),
    project: z.string().optional(),
  }),
});

export const collections = { projects, writing };
