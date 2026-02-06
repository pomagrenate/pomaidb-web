import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./benchmarks.module.css";

// --- STATIC DATA FROM BENCHMARKS ---

type ScenarioResult = {
  mode: string;
  p99: number;
  qps: number;
  ingest_qps: number;
  recall: number;
  shards: number;
  verdict: "PASS" | "WARN" | "FAIL";
};

type DatasetGroup = {
  name: string;
  specs: string; // e.g. "dim=256 n=150k"
  scenarios: ScenarioResult[];
};

const BENCHMARK_DATA: DatasetGroup[] = [
  {
    name: "Small Uniform",
    specs: "dim=128 n=60k q=800 topk=10 shards=4",
    scenarios: [
      { mode: "fanout", p99: 3740.5, qps: 103.8, ingest_qps: 67736.5, recall: 1.0, shards: 4.0, verdict: "PASS" },
      { mode: "cbrs", p99: 8390.8, qps: 71.1, ingest_qps: 64853.2, recall: 1.0, shards: 1.06, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 8488.5, qps: 70.9, ingest_qps: 68678.1, recall: 1.0, shards: 1.06, verdict: "PASS" },
    ],
  },
  {
    name: "Medium Clustered",
    specs: "dim=256 n=150k q=800 topk=10 shards=4",
    scenarios: [
      { mode: "fanout", p99: 13579.1, qps: 30.2, ingest_qps: 65240.8, recall: 1.0, shards: 4.0, verdict: "PASS" },
      { mode: "cbrs", p99: 22433.8, qps: 25.3, ingest_qps: 46058.8, recall: 1.0, shards: 1.7, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 22626.6, qps: 25.2, ingest_qps: 44996.7, recall: 1.0, shards: 1.7, verdict: "PASS" },
    ],
  },
  {
    name: "Large Clustered",
    specs: "dim=256 n=400k q=400 topk=10 shards=8",
    scenarios: [
      { mode: "fanout", p99: 29113.1, qps: 11.1, ingest_qps: 59317.8, recall: 1.0, shards: 8.0, verdict: "PASS" },
      { mode: "cbrs", p99: 58733.7, qps: 10.3, ingest_qps: 36182.9, recall: 1.0, shards: 2.0, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 63280.6, qps: 10.6, ingest_qps: 29583.7, recall: 1.0, shards: 2.0, verdict: "PASS" },
    ],
  },
  {
    name: "High Dim (Top 1)",
    specs: "dim=512 n=200k q=400 topk=1 shards=4",
    scenarios: [
      { mode: "fanout", p99: 30522.0, qps: 14.5, ingest_qps: 38356.8, recall: 0.1, shards: 4.0, verdict: "PASS" },
      { mode: "cbrs", p99: 73674.3, qps: 9.4, ingest_qps: 25577.2, recall: 0.1, shards: 1.87, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 68675.5, qps: 9.6, ingest_qps: 24335.3, recall: 0.1, shards: 1.87, verdict: "PASS" },
    ],
  },
  {
    name: "High Dim (Top 100)",
    specs: "dim=512 n=200k q=400 topk=100 shards=4",
    scenarios: [
      { mode: "fanout", p99: 30990.7, qps: 13.2, ingest_qps: 36105.1, recall: 1.0, shards: 4.0, verdict: "PASS" },
      { mode: "cbrs", p99: 73776.8, qps: 10.1, ingest_qps: 23471.7, recall: 1.0, shards: 1.87, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 68051.1, qps: 10.6, ingest_qps: 27359.3, recall: 1.0, shards: 1.87, verdict: "PASS" },
    ],
  },
  {
    name: "Overlap",
    specs: "dim=256 n=120k q=700 topk=10 shards=4",
    scenarios: [
      { mode: "fanout", p99: 13664.9, qps: 35.3, ingest_qps: 61464.0, recall: 1.0, shards: 4.0, verdict: "PASS" },
      { mode: "cbrs", p99: 32502.7, qps: 24.3, ingest_qps: 34806.9, recall: 1.0, shards: 1.77, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 24080.0, qps: 25.3, ingest_qps: 47523.5, recall: 1.0, shards: 1.77, verdict: "PASS" },
    ],
  },
  {
    name: "Overlap Hard",
    specs: "dim=256 n=120k q=700 topk=10 shards=4",
    scenarios: [
      { mode: "fanout", p99: 11061.3, qps: 37.4, ingest_qps: 63500.4, recall: 1.0, shards: 4.0, verdict: "PASS" },
      { mode: "cbrs", p99: 25408.4, qps: 25.1, ingest_qps: 46158.1, recall: 1.0, shards: 1.74, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 25199.8, qps: 25.1, ingest_qps: 48665.7, recall: 1.0, shards: 1.74, verdict: "PASS" },
    ],
  },
  {
    name: "Skew",
    specs: "dim=128 n=120k q=700 topk=10 shards=8",
    scenarios: [
      { mode: "fanout", p99: 6841.5, qps: 49.6, ingest_qps: 63700.1, recall: 1.0, shards: 8.0, verdict: "PASS" },
      { mode: "cbrs", p99: 15420.3, qps: 36.7, ingest_qps: 40844.1, recall: 1.0, shards: 1.88, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 15741.7, qps: 36.7, ingest_qps: 54319.9, recall: 1.0, shards: 1.88, verdict: "PASS" },
    ],
  },
  {
    name: "Skew Hard",
    specs: "dim=128 n=120k q=700 topk=10 shards=8",
    scenarios: [
      { mode: "fanout", p99: 6903.1, qps: 49.0, ingest_qps: 65547.6, recall: 1.0, shards: 8.0, verdict: "PASS" },
      { mode: "cbrs", p99: 17544.6, qps: 34.7, ingest_qps: 55858.6, recall: 1.0, shards: 1.98, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 24248.9, qps: 33.0, ingest_qps: 62893.8, recall: 1.0, shards: 1.98, verdict: "PASS" },
    ],
  },
  {
    name: "Epoch Drift Hard",
    specs: "dim=256 n=120k q=800 topk=10 shards=4",
    scenarios: [
      { mode: "fanout", p99: 17004.5, qps: 31.5, ingest_qps: 34104.4, recall: 1.0, shards: 4.0, verdict: "PASS" },
      { mode: "cbrs", p99: 25772.1, qps: 28.1, ingest_qps: 31798.1, recall: 0.9703, shards: 1.0, verdict: "PASS" },
      { mode: "cbrs_no_dual", p99: 24737.5, qps: 28.5, ingest_qps: 32466.4, recall: 0.5, shards: 1.0, verdict: "WARN" },
    ],
  },
];

