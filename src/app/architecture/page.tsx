import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Mermaid from "@/components/Mermaid"; // Import component Mermaid mới
import styles from "./architecture.module.css";

// --- MERMAID DEFINITIONS ---

const DIAGRAM_COMPONENTS = `flowchart TB
  API["Public API: pomai::DB"] -->|owns| MM[MembraneManager]
  MM -->|1:1| ENG["Engine (per membrane)"]
  ENG -->|manages| SHARD["Shard (per shard)"]
  SHARD -->|wraps| RT[ShardRuntime]
  
  subgraph Shard Internals
    RT --> WAL[WAL]
    RT --> MEM[Active MemTable]
    RT --> FMEM[Frozen MemTables]
    RT --> SEG[Segments]
    SEG -.-> MAN[Shard Manifest]
  end
  
  ENG -.-> POOL[Search Thread Pool]
  style RT fill:#c22b3d,stroke:#fff,stroke-width:2px
  style MEM fill:#2d3748,stroke:#4a5568
  style WAL fill:#2d3748,stroke:#4a5568`;

const DIAGRAM_STATE = `stateDiagram-v2
  [*] --> Active
  
  Active --> Frozen: Soft Freeze (count >= 5000)
  Active --> Frozen: Explicit Freeze (rotates)
  
  Frozen --> Segment: Freeze (flush to disk)
  Segment --> Segment: Compact (optional)
  
  note right of Active
    Writes go here.
    Not persisted to Segment yet.
  end note`;

const DIAGRAM_UPSERT = `sequenceDiagram
  participant C as Client
  participant DB as pomai::DB
  participant S as ShardRuntime
  participant W as WAL
  participant M as ActiveMemTable
  
  C->>DB: Put(id, vec)
  DB->>S: Enqueue PutCmd (Mailbox)
  
  par Shard Loop
    S->>W: AppendPut
    S->>M: MemTable::Put
  end
  
  alt count >= 5000
    S->>S: RotateMemTable + PublishSnapshot
  end
  
  S-->>C: Status::Ok`;

const DIAGRAM_SEARCH = `sequenceDiagram
  participant C as Client
  participant E as Engine
  participant S as ShardRuntime
  participant Snap as Snapshot
  
  C->>E: Search(query, k)
  E->>S: SearchLocal(query, k)
  S->>Snap: Load current (atomic)
  
  loop Scan (Newest -> Oldest)
    S->>Snap: Scan Frozen MemTables
    S->>Snap: Scan Segments
  end
  
  S-->>E: Top-K Hits
  E-->>C: Merged Results`;

