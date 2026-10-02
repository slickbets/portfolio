import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

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
