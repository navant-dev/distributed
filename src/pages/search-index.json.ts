import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { sitePath } from "@/utils/paths";
import { systemDesigns } from "@/data/system-designs";
import { researchPapers, researchAreas } from "@/data/research-papers";

export const GET: APIRoute = async () => {
  const topics = await getCollection("topics");
  const index: Array<{ title: string; description: string; category: string; tags: string[]; summary: string; url: string }> = topics.map((topic) => ({
    title: topic.data.title,
    description: topic.data.description,
    category: topic.data.category,
    tags: topic.data.tags,
    summary: (topic.body ?? "").replace(/<[^>]+>|[#*_`\[\]()]/g, " ").replace(/\s+/g, " ").trim().slice(0, 360),
    url: sitePath(`/topics/${topic.id}/`),
  }));
  index.push({
    title: "Interview Prep",
    description: "Practice distributed-systems questions by difficulty, category, and failure scenario.",
    category: "Practice",
    tags: ["interview", "scenarios", "system design"],
    summary: "Question bank with revealable answers for fundamental, intermediate, senior, Staff+, and manager interviews.",
    url: sitePath("/interview/"),
  });
  index.push({
    title: "Distributed Systems Cheatsheets",
    description: "Eight printable decision guides spanning the complete learning roadmap.",
    category: "Reference",
    tags: ["cheatsheets", "printable", "decision guide"],
    summary: "Consistency, consensus, partitioning, transactions, storage, messaging, reliability, and multi-region rules of thumb.",
    url: sitePath("/cheatsheets/"),
  });
  systemDesigns.forEach((design) => index.push({
    title: design.title,
    description: design.description,
    category: "System Design",
    tags: design.concepts.map((concept) => concept.label),
    summary: [...design.coreFlow, ...design.components.map((component) => component.responsibility), ...design.failures.map((failure) => `${failure.scenario} ${failure.response}`)].join(" "),
    url: sitePath(`/system-designs/${design.slug}/`),
  }));
  researchPapers.forEach((paper) => index.push({
    title: paper.title,
    description: paper.summary,
    category: `${paper.year} Research`,
    tags: paper.topics,
    summary: `${paper.authors} ${researchAreas.find((area)=>area.id===paper.area)?.name || "Research"}`,
    url: sitePath(`/research/${paper.area}/`),
  }));
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