const metricsJsonExample = `{
  "build": { "time_sec": 45.67, "memory_mb": 2929.69 },
  "search_latency_us": { "mean": 234.56, "p50": 221.34, "p90": 312.45, "p99": 456.78, "p999": 789.12 },
  "throughput": { "qps": 68432.12 },
  "accuracy": { "recall_at_10": 0.9234 }
}`;

const cbrsFields = `scenario,routing,dataset,dim,n,queries,topk,shards,
ingest_sec,ingest_qps,query_qps,
p50_us,p90_us,p95_us,p99_us,p999_us,
recall1,recall10,recall100,
routed_shards_avg,routed_shards_p95,
routed_probe_avg,routed_probe_p95,
routed_buckets_avg,routed_buckets_p95,
rss_open_kb,rss_ingest_kb,rss_query_kb,peak_rss_kb,
user_cpu_sec,sys_cpu_sec,verdict,error`;

function MetricCard({
  title,
  subtitle,
  bullets,
}: {
  title: string;
  subtitle: string;
  bullets: string[];
}) {
  return (
    <Card>
      <h3>{title}</h3>
      <p className={styles.muted}>{subtitle}</p>
      <ul className={styles.list}>
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </Card>
  );
}

// Helper to format numbers
const fmtNum = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });

export default function BenchmarksPage() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Benchmarks" tone="red" />
        <h1>Performance you can reason about.</h1>
        <p>
          PomaiDB benchmarks are built around production-grade metrics: latency
          percentiles, throughput, recall against an oracle, and memory footprint.
          The goal is not “one fast number” — it’s understanding tail behavior,
          scaling trends, and failure modes.
        </p>

        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <div className={styles.statTop}>Tail latency</div>
            <div className={styles.statVal}>P99 / P999</div>
            <div className={styles.statSub}>microseconds, not vibes</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statTop}>Quality</div>
            <div className={styles.statVal}>Recall@k</div>
            <div className={styles.statSub}>vs brute-force oracle</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statTop}>Scaling</div>
            <div className={styles.statVal}>QPS & RSS</div>
            <div className={styles.statSub}>throughput + memory</div>
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: LIVE BENCHMARK RESULTS --- */}
      <SectionHeading
        eyebrow="Live Data"
        title="Comprehensive Benchmark Suite"
        description="Results from the latest CI run. Comparing Fanout (Baseline) vs CBR-S (Smart Routing). Note how routing drastically reduces shards visited (routed_shards_avg) at the cost of some routing overhead."
      />

      <div style={{ marginBottom: "4rem" }}>
        {BENCHMARK_DATA.map((dataset) => (
          <div key={dataset.name} style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "1rem",
                borderBottom: "1px solid var(--pomai-border)",
                paddingBottom: "0.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  color: "var(--pomai-text-strong)",
                  margin: 0,
                }}
              >
                {dataset.name}
              </h3>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--pomai-muted)",
                  fontFamily: "monospace",
                }}
              >
                {dataset.specs}
              </span>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <span>Mode</span>
                <span>Recall@10</span>
                <span>P99 (µs)</span>
                <span>Query QPS</span>
                <span>Shards Visited</span>
                <span>Verdict</span>
              </div>
              {dataset.scenarios.map((row) => (
                <div key={row.mode} className={styles.tableRow}>
                  <span
                    style={{
                      fontWeight: 500,
                      color:
                        row.mode === "fanout"
                          ? "var(--pomai-text-strong)"
                          : "var(--pomai-link)",
                    }}
                  >
                    {row.mode}
                  </span>
                  <span style={{ color: row.recall < 0.9 ? "#ff4444" : "#4ade80" }}>
                    {row.recall.toFixed(4)}
                  </span>
                  <span>{fmtNum(row.p99)}</span>
                  <span>{fmtNum(row.qps)}</span>
                  <span>{row.shards.toFixed(2)}</span>
                  <span style={{
                    color: row.verdict === 'PASS' ? '#4ade80' : row.verdict === 'WARN' ? '#facc15' : '#ff4444',
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}>
                    {row.verdict}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionHeading
        eyebrow="What we measure"
        title="Industry-standard metrics"
        description="PomaiDB’s benchmark suite focuses on the five metrics that actually predict production behavior."
      />

      <div className={styles.grid}>
        <MetricCard
          title="1) Search latency (µs)"
          subtitle="Single-query response time with percentile breakdown."
          bullets={[
            "Mean is not enough — track P50, P90, P99, P999.",
            "Tail blow-ups usually signal contention, allocator churn, or IO stalls.",
            "In production, P99 < 10ms is a common target; embedded systems often aim lower.",
          ]}
        />
        <MetricCard
          title="2) Throughput (QPS)"
          subtitle="How much work the system can sustain under load."
          bullets={[
            "QPS should scale with threads until CPU saturation.",
            "If QPS drops as threads increase, look for contention or cache thrashing.",
            "Track ingest_qps separately from query_qps.",
          ]}
        />
        <MetricCard
          title="3) Recall@k"
          subtitle="Accuracy vs a brute-force ground truth oracle."
          bullets={[
            "Recall@10 ≥ 0.94 is a practical target for many ANN workloads.",
            "Use recall@1/10/100 to detect quality cliffs across k.",
            "If recall changes across epochs, routing / snapshot semantics are suspect.",
          ]}
        />
        <MetricCard
          title="4) Build time"
          subtitle="Time to index all vectors (insert + persistence boundary)."
          bullets={[
            "Build time is often the hidden cost of ‘fast queries’.",
            "Separate: raw ingest vs any freeze/flush/segment work.",
            "Track total wall time + CPU (user/sys).",
          ]}
        />
        <MetricCard
          title="5) Memory usage (RSS)"
          subtitle="Resident set size (open/ingest/query) and peak RSS."
          bullets={[
            "RSS is the truth for embedded systems.",
            "Peak RSS matters: it determines whether you OOM in real deployments.",
            "Compare RSS against raw vector bytes to estimate overhead ratio.",
          ]}
        />
        <MetricCard
          title="CBR-S routing behavior"
          subtitle="When routing is enabled, measure how much work is avoided."
          bullets={[
            "routed_shards_avg/p95: fan-out reduction at engine level.",
            "routing_probe_avg/p95: adaptivity under overlap/ambiguity.",
            "routed_buckets_* (or candidates scanned): local work avoided inside shards.",
          ]}
        />
      </div>

      <SectionHeading
        eyebrow="How to interpret"
        title="Signals that matter"
        description="Use these heuristics to quickly understand whether performance is healthy or masking a problem."
      />

      <div className={styles.grid}>
        <Card>
          <h3>Good signs</h3>
          <ul className={styles.list}>
            <li>
              <b>P99 stays close to P50</b> (no tail explosions).
            </li>
            <li>
              <b>QPS increases</b> with threads until expected saturation.
            </li>
            <li>
              <b>Recall@10 stable</b> across dataset modes and routing epochs.
            </li>
            <li>
              <b>routed_shards_avg</b> drops significantly vs shard count, without recall loss.
            </li>
            <li>
              <b>RSS overhead bounded</b> (no runaway allocations / leaks).
            </li>
          </ul>
        </Card>

        <Card>
          <h3>Red flags</h3>
          <ul className={styles.list}>
            <li>
              <b>P99 ≫ P50</b> (10×+) — tail variance, often contention or IO.
            </li>
            <li>
              <b>QPS decreases</b> with more threads — thrash or locks.
            </li>
            <li>
              <b>Recall drops</b> in overlap/epoch drift — routing or snapshot semantics issues.
            </li>
            <li>
              <b>Peak RSS spikes</b> — allocation churn or caching gone wrong.
            </li>
            <li>
              <b>Ingest_qps collapses</b> with shards — mailbox/backpressure or WAL overhead.
            </li>
          </ul>
        </Card>

        <Card>
          <h3>Expected behavior</h3>
          <p className={styles.muted}>
            Some scenarios are intentionally adversarial and should trigger more probing work.
          </p>
          <ul className={styles.list}>
            <li>
              <b>overlap_hard</b>: routing margins are small ⇒ routing_probe increases.
            </li>
            <li>
              <b>skew_hard</b>: hot centroid ⇒ hotspot pressure (watch tail + fairness).
            </li>
            <li>
              <b>epoch_drift_hard</b>: dual-probe should preserve recall across epoch transitions.
            </li>
          </ul>
        </Card>
      </div>

      <SectionHeading
        eyebrow="CBR-S suite"
        title="What the CBR-S benchmark reports"
        description="The CBR-S benchmark is designed to expose routing wins and routing failure modes under realistic and adversarial distributions."
      />

      <div className={styles.grid}>
        <Card>
          <h3>Core fields</h3>
          <p className={styles.muted}>
            These columns are the “source of truth” for comparing fanout vs routed search.
          </p>
          <CodeBlock language="text" code={cbrsFields} />
        </Card>

        <Card>
          <h3>Verdict rules (conceptual)</h3>
          <ul className={styles.list}>
            <li>
              <b>PASS</b>: recall@10 meets target and work avoided is meaningful (p99 or routed_shards win).
            </li>
            <li>
              <b>WARN</b>: recall is fine but routing doesn’t reduce work (or latency doesn’t improve).
            </li>
            <li>
              <b>FAIL</b>: recall below target or scenario errors.
            </li>
          </ul>
          <p className={styles.muted}>
            For epoch drift, dual-probe is expected to preserve recall under routing epoch transitions.
          </p>
        </Card>

        <Card>
          <h3>JSON report shape</h3>
          <p className={styles.muted}>
            Reports are designed to be machine-readable for CI history tracking.
          </p>
          <CodeBlock language="json" code={metricsJsonExample} />
        </Card>
      </div>

      <SectionHeading
        eyebrow="Device reality"
        title="Performance is hardware-dependent"
        description="PomaiDB is embedded-first. Always interpret results in the context of CPU cores, memory bandwidth, and IO settings."
      />

      <div className={styles.grid}>
        <Card>
          <h3>Low-end devices</h3>
          <p className={styles.muted}>
            On small CPUs, contention and cache thrashing can dominate. Tail latency will expose this first.
          </p>
          <ul className={styles.list}>
            <li>Watch P99/P999 and QPS scaling with threads.</li>
            <li>Prefer stable behavior over peak throughput.</li>
            <li>RSS must remain predictable; peak spikes are unacceptable in embedded deployments.</li>
          </ul>
        </Card>

        <Card>
          <h3>What matters most</h3>
          <ul className={styles.list}>
            <li>
              <b>Tail latency</b> (P99/P999) is your correctness-of-performance metric.
            </li>
            <li>
              <b>Recall stability</b> is your correctness-of-search metric.
            </li>
            <li>
              <b>Work avoided</b> (routed_shards / buckets) is your routing ROI metric.
            </li>
          </ul>
        </Card>

        <Card>
          <h3>Pomai mindset</h3>
          <p className={styles.muted}>
            “Fast” isn’t a single number. It’s a profile: predictable tails, bounded memory, and stable quality under stress.
          </p>
        </Card>
      </div>

      <section className={styles.footerNote}>
        <p className={styles.muted}>
          This page describes how to <b>evaluate performance</b>. Benchmark execution details live in the repo tooling and CI,
          but interpretation should remain stable as the system evolves.
        </p>
      </section>
    </Container>
  );
}
