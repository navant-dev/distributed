import { writeFile } from "node:fs/promises";

const areas = {
  "distributed-systems": {
    topics: ["T10772", "T10715"],
    terms: /distributed|consensus|byzantine|fault.?toler|replicat|cluster|serverless|microservice|checkpoint|rdma|disaggregat|coordination|decentral|network|stream processing/i,
  },
  "cloud-computing": {
    topics: ["T10101", "T14067"],
    terms: /cloud|serverless|data.?cent|resource|schedul|virtual machine|container|kubernetes|edge|network|inference|training|workload|accelerator/i,
  },
  databases: {
    topics: ["T10317"],
    terms: /database|query|sql|transaction|index|join|analytics|warehouse|redshift|hana|optimizer|data system|lakehouse|vector|relational/i,
  },
  "storage-systems": {
    topics: ["T11181"],
    terms: /storage|file.?system|ssd|nvme|flash|memory|cxl|cache|tier|i\/o|checkpoint|data.?cent|disaggregat|compression|dram/i,
  },
  "artificial-intelligence": {
    topics: ["T10320", "T10181"],
    terms: /language model|\bllm\b|transformer|retrieval|\brag\b|multimodal|diffusion|foundation model|reasoning|vision.language|text.to|generative|neural|agent/i,
  },
};

const knownIndustry = /\b(?:Amazon|AWS|Google|Microsoft|Meta Platforms|Facebook|Alibaba|Tencent|Huawei|ByteDance|IBM|Intel|NVIDIA|Samsung|Oracle|Databricks|Snowflake|Adobe|Baidu|Cisco|SAP|Apple|DeepSeek|Anthropic|OpenAI|Netflix|Uber|LinkedIn|Salesforce|Red Hat|VMware|Broadcom|Arm Holdings|Advanced Micro Devices|SK Group|Korea Telecom|Deutsche Telekom|Ericsson|Nokia|Bosch|Ant Group|PingCAP|ZTE|Hewlett Packard|Dell|AT&T|Cloudflare)\b/i;
const trustedVenue = /ACM|IEEE|USENIX|VLDB|SIGMOD|NeurIPS|ICML|ICLR|AAAI|EuroSys|SOSP|NSDI|OSDI|FAST|arXiv|Nature Communications|Communications of the ACM|Proceedings of Machine Learning Research/i;
const rejectedVenue = /Innovative Science|Applied and Computational Engineering|Zenodo|Research Square|Scientific Reports/i;

const rebuildAbstract = (index) => {
  if (!index) return "";
  const words = [];
  for (const [word, positions] of Object.entries(index)) for (const position of positions) words[position] = word;
  return words.join(" ").replace(/\s+([,.;:!?])/g, "$1");
};

const compactSummary = (abstract) => {
  const clean = abstract.replace(/\s+/g, " ").trim();
  const sentences = clean.match(/[^.!?]+[.!?]+/g) ?? [clean];
  const summary = sentences.slice(0, 2).join(" ").trim();
  return summary.length <= 360 ? summary : `${summary.slice(0, 357).replace(/\s+\S*$/, "")}…`;
};

const plainText = (value) => value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

const topicTags = (area, title) => {
  const candidates = [
    "consensus", "fault tolerance", "replication", "serverless", "microservices", "RDMA", "cloud", "scheduling",
    "edge", "Kubernetes", "database", "query optimization", "transactions", "indexing", "analytics", "storage",
    "CXL", "SSD", "caching", "checkpointing", "LLM", "retrieval", "multimodal", "reasoning", "agents", "diffusion",
  ];
  const aliases = { "fault tolerance": /fault/i, "query optimization": /query|optimizer/i, checkpointing: /checkpoint/i, indexing: /index/i, transactions: /transaction/i, caching: /cache/i, retrieval: /retriev|\bRAG\b/i, agents: /agent/i };
  const matched = candidates.filter((tag) => (aliases[tag] ?? new RegExp(tag, "i")).test(title));
  const fallback = area.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  return [...new Set([fallback, ...matched])].slice(0, 4);
};

const api = async (area, topic) => {
  const filter = [`topics.id:${topic}`, "from_publication_date:2024-01-01", "to_publication_date:2026-12-31", "authorships.institutions.type:company", "has_abstract:true", "is_retracted:false"].join(",");
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("filter", filter);
  url.searchParams.set("sort", "cited_by_count:desc");
  url.searchParams.set("per-page", "200");
  url.searchParams.set("mailto", "research@navant.dev");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${area}: OpenAlex returned ${response.status}`);
  return (await response.json()).results;
};

const records = [];
for (const [area, config] of Object.entries(areas)) {
  const works = (await Promise.all(config.topics.map((topic) => api(area, topic)))).flat();
  const seen = new Set();
  const ranked = works.filter((work) => {
    const title = work.title ?? "";
    const venue = work.primary_location?.source?.display_name ?? "";
    const companies = work.authorships.flatMap((authorship) => authorship.institutions).filter((institution) => institution.type === "company" && knownIndustry.test(institution.display_name));
    const key = title.toLowerCase().replace(/\W/g, "");
    if (!title || seen.has(key) || !config.terms.test(title) || companies.length === 0) return false;
    if (rejectedVenue.test(venue) || (!trustedVenue.test(venue) && work.cited_by_count < 10)) return false;
    if (!work.doi && !work.best_oa_location?.landing_page_url) return false;
    seen.add(key);
    work._companies = [...new Set(companies.map((company) => company.display_name))];
    work._venue = venue || "Open-access preprint";
    return true;
  }).sort((a, b) => {
    const venueA = trustedVenue.test(a._venue) ? 30 : 0;
    const venueB = trustedVenue.test(b._venue) ? 30 : 0;
    return (venueB + Math.log2(b.cited_by_count + 1) * 12 + b.publication_year) - (venueA + Math.log2(a.cited_by_count + 1) * 12 + a.publication_year);
  }).slice(0, 25);

  if (ranked.length < 25) throw new Error(`${area}: only ${ranked.length} qualifying papers`);
  for (const work of ranked) {
    const authors = work.authorships.map((item) => item.author.display_name).filter(Boolean);
    const landing = work.doi ?? work.best_oa_location?.landing_page_url ?? work.primary_location?.landing_page_url;
    const paper = work.best_oa_location?.pdf_url ?? work.best_oa_location?.landing_page_url ?? landing;
    records.push({
      area,
      year: work.publication_year,
      title: plainText(work.title),
      authors: `${authors.slice(0, 5).join(" · ")}${authors.length > 5 ? " · et al." : ""}`,
      published: work.publication_date,
      summary: compactSummary(rebuildAbstract(work.abstract_inverted_index)),
      topics: topicTags(area, work.title),
      abstractUrl: landing,
      paperUrl: paper,
      source: work._venue,
      industry: work._companies,
      citations: work.cited_by_count,
    });
  }
}

const header = `// Generated by scripts/update-industry-research.mjs from OpenAlex metadata.\n// Curated to recent, relevant work with recognized company affiliations and reputable publication sources.\nimport type { ResearchPaper } from "./research-papers";\n\n`;
const body = `export const industryResearchPapers = ${JSON.stringify(records, null, 2)} satisfies ResearchPaper[];\n`;
await writeFile(new URL("../src/data/industry-research-papers.ts", import.meta.url), header + body);

for (const area of Object.keys(areas)) {
  const papers = records.filter((paper) => paper.area === area);
  console.log(`${area}: ${papers.length} papers; ${new Set(papers.flatMap((paper) => paper.industry)).size} companies`);
}
