import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		tier: z.enum(['featured', 'supporting', 'archive']),
		order: z.number(),
		role: z.string().optional(),
		dateStart: z.string(),
		dateEnd: z.string(),
		metric: z.string().optional(),
		description: z.string(),
		details: z.string().optional(),
		stack: z.array(z.string()),
		links: z.object({
			repo: z.url().optional(),
			demo: z.url().optional(),
		}),
		image: z.string(),
		video: z.string().optional(),
	}),
});

export const collections = { projects };
