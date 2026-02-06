"use client";

import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Mermaid from "@/components/Mermaid";
import styles from "./semantics.module.css";

// --- MERMAID DIAGRAMS ---

const DIAGRAM_READ_PATH = `flowchart TB
    Q[Query ID] --> ACTIVE{Active MemTable?}
    ACTIVE -->|Found| RES1[Return Result/Tombstone]
    ACTIVE -->|Miss| FROZEN{Frozen Tables?}
    
    FROZEN -->|Found in Newest| RES1
    FROZEN -->|Miss| SEGS{Segments?}
    
    SEGS -->|Found in Newest| RES1
    SEGS -->|Miss| EMPTY[Return NotFound]
    
    style ACTIVE fill:#c22b3d,stroke:#fff
    style RES1 fill:#4ade80,color:#000
    style FROZEN fill:#2d3748,stroke:#fff,stroke-dasharray: 5 5`;

const DIAGRAM_WRITE_PATH = `sequenceDiagram
    participant C as Client
    participant W as WAL
    participant M as ActiveMemTable
    participant R as Readers
    
    C->>W: 1. Append Mutation
    W->>M: 2. Apply to MemTable
    Note over M,R: 3. Visible via Layer Merge
    
    rect rgba(255, 255, 255, 0.05)
      Note right of M: Freeze Trigger
      M->>disk: Persist to Segment
      M->>W: Reset WAL
    end`;

export default function SemanticsPage() {
  return (
    <Container>
      {/* --- HERO --- */}
      <section className={styles.hero}>
        <Badge label="Internals" tone="red" />
        <h1>Canonical Semantics</h1>
        <p>
          This document defines the runtime behavior of the engine.
          It covers the strict rules for data visibility, mutation lifecycles, and error handling.
        </p>
      </section>

      {/* --- SOT WARNING --- */}
      <div className={styles.sotBox}>
        <div className={styles.sotIcon}>⚠️</div>
        <div className={styles.sotContent}>
          <strong>Single Source of Truth</strong>
          <p>
            This document is authoritative. If code behavior diverges from this document, 
            fix the code or update this file in the same change request.
          </p>
        </div>
      </div>

      {/* --- CORE IDENTITY --- */}
      <SectionHeading
        eyebrow="Foundation"
        title="Core Identity & Invariants"
        description="The immutable laws governing the PomaiDB runtime architecture."
      />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeader}>Sharding Model</h3>
          <ul className={styles.list}>
            <li>Sharded architecture.</li>
            <li>Single writer per shard (Mailbox/Actor model).</li>
            <li>Per-shard WAL is the durability log.</li>
          </ul>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>Reader Safety</h3>
          <ul className={styles.list}>
            <li>Readers use immutable snapshots.</li>
            <li>Readers <b>never</b> mutate snapshot state.</li>
            <li>Read/Write visibility follows <b>Newest-Wins</b> layer merge.</li>
          </ul>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>Tombstones</h3>
          <ul className={styles.list}>
            <li>Deletes are inserted as Tombstone records.</li>
            <li>Tombstones in newer layers hide older values.</li>
            <li>Search excludes tombstoned records explicitly.</li>
          </ul>
        </Card>
      </div>

      <div style={{ margin: "4rem 0" }}></div>

      {/* --- LIFECYCLE --- */}
      <SectionHeading
        eyebrow="Safety"
        title="Lifecycle & Errors"
        description="Strict rules for initialization and shutdown to prevent silent data loss."
      />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeader}>Initialization</h3>
          <ul className={styles.list}>
            <li>Constructors do <b>not</b> perform fallible IO.</li>
            <li><code>Open/Start</code> operations perform IO and must return <code>Status</code> on failure.</li>
          </ul>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>Shutdown</h3>
          <ul className={styles.list}>
            <li><code>Close/Stop</code> operations are explicit and idempotent.</li>
            <li>No silent error swallowing on persistence or manifest transitions.</li>
          </ul>
        </Card>
      </div>

      <div style={{ margin: "4rem 0" }}></div>

      {/* --- WRITE PATH --- */}
      <SectionHeading
        eyebrow="Mutation"
        title="Write Path Semantics"
        description="The sequence of events for Put, Delete, and Batch operations."
      />

      <div className={styles.diagramContainer}>
        <Mermaid chart={DIAGRAM_WRITE_PATH} />
      </div>

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeader}>Mutation Steps</h3>
          <ol className={styles.list} style={{ listStyle: 'decimal', paddingLeft: '1.2rem' }}>
            <li>Append to shard WAL.</li>
            <li>Apply to active MemTable.</li>
            <li>Mutation becomes visible to subsequent reads via Layer Merge.</li>
          </ol>
        </Card>
        <Card>
          <h3 className={styles.cardHeader}>Freeze Semantics</h3>
          <p className={styles.list}>
            <code>Freeze</code> persists frozen MemTables into immutable segments and commits the manifest atomically <b>before</b> WAL reset.
          </p>
        </Card>
      </div>

      <div style={{ margin: "4rem 0" }}></div>

      {/* --- READ PATH --- */}
      <SectionHeading
        eyebrow="Query"
        title="Canonical Read Path"
        description="Get, Exists, and Search share the same lookup semantics based on layer age."
      />

      <div className={styles.grid} style={{ alignItems: 'center' }}>
        <div>
           <div className={styles.diagramContainer} style={{ background: 'transparent', border: 'none', padding: 0 }}>
             <Mermaid chart={DIAGRAM_READ_PATH} />
           </div>
        </div>
        <div>
           <Card>
             <h3 className={styles.cardHeader}>Canonical Layer Order</h3>
             <p style={{ color: 'var(--pomai-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
               (Newest to Oldest)
             </p>
             <ol className={styles.layerList}>
                <li>Active MemTable</li>
                <li>Frozen MemTables (Reverse Age)</li>
                <li>Segment Readers (Manifest Order)</li>
             </ol>
             <div style={{ marginTop: '1.5rem' }}>
               <h4
                 style={{
                   color: "var(--pomai-text-strong)",
                   fontSize: "1rem",
                   marginBottom: "0.5rem",
                 }}
               >
                 Visibility Rules
               </h4>
               <ul className={styles.list}>
                 <li>First matching record defines result.</li>
                 <li><b>Tombstone</b> at any newer layer returns NotFound and blocks older data.</li>
                 <li><code>Search</code> deduplicates by ID with newest-wins behavior.</li>
               </ul>
             </div>
           </Card>
        </div>
      </div>

      <div style={{ margin: "4rem 0" }}></div>

      {/* --- POLICIES --- */}
      <SectionHeading
        eyebrow="Operations"
        title="Policies & Constraints"
        description="Guidelines for scaling and performance optimization."
      />

      <div className={styles.grid}>
        <Card>
          <h3 className={styles.cardHeader}>Multi-Shard Policy</h3>
          <ul className={styles.list}>
            <li>Shard-local writes are <b>fail-fast</b>.</li>
            <li>Multi-shard search may return partial results if configured by higher layers.</li>
            <li>Shard-level behavior always returns explicit status.</li>
          </ul>
        </Card>
        
        <div className={styles.perfBox}>
          <h3>Performance Constraints</h3>
          <ul className={styles.list} style={{ color: '#ecfdf5' }}>
            <li>Keep ingest and search hot paths <b>allocation-aware</b>.</li>
            <li>Do not add extra vector copies on single <code>Put</code> path.</li>
            <li>Batch ingestion can copy for ownership safety, but changes must be deliberate and benchmarkable.</li>
          </ul>
        </div>
      </div>

    </Container>
  );
}
