import Link from "next/link";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./docs.module.css";

const docsGroups = [
  {
    title: "Getting Started",
    description: "Install, create your first collection, and run a local search.",
    links: [
      { label: "Quickstart", href: "/docs/get-started" },
      { label: "Client setup", href: "/docs/get-started#client-setup" },
    ],
  },
  {
    title: "Concepts",
    description: "Learn how shards, WAL, and manifests fit together.",
    links: [
      { label: "Shard actors", href: "/docs#shards" },
      { label: "Crash safety contract", href: "/docs#crash-safety" },
      { label: "Search quality", href: "/docs#search-quality" },
    ],
  },
  {
    title: "Operations",
    description: "Benchmarks, crash testing, and deployment guides.",
    links: [
      { label: "Running benchmarks", href: "/benchmarks" },
      { label: "Crash testing", href: "/docs#crash-testing" },
    ],
  },
];

export default function DocsPage() {
  return (
    <Container>
      <section className={styles.hero}>
        <div>
          <Badge label="Docs" tone="green" />
          <h1>PomaiDB documentation</h1>
          <p>
            Everything you need to build crash-safe local vector search. Learn
            the storage layout, routing design, and operational practices behind
            PomaiDB.
          </p>
        </div>
        <div className={styles.heroCard}>
          <span>MDX-ready</span>
          <p>
            Docs live alongside the product. Add new MDX pages under
            <code> /docs</code> to grow the knowledge base.
          </p>
        </div>
      </section>

      <SectionHeading
        eyebrow="Documentation"
        title="Start with the fundamentals."
        description="Each section mirrors PomaiDB components: crash-safe storage, routing, and operational discipline."
      />

      <div className={styles.grid}>
        {docsGroups.map((group) => (
          <Card key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.description}</p>
            <div className={styles.links}>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label} →
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.sections}>
        <div id="shards" className={styles.section}>
          <h2>Shard actors</h2>
          <p>
            Each shard is an isolated actor that owns its WAL, segment files, and
            index. Routed search fans out to the smallest viable shard set,
            keeping tail latency low even on edge devices.
          </p>
        </div>
        <div id="crash-safety" className={styles.section}>
          <h2>Crash safety contract</h2>
          <p>
            Writes land in the WAL first, followed by an atomic manifest update.
            On recovery PomaiDB replays the WAL, truncates incomplete batches,
            and rebuilds indexes deterministically.
          </p>
        </div>
        <div id="search-quality" className={styles.section}>
          <h2>Search quality</h2>
          <p>
            CBR-S routing keeps recall stable under dynamic data distributions by
            probing the most relevant shards first and falling back when needed.
          </p>
        </div>
        <div id="crash-testing" className={styles.section}>
          <h2>Crash testing</h2>
          <p>
            Stress PomaiDB with repeated crash loops. The crash harness validates
            WAL replay, manifest atomicity, and shard index rebuilds.
          </p>
        </div>
      </div>
    </Container>
  );
}
