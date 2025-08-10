import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    readTime: z.string().optional(),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
  }),
});

export const collections = { blog };