export default function ArchitecturePage() {
  return (
    <Container>
      {/* --- HERO SECTION --- */}
      <section className={styles.hero}>
        <Badge label="Architecture" tone="green" />
        <h1>Sharded single-writer runtimes. Lock-free readers.</h1>
        <p>
          PomaiDB is designed as an embedded, single-process storage engine. It avoids
          distributed system complexity in favor of predictable local performance:
          writes are serialized per shard, while reads run concurrently on immutable snapshots.
        </p>
      </section>

      {/* --- HIGH LEVEL OVERVIEW --- */}
      <div className={styles.grid}>
        <Card>
          <h3>What it is</h3>
          <p>
            An embedded engine with <b>sharded single-writer</b> actors and{" "}
            <b>lock-free snapshot</b> readers.
            <br />
            <span className={styles.sourceRef}>Source: pomai::core::ShardRuntime</span>
          </p>
        </Card>
        <Card>
          <h3>What it is not</h3>
          <p>
            Not distributed, not replicated, and not a cluster manager. No network stack
            in the core storage path.
          </p>
        </Card>
        <Card>
          <h3>Design Goals</h3>
          <p>
            1. Serialize writes per shard.<br />
            2. Concurrent reads via immutable snapshots.<br />
            3. Crash recovery via WAL replay.
          </p>
        </Card>
      </div>

      {/* --- COMPONENT DIAGRAM --- */}
      <SectionHeading
        eyebrow="System View"
        title="Membranes → Engine → Shards"
        description="The Public API enters a Membrane, which owns an Engine instance. The Engine coordinates per-shard runtimes and a shared search thread pool."
      />

      <div className={styles.diagram}>
        {/* Render hình ảnh sơ đồ thành phần */}
        <Mermaid chart={DIAGRAM_COMPONENTS} />
      </div>

      {/* --- DATA PATH & INVARIANTS --- */}
      <SectionHeading
        eyebrow="Data Path"
        title="Write path, Read path, Persistence"
        description="Key invariants ensure data safety without complex locking schemes on the read path."
      />

      <div className={styles.contract}>
        <Card>
          <h3>Write Path</h3>
          <p>
            API → Shard Mailbox → WAL Append → Active MemTable → (Soft Freeze) → Snapshot Publish.
          </p>
          <p className={styles.muted}>
            Writes are strictly ordered by the single-writer loop.
          </p>
        </Card>
        <Card>
          <h3>Read Path</h3>
          <p>
            API → Atomic Snapshot Load → Scan Frozen MemTables → Scan Segments → Merge.
          </p>
          <p className={styles.muted}>
            Readers never block writers. Readers see a consistent prefix of the WAL.
          </p>
        </Card>
        <Card>
          <h3>Persistence Path</h3>
          <p>
            <b>Freeze</b> flushes frozen tables to Segments, updates the Shard Manifest, and truncates the WAL.
          </p>
        </Card>
      </div>

      {/* --- LIFECYCLE DIAGRAMS --- */}
      <SectionHeading
        eyebrow="Request Lifecycle"
        title="Sequence of operations"
        description="Detailed flow for the two most critical operations: Upserting vectors and Searching."
      />

      <div className={styles.grid}>
        <div>
          <h3
            style={{
              color: "var(--pomai-text-strong)",
              marginBottom: "1rem",
              fontFamily: "var(--font-sora)",
            }}
          >
            Upsert (Put)
          </h3>
          <div className={styles.diagram}>
            {/* Render hình ảnh sơ đồ Upsert */}
            <Mermaid chart={DIAGRAM_UPSERT} />
          </div>
          <p className={styles.muted}>
            Note: The soft freeze happens automatically when <code>count &ge; 5000</code>.
          </p>
        </div>
        <div>
          <h3
            style={{
              color: "var(--pomai-text-strong)",
              marginBottom: "1rem",
              fontFamily: "var(--font-sora)",
            }}
          >
            Search (Query)
          </h3>
          <div className={styles.diagram}>
            {/* Render hình ảnh sơ đồ Search */}
            <Mermaid chart={DIAGRAM_SEARCH} />
          </div>
          <p className={styles.muted}>
            Search is currently brute-force over the snapshot data (Frozen + Segments).
          </p>
        </div>
      </div>

      {/* --- STATE MACHINE --- */}
      <SectionHeading
        eyebrow="Internals"
        title="MemTable State Machine"
        description="How data moves from volatile memory to durable segments."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div className={styles.diagram}>
          {/* Render hình ảnh sơ đồ trạng thái */}
          <Mermaid chart={DIAGRAM_STATE} />
        </div>
        <div>
          <Card>
            <h3>Limits & Constraints</h3>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--pomai-muted)', lineHeight: 1.6 }}>
              <li><b>Active Limit:</b> Fixed at 5000 items per shard.</li>
              <li><b>Flush:</b> No background thread; <code>Freeze</code> must be called explicitly.</li>
              <li><b>Metric:</b> Defined in <code>MembraneSpec</code> but currently search is exhaustive.</li>
            </ul>
          </Card>
          <div style={{ height: '1.5rem' }} />
          <Card>
            <h3>Failure Semantics</h3>
            <p>
              Crash recovery relies on <b>WAL Replay</b>. The <code>ShardManifest</code> acts as the checkpoint. Partial writes at the WAL tail are safely ignored.
            </p>
          </Card>
        </div>
      </div>

      {/* --- CODE POINTERS --- */}
      <SectionHeading
        eyebrow="For Developers"
        title="Source of Truth"
        description="Key entry points in the codebase to understand the implementation."
      />

      <div className={styles.contract}>
        <Card>
          <h3>Single-Writer Loop</h3>
          {/* Giữ lại CodeBlock cho mã nguồn */}
          <CodeBlock language="bash" code="src/core/shard/runtime.cc" />
          <p>See <code>ShardRuntime::RunLoop</code></p>
        </Card>
        <Card>
          <h3>WAL Replay</h3>
          <CodeBlock language="bash" code="src/storage/wal/wal.cc" />
          <p>See <code>Wal::ReplayInto</code></p>
        </Card>
        <Card>
          <h3>Manifest Commit</h3>
          <CodeBlock language="bash" code="src/core/shard/manifest.cc" />
          <p>See <code>ShardManifest::Commit</code></p>
        </Card>
      </div>

    </Container>
  );
}
