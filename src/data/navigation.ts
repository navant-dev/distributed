import { roadmapStages } from "./roadmap";

export const curriculum = [
  { group: "Start here", items: [{ label: "Learning roadmap", href: "/roadmap/", ready: true }] },
  ...roadmapStages.map((stage) => ({ group: stage.title, items: stage.topics.map((topic) => ({ label: topic.name, href: topic.href, ready: true })) })),
];

export const primaryNav = [
  { label: "Learn", href: "/#featured" },
  { label: "Topics", href: "/topics/" },
  { label: "Roadmap", href: "/roadmap/" },
  { label: "Cheatsheets", href: "/cheatsheets/" },
  { label: "System Designs", href: "/system-designs/" },
  { label: "Scenarios", href: "/scenarios/" },
  { label: "Research", href: "/research/" },
  { label: "Interview Prep", href: "/interview/" },
  { label: "Glossary", href: "/glossary/" },
] as const;
