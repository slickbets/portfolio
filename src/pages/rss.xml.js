// RSS feed for the writing collection. It is empty until the first post is published.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('writing')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: 'Spencer Solomon: Writing',
    description: 'Notes from Spencer Solomon on building software by directing AI, and the product calls along the way.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/writing/${post.id}`,
    })),
  });
}
