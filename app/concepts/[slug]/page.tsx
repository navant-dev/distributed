import { notFound } from "next/navigation";

type Concept = {
  title: string; subtitle: string; definition: string; accent: string;
  promise: string[]; components: { name: string; text: string }[];
  steps: { title: string; text: string }[]; failure: string; tradeoffs: string[];
  example: { title: string; text: string }; takeaway: string; terms: string[];
};

const concepts: Record<string, Concept> = {
  replication: {
    title: "Replication", subtitle: "Copies build resilience", accent: "#0071e3",
    definition: "Replication stores the same data on multiple nodes. If one copy becomes unavailable, another can keep serving traffic.",
    promise: ["Survive machine and zone failures", "Scale read traffic", "Keep data closer to users"],
    components: [{name:"Leader",text:"Accepts writes and defines their order."},{name:"Followers",text:"Copy the leader’s log and serve reads."},{name:"Replication log",text:"An ordered stream of changes sent to replicas."}],
    steps: [{title:"Write",text:"A client sends a change to the leader."},{title:"Replicate",text:"The leader records it and forwards it to followers."},{title:"Acknowledge",text:"After enough replicas confirm, the write is committed."},{title:"Read",text:"The latest safe value can be served from an eligible replica."}],
    failure: "If the leader disappears, a healthy replica is promoted. Writes pause briefly, but committed data remains available.",
    tradeoffs: ["Synchronous copies are safer but add latency.","Asynchronous copies are faster but can lag.","More replicas improve resilience and increase cost."],
    example: {title:"Three-node database",text:"With one leader and two followers, a quorum of two can commit. Any single node may fail without losing availability."},
    takeaway: "Replication is not backup. It protects availability; accidental changes can still be copied everywhere.", terms:["Leader","Follower","Quorum","Lag"]
  },
  consistency: {
    title: "Consistency", subtitle: "One truth, many views", accent: "#7c3aed",
    definition: "Consistency describes what values a read is allowed to return after writes occur across a distributed system.",
    promise: ["Make read behavior predictable", "Protect critical invariants", "Choose freshness intentionally"],
    components: [{name:"Write order",text:"The sequence in which changes become visible."},{name:"Read guarantee",text:"The freshness a client can rely on."},{name:"Replica state",text:"How far each copy has caught up."}],
    steps: [{title:"Write",text:"A client changes value A to B."},{title:"Propagate",text:"The new value travels to other replicas."},{title:"Observe",text:"Concurrent readers may briefly see A or B."},{title:"Converge",text:"Eventually every healthy replica agrees on B."}],
    failure: "During a network split, a system must either reject some operations or allow replicas to diverge temporarily.",
    tradeoffs: ["Strong consistency simplifies reasoning and may wait on the network.","Eventual consistency stays responsive but exposes stale reads.","Session guarantees offer useful middle ground."],
    example: {title:"Profile vs. bank balance",text:"A stale avatar is usually harmless. A stale account balance may approve money that does not exist. The guarantee should match the consequence."},
    takeaway: "Consistency is not binary. Define the weakest guarantee that still protects the product’s invariant.", terms:["Strong","Eventual","Causal","Linearizable"]
  },
  partitioning: {
    title: "Partitioning", subtitle: "Divide to grow", accent: "#0891b2",
    definition: "Partitioning splits a dataset into independent shards so storage and traffic can be distributed across many machines.",
    promise: ["Store more than one machine can hold", "Spread read and write load", "Scale pieces independently"],
    components: [{name:"Partition key",text:"The field used to decide where data belongs."},{name:"Router",text:"Maps each request to the correct shard."},{name:"Shard",text:"A bounded subset of the complete dataset."}],
    steps: [{title:"Choose key",text:"Select an attribute with even, predictable distribution."},{title:"Map",text:"Apply a range or hash strategy to locate a shard."},{title:"Route",text:"Send the operation directly to its owner."},{title:"Rebalance",text:"Move ranges when shards become uneven or crowded."}],
    failure: "A hot key can overload one shard while the rest remain idle. A failed shard affects only its slice when replicas exist.",
    tradeoffs: ["Range sharding supports scans but risks hotspots.","Hash sharding spreads load but scatters related data.","Cross-shard queries add coordination and latency."],
    example: {title:"Users by account ID",text:"Hashing a stable account ID spreads users across 32 shards. Requests can calculate the destination without searching every node."},
    takeaway: "The partition key becomes architecture. Pick it from access patterns, not from what is easiest today.", terms:["Shard","Hash ring","Hotspot","Rebalance"]
  },
  consensus: {
    title: "Consensus", subtitle: "Agree despite failure", accent: "#f97316",
    definition: "Consensus lets independent nodes agree on one ordered history even when messages are delayed and machines fail.",
    promise: ["Elect one active leader", "Commit one shared history", "Prevent conflicting decisions"],
    components: [{name:"Leader",text:"Coordinates client commands for the current term."},{name:"Term",text:"A logical era identified by a monotonically increasing number."},{name:"Majority",text:"Enough votes to make a decision durable."}],
    steps: [{title:"Timeout",text:"Followers stop hearing heartbeats and begin an election."},{title:"Vote",text:"A candidate increments the term and requests votes."},{title:"Lead",text:"A majority elects one candidate as leader."},{title:"Replicate",text:"The leader commits entries only after majority agreement."}],
    failure: "A minority partition cannot elect or commit a leader. This pauses progress there and prevents two histories from being committed.",
    tradeoffs: ["Majority agreement adds network round trips.","The cluster stays safe when it cannot make progress.","Five nodes tolerate two failures but cost more than three."],
    example: {title:"Raft with five nodes",text:"Three votes elect a leader. Three matching log copies commit an entry. Two isolated nodes can never form a conflicting majority."},
    takeaway: "Consensus does not prevent failure. It prevents uncertainty about which decision survived the failure.", terms:["Raft","Term","Election","Majority"]
  },
  caching: {
    title: "Caching", subtitle: "Move data closer", accent: "#d97706",
    definition: "A cache stores reusable results in faster, closer storage to avoid repeating expensive work.",
    promise: ["Reduce response latency", "Protect databases from repeated reads", "Absorb traffic spikes"],
    components: [{name:"Cache key",text:"A stable identity for a reusable result."},{name:"Value",text:"The stored response or computed object."},{name:"TTL",text:"How long the value may live before expiring."}],
    steps: [{title:"Look up",text:"Check the cache before the source of truth."},{title:"Hit",text:"Return the stored value immediately when present."},{title:"Miss",text:"Fetch or compute the value when absent."},{title:"Fill",text:"Store the result with an expiration for the next request."}],
    failure: "When a popular key expires, many requests may hit the database together. Jitter, locking, and stale-while-revalidate reduce this stampede.",
    tradeoffs: ["Long TTLs improve hit rate and increase staleness.","Invalidation improves freshness and adds complexity.","Memory is fast, finite, and relatively expensive."],
    example: {title:"Product catalog",text:"Cache product details for five minutes. A price change invalidates its key immediately while ordinary reads avoid the primary database."},
    takeaway: "Every cache is a copy of truth with an expiration policy. Design the stale-data experience before choosing the TTL.", terms:["TTL","Hit rate","Eviction","Stampede"]
  },
  queues: {
    title: "Queues", subtitle: "Separate work from time", accent: "#16a34a",
    definition: "A message queue buffers work between producers and consumers so each side can operate at its own pace.",
    promise: ["Absorb sudden traffic bursts", "Retry failed work safely", "Decouple independent services"],
    components: [{name:"Producer",text:"Publishes a description of work to perform."},{name:"Broker",text:"Stores and delivers messages durably."},{name:"Consumer",text:"Processes messages and acknowledges completion."}],
    steps: [{title:"Publish",text:"A producer writes a durable message."},{title:"Buffer",text:"The broker holds it until capacity is available."},{title:"Consume",text:"A worker receives and processes the message."},{title:"Acknowledge",text:"Success removes it; failure makes it eligible for retry."}],
    failure: "A consumer may crash after doing work but before acknowledging it. The message returns, so handlers must tolerate duplicates.",
    tradeoffs: ["At-least-once delivery can duplicate work.","Ordering limits parallelism.","Backlogs increase end-to-end latency but protect producers."],
    example: {title:"Order confirmation",text:"Checkout publishes an order event immediately. Separate workers charge payment, reserve inventory, and send email without blocking the user."},
    takeaway: "Assume every message can arrive twice, late, or out of order—and make the consumer safe anyway.", terms:["Producer","Broker","Consumer","Idempotency"]
  }
};

