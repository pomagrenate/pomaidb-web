"use client";

import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Mermaid from "@/components/Mermaid";
import styles from "./consistency.module.css";

// --- MERMAID DIAGRAMS ---

const DIAGRAM_STATE = `stateDiagram-v2
    [*] --> Active
    
    Active --> Frozen: Soft Freeze (count >= 5000)
    Active --> Frozen: Explicit Freeze (rotates)
    
    Frozen --> Segment: Freeze Flush
    Segment --> [*]
    
    note right of Active
      Writes append here.
      Invisible to readers.
    end note
    
    note right of Frozen
      Visible in Snapshot.
      Immutable.
    end note`;

const DIAGRAM_TIMELINE_SOFT = `sequenceDiagram
    participant C as Client
    participant A as ActiveMemTable
    participant S as Snapshot
    
    Note over A: Count < 5000
    C->>A: T0: Put(id=1)
    C->>S: T1: Get(id=1)
    S-->>C: NotFound (Active hidden)
    
    Note over A: Count = 5000
    A->>S: T2: Rotate & Publish
    
    C->>S: T3: Get(id=1)
    S-->>C: Found (Visible)`;

const DIAGRAM_TIMELINE_EXPLICIT = `sequenceDiagram
    participant C as Client
    participant DB
    participant S as Snapshot
    
    C->>DB: T0: Put(id=2)
    C->>DB: T1: Freeze()
    DB->>S: Flush & Publish New
    
    C->>S: T2: Search()
    S-->>C: Found id=2`;

export default function ConsistencyPage() {
  return (
    <Container>
      {/* --- HERO --- */}
      <section className={styles.hero}>
        <Badge label="Deep Dive" tone="purple" />
        <h1>Consistency Model</h1>
        <p>
          PomaiDB implements <b>Snapshot Isolation</b> per shard with <b>Bounded Staleness</b>.
          This model prioritizes lock-free read performance while ensuring writes are
          durable and strictly ordered within a shard.
        </p>
      </section>

      {/* --- WHAT IT IS / IS NOT --- */}
      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeader}>What it is</h3>
          <ul className={styles.list}>
            <li>
              <b>Snapshot isolation per shard:</b> Reads operate on a single immutable <code>ShardSnapshot</code>.
            </li>
            <li>
              <b>Bounded staleness:</b> Writes are visible only after rotation (soft) or <code>Freeze</code> (hard).
            </li>
          </ul>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>What it is not</h3>
          <ul className={styles.list}>
            <li>
              <b>Not Linearizable:</b> Does not guarantee global real-time ordering across all clients.
            </li>
            <li>
              <b>Not Read-Your-Writes:</b> By default, a client cannot immediately read back what it just wrote until a freeze occurs.
            </li>
          </ul>
        </Card>
      </div>

      {/* --- DESIGN GOALS --- */}
      <SectionHeading
        eyebrow="Philosophy"
        title="Design Goals"
        description="Why we chose this model: Performance and predictability."
      />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeader}>Lock-Free Readers</h3>
          <p className={styles.list}>
            Readers never block on writers. They acquire an atomic pointer to the current snapshot and read mostly-immutable structures.
            <span className={styles.sourceRef}>Source: ShardRuntime::GetSnapshot</span>
          </p>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>Single-Writer Ordering</h3>
          <p className={styles.list}>
            Preserves per-shard write ordering via a single writer thread (Actor model). No cross-shard global ordering.
            <span className={styles.sourceRef}>Source: ShardRuntime::RunLoop</span>
          </p>
        </Card>
      </div>

      {/* --- STATE MACHINE --- */}
      <SectionHeading
        eyebrow="Lifecycle"
        title="Visibility State Machine"
        description="Data transitions from 'Active' (Hidden) to 'Frozen' (Visible) based on size thresholds or explicit commands."
      />

      <div className={styles.diagramContainer}>
        <Mermaid chart={DIAGRAM_STATE} />
      </div>

      <div className={styles.definitionBox}>
        <h3>Formal Definition</h3>
        <p>
          Let <code>S_t</code> be the snapshot published at time <i>t</i>. A read at time <i>t</i> returns results from <code>S_t</code> only.
          <code>S_t</code> contains all operations processed before the most recent freeze. The Active MemTable is strictly excluded.
        </p>
      </div>

      {/* --- BOUNDED STALENESS --- */}
      <SectionHeading
        eyebrow="Guarantees"
        title="Bounded Staleness & RYW"
        description="Understanding when data becomes queryable."
      />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeader}>The 5000 Item Bound</h3>
          <ul className={styles.list}>
            <li>At most <b>5000 writes</b> per shard can be invisible.</li>
            <li>Unit is item count, not time.</li>
            <li>Configurability: Currently hard-coded.</li>
          </ul>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>Read-Your-Writes (RYW)</h3>
          <ul className={styles.list}>
            <li>Not supported by default.</li>
            <li>To enforce RYW: Call <code>Freeze()</code> immediately after writing.</li>
            <li>Cost: Forces a segment flush and snapshot publish.</li>
          </ul>
        </Card>
      </div>

      {/* --- TIMELINES --- */}
      <SectionHeading
        eyebrow="Examples"
        title="Visibility Timelines"
        description="Visualizing how reads interact with write operations over time."
      />

      <div className={styles.timelineGrid}>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Soft Freeze (Automatic)</h4>
          <div className={styles.diagramContainer} style={{ padding: '1rem' }}>
            <Mermaid chart={DIAGRAM_TIMELINE_SOFT} />
          </div>
          <p style={{ color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
            T1 misses the write because it occurred before the Active MemTable filled up.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Explicit Freeze</h4>
          <div className={styles.diagramContainer} style={{ padding: '1rem' }}>
            <Mermaid chart={DIAGRAM_TIMELINE_EXPLICIT} />
          </div>
          <p style={{ color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
            Calling Freeze forces visibility immediately, bypassing the 5000 item threshold.
          </p>
        </div>
      </div>

      {/* --- CODE POINTERS --- */}
      <SectionHeading
        eyebrow="Developers"
        title="Source of Truth"
        description="Key implementation files defining these semantics."
      />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeader}>Read Path</h3>
          <CodeBlock language="bash" code="src/core/shard/runtime.h" />
          <p className={styles.list} style={{ marginTop: '0.5rem' }}>
            <code>GetSnapshot</code>: Atomic load of snapshot pointer.
          </p>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>Write Path</h3>
          <CodeBlock language="bash" code="src/core/shard/runtime.cc" />
          <p className={styles.list} style={{ marginTop: '0.5rem' }}>
            <code>HandlePut</code>: Appends to WAL, checks threshold.
          </p>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>Rotation</h3>
          <CodeBlock language="bash" code="src/core/shard/runtime.cc" />
          <p className={styles.list} style={{ marginTop: '0.5rem' }}>
            <code>RotateMemTable</code>: The critical section where visibility changes.
          </p>
        </Card>
      </div>

      <div style={{ marginTop: "3rem", borderTop: "1px solid var(--pomai-border)", paddingTop: "1rem" }}>
        <p style={{ color: "var(--pomai-muted)", fontSize: "0.85rem" }}>
          See also: <a href="/docs/FAILURE_SEMANTICS.md" style={{ color: "var(--pomai-link)" }}>Failure Semantics</a> for crash recovery details.
        </p>
      </div>

    </Container>
  );
}