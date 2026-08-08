import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const topics = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/topics" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["Consistency", "Consensus", "Partitioning"]),
    order: z.number().int().positive(),
    difficulty: z.enum(["fundamental", "intermediate", "advanced"]),
    readingTime: z.number().int().positive(),
    tags: z.array(z.string()).min(1),
    related: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    diagram: z.enum(["cap", "raft", "hash-ring"]),
    mentalModel: z.string(),
    remember: z.string(),
  }),
});

export const collections = { topics };
