import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Tabs from "@/components/Tabs";
import styles from "./page.module.css";

const pythonQuickstart = `from pomaidb import Client

client = Client("./pomai-data")
client.create_collection("clips", dims=768)

client.upsert(
    "clips",
    ids=["clip-001"],
    vectors=[[0.12, 0.08, 0.33, 0.19]],
    metadata=[{"scene": "studio"}],
)

results = client.search("clips", query=[0.12, 0.09, 0.29, 0.15], k=10)
print(results)`;

const cppQuickstart = `#include "pomai/client.hpp"

int main() {
  pomai::Client client{"./pomai-data"};
  client.create_collection("clips", 768);

  client.upsert("clips", {"clip-001"}, {{0.12f, 0.08f, 0.33f, 0.19f}});

  auto results = client.search("clips", {0.12f, 0.09f, 0.29f, 0.15f}, 10);
  return results.empty();
}`;

export default function Home() {
  return (
    <div className={styles.page}>
      <Container>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroLabel}>
              <Badge label="Local-first vector database" tone="red" />
              <Badge label="C++20 embedded" tone="green" />
            </div>
            <h1>
              PomaiDB is a local-first embedded vector database engineered for
              crash-safe speed.
            </h1>
            <p>
              Low-RAM, disk-first storage with crash-safe WAL and an atomic
              manifest. Routed search with CBR-S keeps latency tight while
              preserving high recall.
            </p>
            <div className={styles.heroActions}>
              <Button href="/docs">Get Started</Button>
              <Button href="/benchmarks" variant="ghost">
                Run Benchmarks
              </Button>
              <Button
                href="https://github.com/pomai/pomaidb"
                variant="secondary"
              >
                View on GitHub
              </Button>
            </div>
            <div className={styles.stats}>
              <div>
                <span>Recall@10</span>
                <strong>&gt;= 0.94</strong>
              </div>
              <div>
                <span>Routed shards avg</span>
                <strong>~2</strong>
              </div>
              <div>
                <span>Crash-safe WAL</span>
                <strong>Atomic manifest</strong>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.glow} />
            <Image
              src="/pomai-logo.svg"
              alt="PomaiDB pomegranate logo"
              width={220}
              height={220}
              priority
            />
            <div className={styles.heroCard}>
              <span>Pomai Systems Core</span>
              <p>
                Shard actors keep memory flat while routed search avoids the
                all-shards penalty.
              </p>
            </div>
          </div>
        </section>
      </Container>

      <Container>
        <section className={styles.why}>
          <SectionHeading
            eyebrow="Why PomaiDB"
            title="Crash-safe storage, low-RAM search, and routed execution."
            description="PomaiDB brings embedded reliability to vector search. Every shard is a crash-safe actor that replays WAL deterministically and rebuilds indexes on demand."
          />
          <div className={styles.cardGrid}>
            <Card>
              <h3>Crash-safe storage</h3>
              <p>
                WAL-first writes with atomic manifest swaps guarantee recovery
                after power loss, even mid-commit.
              </p>
            </Card>
            <Card>
              <h3>Low-RAM, disk-first</h3>
              <p>
                Segment files stay on disk with targeted caching. RAM usage stays
                predictable in edge deployments.
              </p>
            </Card>
            <Card>
              <h3>Routed search (CBR-S)</h3>
              <p>
                Context-based routing narrows shard fanout to the most relevant
                embeddings without sacrificing recall.
              </p>
            </Card>
          </div>
        </section>
      </Container>

      <Container>
        <section className={styles.quickstart}>
          <SectionHeading
            eyebrow="Quickstart"
            title="Get to vector search in under 60 seconds."
            description="Embedded clients for Python and C++ make it easy to ship local-first AI, with crash safety and routed search turned on by default."
          />
          <Tabs
            tabs={[
              {
                label: "Python",
                content: <CodeBlock language="python" code={pythonQuickstart} />,
              },
              {
                label: "C++",
                content: <CodeBlock language="cpp" code={cppQuickstart} />,
              },
            ]}
          />
        </section>
      </Container>

      <Container>
        <section className={styles.unique}>
          <SectionHeading
            eyebrow="Pomai-unique"
            title="Routing intelligence plus crash safety contracts."
            description="CBR-S routing narrows shard fanout while the crash safety contract guarantees every write is either fully committed or fully rolled back."
          />
          <div className={styles.cardGrid}>
            <Card>
              <h3>CBR-S routing core</h3>
              <p>
                Context-based routing learns shard profiles per epoch and
                dual-probes when uncertainty rises to keep recall stable.
              </p>
            </Card>
            <Card>
              <h3>Crash safety contract</h3>
              <p>
                WAL-first writes plus atomic manifest swaps ensure deterministic
                recovery after power loss or sudden termination.
              </p>
            </Card>
          </div>
        </section>
      </Container>

      <Container>
        <section className={styles.benchmarks}>
          <SectionHeading
            eyebrow="Benchmarks snapshot"
            title="Performance that stays stable under stress."
            description="Representative workloads capture recall, latency percentiles, and shard routing density. Replace the CSV at any time." 
          />
          <div className={styles.benchmarkTable}>
            <div className={styles.tableHeader}>
              <span>Scenario</span>
              <span>p50</span>
              <span>p99</span>
              <span>Recall@10</span>
              <span>Routed shards avg</span>
            </div>
            {[
              {
                scenario: "overlap_hard",
                p50: "7.2ms",
                p99: "18.4ms",
                recall: "0.942",
                shards: "2.1",
              },
              {
                scenario: "epoch_drift_hard",
                p50: "8.1ms",
                p99: "20.7ms",
                recall: "0.936",
                shards: "2.3",
              },
              {
                scenario: "local_mix_50k",
                p50: "6.4ms",
                p99: "16.2ms",
                recall: "0.951",
                shards: "1.8",
              },
              {
                scenario: "edge_rss_cap",
                p50: "9.0ms",
                p99: "22.1ms",
                recall: "0.928",
                shards: "2.5",
              },
              {
                scenario: "embed_replay",
                p50: "5.7ms",
                p99: "14.8ms",
                recall: "0.947",
                shards: "1.6",
              },
            ].map((row) => (
              <div key={row.scenario} className={styles.tableRow}>
                <span>{row.scenario}</span>
                <span>{row.p50}</span>
                <span>{row.p99}</span>
                <span>{row.recall}</span>
                <span>{row.shards}</span>
              </div>
            ))}
          </div>
          <p className={styles.benchmarkNote}>
            Run locally: <code>tools/bench/run_bench.py --quick</code>
          </p>
        </section>
      </Container>

      <Container>
        <section className={styles.architecture}>
          <SectionHeading
            eyebrow="Architecture"
            title="Routing, shards, and crash-safe storage layers."
            description="PomaiDB isolates routing from storage. The engine fans out to shard actors, each backed by WAL, segments, and immutable indexes."
          />
          <div className={styles.diagram}>
            <div className={styles.diagramColumn}>
              <span>Engine</span>
              <div className={styles.diagramArrow}>→</div>
              <span>Router</span>
              <div className={styles.diagramArrow}>→</div>
              <span>Shard actors</span>
            </div>
            <div className={styles.diagramStack}>
              <div>WAL</div>
              <div>Segments</div>
              <div>Index</div>
            </div>
          </div>
          <Link href="/architecture" className={styles.linkArrow}>
            Explore full architecture →
          </Link>
        </section>
      </Container>

      <Container>
        <section className={styles.examples}>
          <SectionHeading
            eyebrow="Examples"
            title="SDK-ready samples in every language."
            description="From Python notebooks to embedded C++ services, PomaiDB keeps the API surface consistent across ecosystems."
          />
          <div className={styles.examplesGrid}>
            {[
              { label: "Python", id: "python" },
              { label: "JavaScript", id: "javascript" },
              { label: "TypeScript", id: "typescript" },
              { label: "Go", id: "go" },
              { label: "C++", id: "cpp" },
            ].map((language) => (
              <Link
                key={language.id}
                href={`/examples#${language.id}`}
                className={styles.exampleCard}
              >
                <h4>{language.label}</h4>
                <p>Ready-to-run snippets with search + upsert flows.</p>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
