export type RoadmapTopic = { name: string; href: string };
export type RoadmapStage = { n: string; label: string; title: string; id: string; topics: RoadmapTopic[] };

export const roadmapStages: RoadmapStage[] = [
  { n: "01", label: "Begin here", title: "Foundations", id: "foundations", topics: [
    { name: "Distributed systems", href: "/topics/foundations/distributed-systems/" },
    { name: "CAP theorem", href: "/topics/consistency/cap-theorem/" },
    { name: "PACELC", href: "/topics/consistency/pacelc/" },
    { name: "Consistency models", href: "/topics/consistency/consistency-models/" },
    { name: "Time & ordering", href: "/topics/foundations/time-ordering/" },
  ] },
  { n: "02", label: "Build authority", title: "Replication & consensus", id: "replication", topics: [
    { name: "Replication", href: "/topics/replication/replication/" },
    { name: "Quorums", href: "/topics/consensus/quorums/" },
    { name: "Raft consensus", href: "/topics/consensus/raft/" },
    { name: "Leader election", href: "/topics/consensus/leader-election/" },
  ] },
  { n: "03", label: "Distribute data", title: "Partitioning", id: "partitioning", topics: [
    { name: "Consistent hashing", href: "/topics/partitioning/consistent-hashing/" },
    { name: "Range partitioning", href: "/topics/partitioning/range-partitioning/" },
    { name: "Rebalancing", href: "/topics/partitioning/rebalancing/" },
    { name: "Hot partitions", href: "/topics/partitioning/hot-partitions/" },
  ] },
  { n: "04", label: "Coordinate change", title: "Transactions", id: "transactions", topics: [
    { name: "Two-phase commit", href: "/topics/transactions/two-phase-commit/" },
    { name: "Saga", href: "/topics/transactions/saga/" },
    { name: "MVCC", href: "/topics/transactions/mvcc/" },
    { name: "Idempotent workflows", href: "/topics/transactions/idempotent-workflows/" },
  ] },
  { n: "05", label: "Build data systems", title: "Databases & storage", id: "data-systems", topics: [
    { name: "LSM trees", href: "/topics/storage/lsm-trees/" },
    { name: "Distributed databases", href: "/topics/storage/distributed-databases/" },
    { name: "Compaction", href: "/topics/storage/compaction/" },
    { name: "Distributed SQL", href: "/topics/storage/distributed-sql/" },
  ] },
  { n: "06", label: "Move information", title: "Messaging", id: "messaging", topics: [
    { name: "Kafka / distributed logs", href: "/topics/messaging/distributed-logs/" },
    { name: "Delivery semantics", href: "/topics/messaging/delivery-semantics/" },
    { name: "Consumer groups", href: "/topics/messaging/consumer-groups/" },
    { name: "Backpressure", href: "/topics/messaging/backpressure/" },
  ] },
  { n: "07", label: "Survive reality", title: "Reliability", id: "reliability", topics: [
    { name: "Failure & retry patterns", href: "/topics/reliability/failure-retry-patterns/" },
    { name: "Partial failures", href: "/topics/reliability/partial-failures/" },
    { name: "Circuit breakers", href: "/topics/reliability/circuit-breakers/" },
    { name: "Load shedding", href: "/topics/reliability/load-shedding/" },
  ] },
  { n: "08", label: "Operate globally", title: "Multi-region", id: "multi-region", topics: [
    { name: "Active / active", href: "/topics/architecture/active-active/" },
    { name: "Geo replication", href: "/topics/architecture/geo-replication/" },
    { name: "RPO & RTO", href: "/topics/architecture/rpo-rto/" },
    { name: "Conflict resolution", href: "/topics/architecture/conflict-resolution/" },
  ] },
];

export const roadmapTopics = roadmapStages.flatMap((stage) => stage.topics);