export function generateStaticParams() { return Object.keys(concepts).map((slug) => ({ slug })); }

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const concept = concepts[slug]; if (!concept) notFound();
  return <main className="detail-page" style={{"--accent":concept.accent} as React.CSSProperties}>
    <nav className="nav detail-nav"><a className="back-link" href="/#concepts">← All concepts</a><span>DS / Simplified</span><a href="https://github.com/navant-dev/distributed" target="_blank" rel="noreferrer">GitHub ↗</a></nav>
    <header className="detail-hero">
      <div><p className="detail-kicker">Visual one-pager · {concept.subtitle}</p><h1>{concept.title}</h1><p className="detail-definition">{concept.definition}</p></div>
      <div className="cluster-visual"><i className="cluster-main">01</i><i>02</i><i>03</i><i>04</i><span className="signal s1"/><span className="signal s2"/></div>
    </header>
    <section className="detail-board">
      <article className="info-panel overview-panel"><PanelTitle n="1" title="Overview"/><p>{concept.definition}</p><div className="promise-list">{concept.promise.map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div></article>
      <article className="info-panel components-panel"><PanelTitle n="2" title="Components"/><div className="component-list">{concept.components.map((x,i)=><div key={x.name}><i>{i+1}</i><p><b>{x.name}</b><span>{x.text}</span></p></div>)}</div></article>
      <article className="info-panel flow-panel"><PanelTitle n="3" title="How it works"/><div className="flow-list">{concept.steps.map((x,i)=><div key={x.title}><i>{i+1}</i><p><b>{x.title}</b><span>{x.text}</span></p>{i<concept.steps.length-1&&<em>→</em>}</div>)}</div></article>
      <article className="info-panel failure-panel"><PanelTitle n="4" title="When things fail"/><div className="failure-diagram"><i className="alive"/><span/><i className="alive"/><span className="broken"/><i className="dead"/></div><p>{concept.failure}</p></article>
      <article className="info-panel trade-panel"><PanelTitle n="5" title="Trade-offs"/><ul>{concept.tradeoffs.map(x=><li key={x}>{x}</li>)}</ul></article>
      <article className="info-panel example-panel"><PanelTitle n="6" title="In practice"/><div className="example-box"><span>Example</span><h2>{concept.example.title}</h2><p>{concept.example.text}</p></div></article>
      <article className="takeaway-panel"><span>The one thing to remember</span><blockquote>“{concept.takeaway}”</blockquote><div>{concept.terms.map(x=><i key={x}>{x}</i>)}</div></article>
    </section>
    <footer className="detail-footer"><a href="/#concepts">← Back to all concepts</a><span>Distributed Systems Simplified</span><a href="https://navant.dev">navant.dev ↗</a></footer>
  </main>;
}

function PanelTitle({n,title}:{n:string;title:string}) { return <h2 className="panel-title"><b>{n}.</b> {title}</h2>; }
