import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { sitePath } from "@/utils/paths";

export const GET: APIRoute = async () => {
  const topics = await getCollection("topics");
  const index = topics.map((topic) => ({
    title: topic.data.title,
    description: topic.data.description,
    category: topic.data.category,
    tags: topic.data.tags,
    summary: (topic.body ?? "").replace(/<[^>]+>|[#*_`\[\]()]/g, " ").replace(/\s+/g, " ").trim().slice(0, 360),
    url: sitePath(`/topics/${topic.id}/`),
  }));
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
