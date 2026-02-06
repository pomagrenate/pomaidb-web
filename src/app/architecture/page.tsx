import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./architecture.module.css";

const componentDiagram = `flowchart TB
  API[Public API: pomai::DB] --> MM[MembraneManager]
  MM --> ENG[Engine (per membrane)]
  ENG --> SHARD[Shard (per shard)]
  SHARD --> RT[ShardRuntime]
  RT --> WAL[WAL per shard]
  RT --> MEM[Active MemTable]
  RT --> FMEM[Frozen MemTables]
  RT --> SEG[Segments]
  SEG --> MAN[Shard Manifest]
  ENG --> POOL[Search Thread Pool]`;

const stateMachine = `stateDiagram-v2
  [*] --> Active
  Active --> Frozen: soft freeze (>=5000)
  Active --> Frozen: explicit Freeze (rotates)
  Frozen --> Segment: Freeze flush to segment
  Segment --> Segment: Compact (optional)`;

const upsertSeq = `sequenceDiagram
  participant Client
  participant DB as pomai::DB
  participant Shard as ShardRuntime
  participant WAL
  participant Mem as Active MemTable
  participant Snap as ShardSnapshot

  Client->>DB: Put(id, vec)
  DB->>Shard: Enqueue PutCmd
  Shard->>WAL: AppendPut
  Shard->>Mem: MemTable::Put
  alt count >= 5000
    Shard->>Snap: RotateMemTable + PublishSnapshot
  end
  Shard-->>Client: Status::Ok`;

const searchSeq = `sequenceDiagram
  participant Client
  participant DB as pomai::DB
  participant Eng as Engine
  participant Shard as ShardRuntime
  participant Snap as ShardSnapshot

  Client->>DB: Search(query, k)
  DB->>Eng: Search
  Eng->>Shard: SearchLocal(query, k)
  Shard->>Snap: Load current snapshot (atomic)
  Shard->>Shard: Scan frozen memtables + segments
  Shard-->>Eng: per-shard hits
  Eng-->>Client: merged hits`;

