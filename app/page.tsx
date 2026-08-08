const concepts = [
  {
    number: "01",
    title: "Replication",
    eyebrow: "Copies build resilience",
    description:
      "Keep the same data on multiple machines, so one failure never becomes everyone’s problem.",
    visual: "replication",
    tags: ["Leader", "Follower", "Quorum"],
  },
  {
    number: "02",
    title: "Consistency",
    eyebrow: "One truth, many views",
    description:
      "Choose when every reader must see the latest write—and when a slightly older answer is acceptable.",
    visual: "consistency",
    tags: ["Strong", "Eventual", "Causal"],
  },
  {
    number: "03",
    title: "Partitioning",
    eyebrow: "Divide to grow",
    description:
      "Split a large dataset into smaller shards so storage and traffic can scale across machines.",
    visual: "partitioning",
    tags: ["Range", "Hash", "Rebalance"],
  },
  {
    number: "04",
    title: "Consensus",
    eyebrow: "Agree despite failure",
    description:
      "Help independent nodes commit to the same decision, even when messages arrive late or machines disappear.",
    visual: "consensus",
    tags: ["Raft", "Term", "Majority"],
  },
  {
    number: "05",
    title: "Caching",
    eyebrow: "Move data closer",
    description:
      "Trade a little freshness for dramatically faster reads by storing popular answers near their users.",
    visual: "caching",
    tags: ["TTL", "Hit rate", "Invalidation"],
  },
  {
    number: "06",
    title: "Queues",
    eyebrow: "Separate work from time",
    description:
      "Let producers and consumers work independently while a durable buffer absorbs traffic spikes.",
    visual: "queues",
    tags: ["Producer", "Broker", "Consumer"],
  },
];

function MiniDiagram({ type }: { type: string }) {
  if (type === "replication") {
    return <div className="diagram replication"><i className="node primary">A</i><span /><i className="node">A</i><span /><i className="node">A</i></div>;
  }
  if (type === "consistency") {
    return <div className="diagram consistency"><i className="pulse p1" /><i className="pulse p2" /><i className="pulse p3" /><b>t</b></div>;
  }
  if (type === "partitioning") {
    return <div className="diagram partitioning"><i>00–33</i><i>34–66</i><i>67–99</i></div>;
  }
  if (type === "consensus") {
    return <div className="diagram consensus"><i className="vote on" /><i className="vote on" /><i className="vote on" /><i className="vote" /><i className="vote" /><b>3/5</b></div>;
  }
  if (type === "caching") {
    return <div className="diagram caching"><i className="client">GET</i><span>12ms</span><i className="cache">CACHE</i><em>↓</em><i className="db">DB</i></div>;
  }
  return <div className="diagram queues"><i>P</i><span className="message" /><span className="message" /><span className="message" /><b>Q</b><span className="message" /><i>C</i></div>;
}

export default function Home() {
  return (
    <main>
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Distributed Systems Simplified home">
          <span className="brand-mark"><i /><i /><i /></span>
          <span>DS / Simplified</span>
        </a>
        <div className="nav-links">
          <a href="#concepts">Concepts</a>
          <a href="#method">How it works</a>
          <a className="nav-cta" href="https://github.com/navant-dev/distributed" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="kicker">A visual field guide for software engineers</p>
          <h1>Distributed systems.<br /><span>Finally, made simple.</span></h1>
          <p className="hero-intro">Clear mental models for the systems that run the world—explained one idea, one diagram, and one page at a time.</p>
          <div className="hero-actions">
            <a className="button primary-button" href="#concepts">Start learning <span>↓</span></a>
            <span className="microcopy">No sign-up. No jargon spiral.</span>
          </div>
        </div>
        <div className="hero-system" aria-label="Animated distributed system illustration">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="system-core"><span>request</span><b>42ms</b></div>
          <div className="system-node n1"><i /><span>us-west</span></div>
          <div className="system-node n2"><i /><span>eu-central</span></div>
          <div className="system-node n3"><i /><span>ap-south</span></div>
          <div className="system-node n4"><i /><span>replica</span></div>
          <div className="packet packet-one" />
          <div className="packet packet-two" />
        </div>
        <div className="scroll-note"><span /> Scroll to explore</div>
      </section>

      <section className="manifesto" id="method">
        <p className="section-label">The idea</p>
        <h2>Complex doesn’t have to mean <span>complicated.</span></h2>
        <div className="manifesto-grid">
          <p>Distributed systems are everywhere—from the database behind your app to the service handling millions of requests. But the language around them can feel needlessly dense.</p>
          <p>This field guide strips each concept down to its essential idea, then builds the intuition back up with a visual you can remember.</p>
        </div>
        <div className="principles" aria-label="Learning principles">
          <div><b>01</b><span>One concept</span></div>
          <div><b>02</b><span>One visual model</span></div>
          <div><b>03</b><span>One useful takeaway</span></div>
        </div>
      </section>

      <section className="concepts" id="concepts">
        <div className="section-heading">
          <div><p className="section-label">The essentials</p><h2>Six ideas.<br />A stronger foundation.</h2></div>
          <p>Start with the primitives. Everything else is a composition of these trade-offs.</p>
        </div>
        <div className="concept-grid">
          {concepts.map((concept) => (
            <a className={`concept-card ${concept.visual}`} href={`concepts/${concept.visual}/`} key={concept.title}>
              <div className="card-top"><span>{concept.number}</span><span>{concept.eyebrow}</span></div>
              <MiniDiagram type={concept.visual} />
              <div className="card-copy">
                <h3>{concept.title}</h3>
                <p>{concept.description}</p>
                <div className="tags">{concept.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <span className="learn-link">Explore one-pager <b>↗</b></span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="tradeoff">
        <p className="section-label light">The golden rule</p>
        <blockquote>There is no perfect system.<br /><span>Only the right trade-off.</span></blockquote>
        <div className="tradeoff-line"><span>Consistency</span><i /><span>Availability</span><i /><span>Latency</span></div>
      </section>

      <section className="next-step">
        <p className="section-label">Keep exploring</p>
        <h2>Build intuition.<br /><span>Design with confidence.</span></h2>
        <p>New visual explainers are on the way. Follow the project and help decide what we simplify next.</p>
        <a className="button dark-button" href="https://github.com/navant-dev/distributed" target="_blank" rel="noreferrer">Follow on GitHub <span>↗</span></a>
      </section>

      <footer>
        <a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span><span>DS / Simplified</span></a>
        <p>Made for engineers who value clarity.</p>
        <a href="https://navant.dev">navant.dev ↗</a>
      </footer>
    </main>
  );
}
