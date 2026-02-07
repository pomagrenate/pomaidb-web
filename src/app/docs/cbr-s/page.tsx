"use client";

import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Mermaid from "@/components/Mermaid";
import styles from "./cbrs.module.css";

// --- MERMAID DIAGRAMS ---

const DIAGRAM_LIFECYCLE = `stateDiagram-v2
    [*] --> DISABLED
    DISABLED --> WARMUP: Feature Enabled
    
    state WARMUP {
        [*] --> Collecting
        Collecting --> Training: Reach size M
        Training --> [*]
    }
    
    WARMUP --> READY: Training Complete
    
    state READY {
        [*] --> Serving
        Serving --> Updating: Online EMA
        Updating --> Serving
    }
    
    note right of WARMUP
        M = k * warmup_mult
        Deterministic KMeans++
    end note`;

const DIAGRAM_QUERY = `flowchart TB
    Q[Query Vector] --> CENTROIDS{Nearest Centroids}
    CENTROIDS -->|Top-1..3| PROBE[Select Probe Set]
    PROBE -->|Margin Heuristic| SHARDS[Map to Shards]
    
    subgraph Dual Epoch Logic
        SHARDS --> CURR[Current Table]
        SHARDS --> PREV[Previous Table]
        CURR & PREV --> UNION[Union Shard IDs]
    end
    
    UNION --> EXEC[Execute Search]
    style UNION fill:#c22b3d,stroke:#fff`;

// --- DATA STRUCTURES ---

const STRUCT_CODE = `struct RoutingTable {
  uint64_t epoch;
  uint32_t k;
  uint32_t dim;
  float    centroids[k][dim];
  uint32_t owner_shard[k];
  uint64_t counts[k];
};`;

export default function CBRSPage() {
    return (
        <Container>
            {/* --- HERO --- */}
            <section className={styles.hero}>
                <Badge label="Internals" tone="neutral" />
                <h1>CBR-S Implementation</h1>
                <p>
                    Content-Based Routing Strategy in PomaiDB utilizes <b>Global-Centroid Shard Assignment</b>,
                    <b>Routed Query</b> execution, and a <b>Dual-Epoch Probe</b> mechanism to ensure
                    high recall during topology transitions.
                </p>
            </section>

            {/* --- SECTION 1: DATA FORMAT --- */}
            <SectionHeading
                eyebrow="Storage"
                title="Routing Table Format"
                description="The engine maintains a compact routing table in memory, persisted to the database root."
            />

            <div className={styles.grid}>
                <Card>
                    <h3 className={styles.cardHeader}>In-Memory Structure</h3>
                    <CodeBlock language="cpp" code={STRUCT_CODE} />
                    <p style={{ marginTop: '1rem', color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
                        Centroids are updated online using count-based EMA (Exponential Moving Average).
                    </p>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>Persistence Files</h3>
                    <ul className={styles.list}>
                        <li><code>ROUTING</code>: Current active table.</li>
                        <li><code>ROUTING.prev</code>: Optional previous epoch (for fallback).</li>
                    </ul>
                    <div className={styles.fileStruct}>
                        [ Binary Payload ] + [ CRC32C ]
                    </div>
                    <p style={{ marginTop: '1rem', color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
                        Load process validates magic bytes, shape dimensions, and CRC checksum.
                    </p>
                </Card>
            </div>

            <div className={styles.section} />

            {/* --- SECTION 2: CRASH SAFETY --- */}
            <div className={styles.grid}>
                <div>
                    <SectionHeading
                        eyebrow="Reliability"
                        title="Crash Safety"
                        description="Routing persistence follows a strict atomic write pattern to prevent corruption."
                    />
                    <Card>
                        <ol className={styles.stepList}>
                            <li>Write data to <code>ROUTING.tmp</code></li>
                            <li><b>fsync</b> file data to disk</li>
                            <li><b>rename</b> <code>ROUTING.tmp</code> to <code>ROUTING</code></li>
                            <li><b>fsync</b> parent directory</li>
                        </ol>
                        <p style={{ marginTop: '1rem', color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
                            Corrupt or truncated files are treated as missing (triggering a fallback to WARMUP), never fatal at startup.
                        </p>
                    </Card>
                </div>

                <div>
                    <SectionHeading
                        eyebrow="Lifecycle"
                        title="Warmup to Ready"
                        description="How the system bootstraps the routing table."
                    />
                    <div className={styles.diagramContainer}>
                        <Mermaid chart={DIAGRAM_LIFECYCLE} />
                    </div>
                    <Card>
                        <h3 className={styles.cardHeader}>Initialization Logic</h3>
                        <ul className={styles.list}>
                            <li><b>KMeans-Lite:</b> Uses KMeans++ seeding + 5 Lloyd iterations.</li>
                            <li><b>Determinism:</b> Uses a fixed seed for reproducible clustering.</li>
                            <li><b>Mapping:</b> <code>owner_shard[g] = g % shard_count</code>.</li>
                        </ul>
                    </Card>
                </div>
            </div>

            <div className={styles.section} />

            {/* --- SECTION 3: ROUTED QUERY --- */}
            <SectionHeading
                eyebrow="Execution"
                title="Routed Query & Dual-Epoch Probe"
                description="To mitigate misses during routing transitions, queries may probe both current and previous routing epochs."
            />

            <div className={styles.grid}>
                <div className={styles.diagramContainer} style={{ background: 'transparent', border: 'none', padding: 0 }}>
                    <Mermaid chart={DIAGRAM_QUERY} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card>
                        <h3 className={styles.cardHeader}>1. Probe Selection</h3>
                        <p className={styles.list}>
                            Computes nearest centroids. Uses a margin heuristic to expand probe count (default 2, up to 3) if top distances are close.
                        </p>
                    </Card>
                    <Card>
                        <h3 className={styles.cardHeader}>2. Dual-Epoch Safety</h3>
                        <p className={styles.list}>
                            If a previous table exists, the probe set is computed for <b>both</b> epochs. The system unions the resulting shard IDs.
                            <br /><br />
                            This ensures correctness even if some shards haven't fully migrated data to the new topology.
                        </p>
                    </Card>
                </div>
            </div>

            <div className={styles.section} />

            {/* --- SECTION 4: POINT LOOKUP --- */}
            <SectionHeading
                eyebrow="Trade-offs"
                title="Point Lookup Strategy"
                description="Impact of routing on single-point operations (Get, Exists, Delete)."
            />

            <div className={styles.grid}>
                <Card>
                    <h3 className={styles.cardHeader}>The Change</h3>
                    <p style={{ color: 'var(--pomai-muted)', lineHeight: 1.6 }}>
                        In standard sharding, <code>shard_id = id % shards</code>.
                        <br />
                        With CBR-S, data location depends on vector content.
                    </p>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>The Strategy: Fan-out</h3>
                    <p style={{ color: 'var(--pomai-muted)', lineHeight: 1.6 }}>
                        Operations like <code>Get(id)</code>, <code>Exists(id)</code>, and <code>Delete(id)</code> must now <b>fan out to all shards</b>.
                    </p>
                </Card>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <Card>
                    <h3 className={styles.cardHeader}>Why Fan-out?</h3>
                    <ul className={styles.list}>
                        <li><b>Safety:</b> It is the safest minimal change ensuring correctness.</li>
                        <li><b>Simplicity:</b> No need for global in-memory postings lists or extra directory lookups.</li>
                        <li><b>Architecture:</b> Preserves the WAL/shard actor model without introducing complex cross-shard coordination.</li>
                    </ul>
                </Card>
            </div>

        </Container>
    );
}