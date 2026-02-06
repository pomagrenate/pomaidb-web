import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./benchmarks.module.css";

const runBench = `python tools/bench/run_bench.py --suite overlap_hard --quick\npython tools/bench/run_bench.py --suite epoch_drift_hard --quick`;

export default function BenchmarksPage() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Benchmarks" tone="red" />
        <h1>Benchmarks that stress real-world edge deployments.</h1>
        <p>
          PomaiDB focuses on recall, latency percentiles, and RSS stability under
          routed workloads. Upload CSV output later to populate the tables.
        </p>
      </section>

      <SectionHeading
        eyebrow="How we measure"
        title="Recall, latency, and resident memory stay in balance."
        description="We track recall@k and latency percentiles across routed shard workloads while capping RSS for embedded targets."
      />

      <div className={styles.metricsGrid}>
        <Card>
          <h3>Recall@k</h3>
          <p>
            Measures quality against ground truth. We expect recall@10 to stay
            above 0.94 in hard scenarios.
          </p>
        </Card>
        <Card>
          <h3>Latency percentiles</h3>
          <p>
            Track p50/p90/p99 for routed queries. Tail latency is the key metric
            for edge inference.
          </p>
        </Card>
        <Card>
          <h3>RSS ceiling</h3>
          <p>
            Memory stays bounded. Shards swap segments from disk to keep RAM flat
            during spikes.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="Hard scenarios"
        title="Workloads that punish routing and storage."
        description="Overlap and epoch drift suites simulate distribution shifts while enforcing crash-safe writes."
      />

      <div className={styles.scenarioGrid}>
        <Card>
          <h3>overlap_hard</h3>
          <p>
            Dense vector overlap across shards. Validates CBR-S routing precision
            without losing recall.
          </p>
        </Card>
        <Card>
          <h3>epoch_drift_hard</h3>
          <p>
            Tests shard routing after distribution shifts. Ensures manifest + WAL
            replay keep indexes coherent.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="Benchmark table"
        title="CSV-ready results"
        description="Drop in a CSV or JSON file to populate this grid with real numbers."
      />

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Scenario</span>
          <span>p50</span>
          <span>p99</span>
          <span>Recall@10</span>
          <span>RSS (MB)</span>
        </div>
        {[
          {
            scenario: "overlap_hard",
            p50: "7.2ms",
            p99: "18.4ms",
            recall: "0.942",
            rss: "182",
          },
          {
            scenario: "epoch_drift_hard",
            p50: "8.1ms",
            p99: "20.7ms",
            recall: "0.936",
            rss: "190",
          },
          {
            scenario: "edge_rss_cap",
            p50: "9.0ms",
            p99: "22.1ms",
            recall: "0.928",
            rss: "168",
          },
        ].map((row) => (
          <div key={row.scenario} className={styles.tableRow}>
            <span>{row.scenario}</span>
            <span>{row.p50}</span>
            <span>{row.p99}</span>
            <span>{row.recall}</span>
            <span>{row.rss}</span>
          </div>
        ))}
      </div>
      <p className={styles.uploadNote}>
        CSV upload placeholder: connect your local benchmark runner output to
        render this table automatically.
      </p>

      <SectionHeading
        eyebrow="Run it"
        title="Reproduce results locally"
        description="Benchmark scripts live in tools/bench. Use --quick for a fast sanity run."
      />
      <CodeBlock language="bash" code={runBench} caption="Bench runner" />
    </Container>
  );
}
