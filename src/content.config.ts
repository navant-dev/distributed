import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const topics = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/topics" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["Foundations", "Consistency", "Replication", "Consensus", "Partitioning", "Transactions", "Storage", "Messaging", "Reliability", "Architecture"]),
    order: z.number().int().positive(),
    difficulty: z.enum(["fundamental", "intermediate", "advanced"]),
    readingTime: z.number().int().positive(),
    tags: z.array(z.string()).min(1),
    related: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    diagram: z.enum(["fundamentals", "cap", "pacelc", "consistency", "quorum", "replication", "raft", "hash-ring", "two-phase", "lsm", "distributed-log", "resilience"]),
    mentalModel: z.string(),
    remember: z.string(),
  }),
});

export const collections = { topics };
