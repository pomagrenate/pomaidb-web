import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./contract.module.css";

export default function ContractPage() {
  return (
    <Container>
      {/* --- HERO --- */}
      <section className={styles.hero}>
        <Badge label="Constitution" tone="red" />
        <h1>Database Contract</h1>
        <p>
          This document is the final authority on PomaiDB’s identity, guarantees,
          and boundaries. Changes to this document require explicit design review.
        </p>
      </section>

      {/* --- META INFO --- */}
      <div className={styles.metaBox}>
        <div className={styles.metaItem}>
          <strong>Authority</strong>
          <span>Final & Binding</span>
        </div>
        <div className={styles.metaItem}>
          <strong>Status</strong>
          <span>Living Document</span>
        </div>
        <div className={styles.metaItem}>
          <strong>Branch</strong>
          <span>pomai-embedded</span>
        </div>
        <div className={styles.metaItem}>
          <strong>Version</strong>
          <span>1.0 (2026-02-04)</span>
        </div>
      </div>

      {/* --- 1. WHAT IT IS --- */}
      <SectionHeading
        eyebrow="Identity"
        title="What PomaiDB Is"
        description="The non-negotiable characteristics that define the engine."
      />

      <div className={styles.grid}>
        <Card>
          <h3>1. Embedded Database</h3>
          <ul className={styles.list}>
            <li>Single-process, in-memory with disk durability.</li>
            <li>Linked as a library (<code>libpomai.a</code>).</li>
            <li>No network layer, no RPC, no client-server protocol.</li>
          </ul>
        </Card>
        <Card>
          <h3>2. Durability-First</h3>
          <ul className={styles.list}>
            <li><b>WAL is Single Source of Truth (SSOT).</b></li>
            <li>MemTables are derived caches.</li>
            <li>Crash recovery replays WAL to reconstruct state.</li>
          </ul>
        </Card>
        <Card>
          <h3>3. Snapshot Isolation</h3>
          <ul className={styles.list}>
            <li><b>Bounded staleness:</b> writes visible only after Freeze.</li>
            <li>Active MemTable is <b>NOT</b> visible to readers.</li>
            <li>No read-your-writes until soft/explicit freeze.</li>
          </ul>
        </Card>
        <Card>
          <h3>4. Actor-Model Writes</h3>
          <ul className={styles.list}>
            <li>One writer thread per shard (event loop).</li>
            <li>Writes serialized via bounded MPSC mailbox.</li>
            <li>No lock contention on mutation path.</li>
          </ul>
        </Card>
        <Card>
          <h3>5. Lock-Free Readers</h3>
          <ul className={styles.list}>
            <li>Readers load atomic snapshot pointer.</li>
            <li>Read from immutable frozen structures only.</li>
            <li>Zero locks on read path.</li>
          </ul>
        </Card>
        <Card>
          <h3>6. Lifecycle</h3>
          <ul className={styles.list}>
            <li>Active (Mutable) &rarr; Frozen (Immutable) &rarr; Segment (Disk).</li>
            <li>State transitions are one-way and irreversible.</li>
          </ul>
        </Card>
      </div>

      <div style={{ margin: "3rem 0" }}></div>

      {/* --- 2. WHAT IT IS NOT --- */}
      <SectionHeading
        eyebrow="Anti-Patterns"
        title="What PomaiDB Is Not"
        description="Explicitly rejected identities. We will never converge toward these."
      />

      <div className={styles.grid}>
        <Card className={styles.forbidden}>
          <h3>NOT a FAISS-like Engine</h3>
          <ul className={styles.list}>
            <li>Not an ANN library wrapper.</li>
            <li>Value is <b>database correctness</b>, not recall races.</li>
            <li>If ANN is removed, PomaiDB is still valid.</li>
          </ul>
        </Card>
        <Card className={styles.forbidden}>
          <h3>NOT Search-First</h3>
          <ul className={styles.list}>
            <li>Not optimized for search parameter tuning.</li>
            <li>Not a SIMD/kernel-centric demo.</li>
            <li>Search is a query modality, not the reason for existence.</li>
          </ul>
        </Card>
        <Card className={styles.forbidden}>
          <h3>NOT Distributed</h3>
          <ul className={styles.list}>
            <li>No replication, consensus, or Paxos.</li>
            <li>No multi-tenancy or cluster management.</li>
            <li>Shard = In-process failure domain.</li>
          </ul>
        </Card>
      </div>

      <div style={{ margin: "3rem 0" }}></div>

      {/* --- 3. HARD GUARANTEES --- */}
      <SectionHeading
        eyebrow="Contract"
        title="Hard Guarantees"
        description="We must preserve and strengthen these properties at all costs."
      />

      <div className={styles.grid}>
        <Card>
          <h3>WAL Prefix Durability</h3>
          <p style={{ color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
            Write acknowledged only after WAL append. Crash recovery tolerates truncated tails.
          </p>
        </Card>
        <Card>
          <h3>Snapshot Isolation</h3>
          <p style={{ color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
            Readers observe a single, immutable snapshot. No mixed states.
          </p>
        </Card>
        <Card>
          <h3>No Read-Your-Writes</h3>
          <p style={{ color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
            Writes invisible until rotation (5000 items or explicit freeze).
          </p>
        </Card>
        <Card>
          <h3>Actor-Model Ordering</h3>
          <p style={{ color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
            Per-shard write order preserved via mailbox serialization.
          </p>
        </Card>
        <Card>
          <h3>Crash Safety</h3>
          <p style={{ color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
            Manifest updates are atomic (rename + fsync). No partial commits.
          </p>
        </Card>
        <Card>
          <h3>Immutability</h3>
          <p style={{ color: 'var(--pomai-muted)', fontSize: '0.9rem' }}>
            Frozen tables and Segments never change once created.
          </p>
        </Card>
      </div>

      <div style={{ margin: "4rem 0" }}></div>

      {/* --- 4. SEMANTICS REFERENCE --- */}
      <section className={styles.section}>
        <h2 style={{ color: '#fff', fontFamily: 'var(--font-sora)', marginBottom: '1.5rem' }}>
          Semantics Reference
        </h2>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Operation</th>
                <th>Durability</th>
                <th>Visibility</th>
                <th>Isolation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Put / Delete</td>
                <td>WAL appended (durable if fsync)</td>
                <td>Not visible until Freeze</td>
                <td>Per-shard mailbox</td>
              </tr>
              <tr>
                <td>Search / Get</td>
                <td>Reads snapshot state</td>
                <td>Snapshot only</td>
                <td>Snapshot Isolation</td>
              </tr>
              <tr>
                <td>Freeze</td>
                <td>Segment + Manifest fsync</td>
                <td>New snapshot atomic publish</td>
                <td>Shard-local</td>
              </tr>
              <tr>
                <td>Crash Recovery</td>
                <td>WAL Replay</td>
                <td>Visible after startup</td>
                <td>WAL Order</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Visibility Timeline</h4>
            <div className={styles.timeline}>
              {`T0: Put(id=1) → WAL appended
T1: Get(id=1) → NotFound (Active hidden)
T2: Count ≥ 5000 → Soft Freeze
T3: Get(id=1) → Found (In Snapshot)`}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Crash Recovery</h4>
            <div className={styles.timeline}>
              {`Crash at T: Active MemTable lost
Restart:
 1. Replay WAL into MemTable
 2. Rotate to Frozen (Visible)
 3. PublishSnapshot
 4. Readers see recovered state`}
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. ROADMAP CONSTRAINTS --- */}
      <div className={styles.grid}>
        <Card>
          <h3 style={{ color: '#4ade80' }}>Allowed Evolution</h3>
          <ul className={styles.list}>
            <li><b>Compaction & GC:</b> Merge segments, drop tombstones.</li>
            <li><b>Iterators:</b> Export dataset for training.</li>
            <li><b>Hardening:</b> Better fsync, checksums, format versioning.</li>
            <li><b>Metadata Indexing:</b> Block-level indexes (min/max).</li>
          </ul>
        </Card>
        <Card>
          <h3 style={{ color: '#ef4444' }}>Forbidden Evolution</h3>
          <ul className={styles.list}>
            <li><b>FAISS Tuning:</b> Exposing ef/nprobe/M as core API.</li>
            <li><b>Recall Races:</b> Benchmark gaming.</li>
            <li><b>Full-Text Search:</b> Inverted indexes, BM25.</li>
            <li><b>Distributed:</b> Raft, Paxos, Sharding.</li>
          </ul>
        </Card>
      </div>

      <div style={{ margin: "3rem 0" }}></div>

      {/* --- 6. SUCCESS CRITERIA --- */}
      <section className={styles.section}>
        <h2 style={{ color: '#fff', fontFamily: 'var(--font-sora)', marginBottom: '1.5rem' }}>
          Success Criteria
        </h2>
        <div className={styles.successGrid}>
          <div>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>PomaiDB Succeeds If:</h3>
            <ul className={styles.list} style={{ color: '#fff' }}>
              <li>It makes sense <b>without</b> ANN (indexes removed).</li>
              <li>WAL + Snapshot are the central architecture.</li>
              <li>It cannot be mistaken for FAISS.</li>
              <li>Storage quality (GC, Crash Safety) is first-class.</li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: 'var(--pomai-muted)', marginBottom: '1rem' }}>PomaiDB Fails If:</h3>
            <ul className={styles.list} style={{ color: 'var(--pomai-muted)' }}>
              <li>ANN tuning becomes the primary value.</li>
              <li>Search engine features dominate roadmap.</li>
              <li>Correctness is sacrificed for performance.</li>
              <li>Durability is weakened.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <div style={{
        borderTop: '1px solid var(--pomai-border)',
        paddingTop: '2rem',
        marginTop: '4rem',
        color: 'var(--pomai-muted)',
        fontSize: '0.85rem',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Maintainers: PomaiDB Core Team</span>
        <span>Reference: ARCHITECTURE.md, CONSISTENCY_MODEL.md</span>
      </div>

    </Container>
  );
}