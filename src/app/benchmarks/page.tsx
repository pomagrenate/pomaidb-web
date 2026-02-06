import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./benchmarks.module.css";

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
