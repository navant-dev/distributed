export const curriculum = [
  { group: "Start here", items: [{ label: "Learning roadmap", href: "/roadmap/", ready: true }] },
  {
    group: "Foundations",
    items: [
      { label: "Distributed systems", href: "/topics/foundations/distributed-systems/", ready: true },
      { label: "CAP theorem", href: "/topics/consistency/cap-theorem/", ready: true },
      { label: "PACELC", href: "/topics/consistency/pacelc/", ready: true },
      { label: "Consistency models", href: "/topics/consistency/consistency-models/", ready: true },
      { label: "Time & ordering", href: "/roadmap/#time-ordering", ready: false },
    ],
  },
  {
    group: "Core building blocks",
    items: [
      { label: "Replication", href: "/topics/replication/replication/", ready: true },
      { label: "Quorums", href: "/topics/consensus/quorums/", ready: true },
      { label: "Raft consensus", href: "/topics/consensus/raft/", ready: true },
      { label: "Consistent hashing", href: "/topics/partitioning/consistent-hashing/", ready: true },
      { label: "Transactions / 2PC", href: "/topics/transactions/two-phase-commit/", ready: true },
    ],
  },
  {
    group: "At scale",
    items: [
      { label: "LSM trees", href: "/topics/storage/lsm-trees/", ready: true },
      { label: "Kafka / distributed logs", href: "/topics/messaging/distributed-logs/", ready: true },
      { label: "Failure & retries", href: "/topics/reliability/failure-retry-patterns/", ready: true },
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
