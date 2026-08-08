export const curriculum = [
  { group: "Start here", items: [{ label: "Learning roadmap", href: "/roadmap/", ready: true }] },
  {
    group: "Foundations",
    items: [
      { label: "Distributed systems", href: "/#featured", ready: false },
      { label: "CAP theorem", href: "/topics/consistency/cap-theorem/", ready: true },
      { label: "Consistency models", href: "/#featured", ready: false },
      { label: "Time & ordering", href: "/roadmap/#time-ordering", ready: false },
    ],
  },
  {
    group: "Core building blocks",
    items: [
      { label: "Replication", href: "/roadmap/#replication", ready: false },
      { label: "Raft consensus", href: "/topics/consensus/raft/", ready: true },
      { label: "Consistent hashing", href: "/topics/partitioning/consistent-hashing/", ready: true },
      { label: "Transactions", href: "/roadmap/#transactions", ready: false },
    ],
  },
  {
    group: "At scale",
    items: [
      { label: "Data systems", href: "/roadmap/#data-systems", ready: false },
      { label: "Messaging", href: "/roadmap/#messaging", ready: false },
      { label: "Reliability", href: "/roadmap/#reliability", ready: false },
      { label: "Multi-region", href: "/roadmap/#multi-region", ready: false },
    ],
  },
] as const;

export const primaryNav = [
  { label: "Learn", href: "/#featured" },
  { label: "Topics", href: "/topics/consistency/cap-theorem/" },
  { label: "Roadmap", href: "/roadmap/" },
  { label: "Cheatsheets", href: "/#coming-soon" },
  { label: "System Designs", href: "/#coming-soon" },
  { label: "Interview Prep", href: "/#coming-soon" },
  { label: "Glossary", href: "/#coming-soon" },
] as const;