export default function ArchitecturePage() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Architecture" tone="green" />
        <h1>Sharded single-writer runtimes with lock-free snapshot readers.</h1>
        <p>
          PomaiDB is an embedded, single-process storage engine. Writes are
          serialized per shard via a single writer loop, while reads run
          concurrently on immutable snapshots loaded atomically.
        </p>
      </section>

      <SectionHeading
        eyebrow="What it is"
        title="Embedded storage engine, not a distributed system"
        description="PomaiDB focuses on crash-safe persistence and predictable local performance: sharded single-writer actors, lock-free snapshot reads, and WAL-based recovery."
      />

      <div className={styles.grid}>
        <Card>
          <h3>What it is</h3>
          <p>
            An embedded, single-process engine with <b>sharded single-writer</b>{" "}
            runtimes and <b>lock-free snapshot</b> readers.
          </p>
        </Card>
        <Card>
          <h3>What it is not</h3>
          <p>
            Not distributed, not replicated, and not a cluster manager. There is
            no network stack or multi-node orchestration in the on-disk model.
          </p>
        </Card>
        <Card>
          <h3>Design goals</h3>
          <p>
            Serialize writes per shard; allow concurrent reads from immutable
            snapshots; recover after crashes via WAL replay.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="Component diagram"
        title="Membranes → Engine → Shards"
        description="Public API enters a membrane, which owns an engine instance. The engine coordinates per-shard runtimes and a search pool."
      />

      <CodeBlock language="mermaid" code={componentDiagram} caption="High-level component relationships" />

      <SectionHeading
        eyebrow="Key invariants"
        title="Snapshots are immutable and represent a prefix of WAL history"
        description="These invariants enable lock-free readers: each read operation uses exactly one published snapshot."
      />

      <div className={styles.contract}>
        <Card>
          <h3>Immutable after publication</h3>
          <p>Once a snapshot is published, its contents do not change.</p>
        </Card>
        <Card>
          <h3>Prefix of WAL history</h3>
          <p>
            Every snapshot corresponds to a prefix of the shard WAL. Recovery can
            replay forward to reconstruct state.
          </p>
        </Card>
        <Card>
          <h3>Single snapshot per read</h3>
          <p>
            Readers load <code>current_snapshot_</code> atomically and use it for
            the entire Get/Search operation.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="Data path"
        title="Write path, read path, persistence path"
        description="Writes are appended to WAL first, then materialized in MemTables. Reads consult the snapshot: frozen MemTables then segments. Persistence happens via explicit Freeze."
      />

      <div className={styles.grid}>
        <Card>
          <h3>Write path</h3>
          <p>
            API → shard mailbox → WAL append → Active MemTable → (soft freeze) →
            snapshot publish.
          </p>
        </Card>
        <Card>
          <h3>Read path</h3>
          <p>
            API → snapshot load → scan frozen memtables → scan segments → merge.
            (Search is brute-force over snapshot data today.)
          </p>
        </Card>
        <Card>
          <h3>Persistence path</h3>
          <p>
            <b>Freeze</b> flushes frozen memtables to segments, updates shard
            manifest, then resets WAL state.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="Read path"
        title="Newest-to-oldest: frozen tables, then segments"
        description="Reads start by atomically loading the current snapshot. Frozen MemTables and segments are scanned newest-first to respect last-write-wins."
      />

      <div className={styles.contract}>
        <Card>
          <h3>1) Load snapshot</h3>
          <p>
            <code>Get</code>/<code>Search</code> loads{" "}
            <code>current_snapshot_</code> atomically.
          </p>
        </Card>
        <Card>
          <h3>2) Frozen MemTables</h3>
          <p>Scan frozen memtables in newest-to-oldest order.</p>
        </Card>
        <Card>
          <h3>3) Segments</h3>
          <p>Scan segment files in newest-to-oldest order and merge results.</p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="Write path"
        title="Mailbox → WAL → MemTable → soft freeze at 5000"
        description="Writes are enqueued into a bounded mailbox. A single writer thread appends to WAL, updates the active MemTable, and publishes snapshots after rotation."
      />

      <div className={styles.grid}>
        <Card>
          <h3>Bounded mailbox</h3>
          <p>
            Client calls enqueue write commands into a bounded MPSC queue to
            serialize work per shard.
          </p>
        </Card>
        <Card>
          <h3>WAL first</h3>
          <p>
            The writer thread appends to WAL before mutating in-memory state,
            enabling crash recovery by replay.
          </p>
        </Card>
        <Card>
          <h3>Soft freeze trigger</h3>
          <p>
            When the active memtable reaches <b>5000</b> items, it rotates to
            frozen and a new snapshot is published.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="State machine"
        title="Active → Frozen → Segment"
        description="MemTables move through a simple lifecycle. Persistence to segments happens when Freeze flushes frozen tables."
      />

      <CodeBlock language="mermaid" code={stateMachine} caption="MemTable lifecycle" />

      <SectionHeading
        eyebrow="Request lifecycle"
        title="Upsert and Search sequences"
        description="A single-writer shard loop ensures ordered writes; reads load snapshots atomically and scan immutable structures."
      />

      <div className={styles.grid}>
        <Card>
          <h3>Upsert (Put)</h3>
          <CodeBlock language="mermaid" code={upsertSeq} />
        </Card>
        <Card>
          <h3>Search</h3>
          <CodeBlock language="mermaid" code={searchSeq} />
        </Card>
      </div>

      <SectionHeading
        eyebrow="Failure semantics"
        title="Crash recovery is WAL replay + manifest state"
        description="PomaiDB recovers by replaying per-shard WALs into in-memory state and using the shard manifest to find the durable segment set."
      />

      <div className={styles.contract}>
        <Card>
          <h3>WAL replay</h3>
          <p>
            Recovery replays WAL records into shard state. Truncation at the tail
            is tolerated (partial writes are ignored safely).
          </p>
        </Card>
        <Card>
          <h3>Shard manifest</h3>
          <p>
            Segment state is committed via the shard manifest using atomic
            update + directory fsync to survive power loss.
          </p>
        </Card>
        <Card>
          <h3>Operational note</h3>
          <p>
            There is no background flush thread today: <b>Freeze</b> must be
            called explicitly to persist frozen tables to segments.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="Code pointers"
        title="Source of truth in the repository"
        description="These are the key entry points to validate behavior and invariants."
      />

      <div className={styles.grid}>
        <Card>
          <h3>Single-writer loop</h3>
          <p>
            <code>pomai::core::ShardRuntime::RunLoop</code>
            <br />
            <span style={{ color: "var(--pomai-muted)" }}>
              src/core/shard/runtime.cc
            </span>
          </p>
        </Card>
        <Card>
          <h3>WAL + MemTable + soft freeze</h3>
          <p>
            <code>ShardRuntime::HandlePut</code>,{" "}
            <code>PublishSnapshot</code>
            <br />
            <span style={{ color: "var(--pomai-muted)" }}>
              src/core/shard/runtime.cc
            </span>
          </p>
        </Card>
        <Card>
          <h3>Recovery + manifest commit</h3>
          <p>
            <code>pomai::storage::Wal::ReplayInto</code>,{" "}
            <code>ShardManifest::Commit</code>
            <br />
            <span style={{ color: "var(--pomai-muted)" }}>
              src/storage/wal/wal.cc, src/core/shard/manifest.cc
            </span>
          </p>
        </Card>
      </div>
    </Container>
  );
}
