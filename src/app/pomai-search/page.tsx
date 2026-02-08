import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import PomaiSearchNav, { pomaiSearchNavLinks } from "@/components/PomaiSearchNav";
import RichText from "@/components/RichText";
import { pomaiSearchDocs } from "@/lib/pomaiSearchDocs.generated";
import styles from "./pomai-search.module.css";

const highlights = [
  {
    title: "Deterministic search contract",
    body: "Stable routing, deterministic tie-breaks, and NaN-safe scoring ensure reproducible ranking.",
  },
  {
    title: "Hybrid vector + keyword",
    body: "Blend vector similarity with BM25 keyword scoring using an explicit alpha weight.",
  },
  {
    title: "Snapshot-native",
    body: "Replayable snapshots make it easy to persist and restore large indexes quickly.",
  },
];

export default function PomaiSearchLanding() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Pomai Search" tone="green" />
        <div>
          <h1>Pomai Search Engine</h1>
          <p>
            An embeddable vector search engine with deterministic ranking, hybrid retrieval, and
            replayable snapshots. Explore the docs, guarantees, and planned offline playground.
          </p>
        </div>
        <div className={styles.heroMeta}>
          <span>Source: {pomaiSearchDocs.source.repo}</span>
          <span>Last updated: {pomaiSearchDocs.source.lastUpdated}</span>
          <span>Revision: {pomaiSearchDocs.source.sha}</span>
        </div>
      </section>

      <PomaiSearchNav current="overview" />

      <div className={styles.callout}>
        <RichText content={pomaiSearchDocs.pages.overview} />
      </div>

      <div className={styles.grid}>
        {highlights.map((item) => (
          <Card key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </Card>
        ))}
      </div>

      <SectionHeading
        eyebrow="Documentation"
        title="Jump into the Pomai Search space"
        description="Each guide mirrors the PomaiDB trust pattern: guarantees, how-to, benchmarks, and playgrounds."
      />
      <div className={styles.linkGrid}>
        {pomaiSearchNavLinks.map((link) => (
          <Card key={link.href} className={styles.linkCard}>
            <h3>{link.label}</h3>
            <p>Open the {link.label.toLowerCase()} guide.</p>
            <a href={link.href}>Open →</a>
          </Card>
        ))}
      </div>
    </Container>
  );
}
