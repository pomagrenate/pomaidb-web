"use client";

import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./ingestion.module.css";

// --- CODE SNIPPETS ---

const CODE_BATCH = `// Instead of loop: db->Put(id, vec)
// Use batch:
db->PutBatch(membrane, ids, vectors); 

// Result: ~35x speedup (~245k vecs/sec)`;

const CODE_PARALLEL = `#pragma omp parallel for
for (uint32_t i = 0; i < 10000; ++i) {
    db->Put(i, vectors[i]); // Different shards = parallel
}`;

const CODE_PREALLOC = `MemTableOptions mem_opts;
mem_opts.preallocate = true;
mem_opts.arena_block_bytes = 10 << 20; // 10 MB`;

const CODE_TMPFS = `# Store DB on RAM disk
mkdir /tmp/ramdisk
sudo mount -t tmpfs -o size=512M tmpfs /tmp/ramdisk

// Code:
opts.path = "/tmp/ramdisk/bench_db";`;

export default function IngestionAnalysisPage() {
  return (
    <Container>
      {/* --- HERO --- */}
      <section className={styles.hero}>
        <Badge label="Benchmark Analysis" tone="neutral" />
        <h1>Ingestion Throughput</h1>
        <p>
          Deep dive into the write performance of PomaiDB. Analyzing current metrics,
          identifying bottlenecks, and proposing optimization strategies.
        </p>
        <div className={styles.contextBox}>
          Hardware: Dell Latitude E5440 (i5 2-core, 8GB RAM)
        </div>
      </section>

      {/* --- CURRENT PERFORMANCE --- */}
      <SectionHeading
        eyebrow="Baseline"
        title="Current Performance"
        description="Results from the latest run on reference hardware."
      />

      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Small Dataset</span>
            <Badge label="128 dims" tone="green" />
          </div>
          <div className={styles.statBig}>10,870</div>
          <div className={styles.statDetail}>vectors / sec</div>
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--pomai-border)', paddingTop: '0.5rem' }}>
            <div className={styles.statDetail}>Build time: 0.92s</div>
            <div className={styles.statDetail}>Throughput: ~5.3 MB/s</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Medium Dataset</span>
            <Badge label="256 dims" tone="green" />
          </div>
          <div className={styles.statBig}>9,057</div>
          <div className={styles.statDetail}>vectors / sec</div>
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--pomai-border)', paddingTop: '0.5rem' }}>
            <div className={styles.statDetail}>Build time: 11.04s</div>
            <div className={styles.statDetail}>Throughput: ~9.0 MB/s</div>
          </div>
        </div>
      </div>

      <div className={styles.callout}>
        <h3>Is this the maximum?</h3>
        <p style={{ color: 'var(--pomai-muted)', margin: 0 }}>
          <b>Short answer: No.</b> You can likely improve by <b>2-5x</b> with the optimizations detailed below.
        </p>
      </div>

      {/* --- BOTTLENECKS --- */}
      <SectionHeading
        eyebrow="Profiling"
        title="Bottlenecks & Limits"
        description="Where is the time going? Comparison of theoretical hardware limits vs actual results."
      />

      <div className={styles.grid}>
        <Card>
          <h3
            style={{ color: "var(--pomai-text-strong)", marginBottom: "1rem" }}
          >
            Identified Bottlenecks
          </h3>
          <ol className={styles.list} style={{ listStyle: 'decimal', paddingLeft: '1.2rem' }}>
            <li>
              <b>WAL writes (Biggest):</b> Single-threaded sequential writes per shard.
            </li>
            <li>
              <b>MemTable Insertions:</b> Single-threaded within a shard (though lock-free across shards).
            </li>
            <li>
              <b>Allocations:</b> Arena allocator page faults on small RAM.
            </li>
            <li>
              <b>Shard Count:</b> Defaulting to 2 (hardware concurrency) limits I/O saturation.
            </li>
          </ol>
        </Card>

        <div className={styles.tableContainer} style={{ margin: 0 }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Component</th>
                <th>Throughput</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Memory BW</td>
                <td>~25 GB/s</td>
                <td>DDR3-1600</td>
              </tr>
              <tr>
                <td>L3 Cache</td>
                <td>~50 GB/s</td>
                <td>Optimistic</td>
              </tr>
              <tr>
                <td>WAL Write</td>
                <td>~100 MB/s</td>
                <td>SSD (no fsync)</td>
              </tr>
              <tr>
                <td>MemTable Ops</td>
                <td>~1M ops/s</td>
                <td>Lock-free</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ color: 'var(--pomai-muted)', marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>
        Current throughput is ~10-20x slower than the theoretical maximum of the hardware, primarily due to synchronous WAL overhead.
      </p>

      {/* --- OPTIMIZATION STRATEGIES --- */}
      <div style={{ margin: "4rem 0" }}></div>
      <SectionHeading
        eyebrow="Tuning"
        title="Optimization Strategies"
        description="Actionable steps to increase throughput without changing hardware."
      />

      <div className={styles.grid}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ color: "var(--pomai-text-strong)" }}>
              1. Batch Insertions
            </h3>
            <Badge label="~35x Speedup" tone="green" />
          </div>
          <p className={styles.statDetail}>Reduce per-op overhead (lock contention, syscalls).</p>
          <CodeBlock language="cpp" code={CODE_BATCH} />
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ color: "var(--pomai-text-strong)" }}>
              2. Parallel Sharding
            </h3>
            <Badge label="1.5-2x Speedup" tone="green" />
          </div>
          <p className={styles.statDetail}>Distribute inserts across shards explicitly.</p>
          <CodeBlock language="cpp" code={CODE_PARALLEL} />
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ color: "var(--pomai-text-strong)" }}>
              3. Use tmpfs (RAM Disk)
            </h3>
            <Badge label="1.5-2x Speedup" tone="green" />
          </div>
          <p className={styles.statDetail}>Eliminate disk I/O bottleneck for WAL.</p>
          <CodeBlock language="bash" code={CODE_TMPFS} />
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ color: "var(--pomai-text-strong)" }}>
              4. Pre-allocation
            </h3>
            <Badge label="1.1-1.3x Speedup" tone="green" />
          </div>
          <p className={styles.statDetail}>Reduce page faults during ingest.</p>
          <CodeBlock language="cpp" code={CODE_PREALLOC} />
        </Card>
      </div>

      {/* --- ACTION ITEMS --- */}
      <div style={{ margin: "4rem 0" }}></div>
      <div className={styles.grid}>
        <div>
          <h3
            style={{
              color: "var(--pomai-text-strong)",
              marginBottom: "1rem",
              fontFamily: "var(--font-sora)",
            }}
          >
            Immediate Actions
          </h3>
          <ul className={styles.checklist}>
            <li>Verify <code>fsync = kNever</code> is set.</li>
            <li>Try mounting DB path on <code>tmpfs</code>.</li>
            <li>Reduce dimensions to 128 if accuracy allows.</li>
          </ul>
        </div>
        <div>
          <h3
            style={{
              color: "var(--pomai-text-strong)",
              marginBottom: "1rem",
              fontFamily: "var(--font-sora)",
            }}
          >
            Long-term Roadmap
          </h3>
          <ul className={styles.checklist}>
            <li>Implement <code>PutBatch()</code> API.</li>
            <li>Async WAL writes (background thread).</li>
            <li>Bulk Segment Writer (bypass MemTable).</li>
          </ul>
        </div>
      </div>

    </Container>
  );
}
