import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import PomaiSearchNav from "@/components/PomaiSearchNav";
import RichText from "@/components/RichText";
import { pomaiSearchDocs } from "@/lib/pomaiSearchDocs.generated";
import styles from "../pomai-search.module.css";

const guardrails = [
  "Preset sizes (10k/50k/100k) and dims (128/256/384).",
  "Memory estimate shown before ingest.",
  "Heavy tasks move to a Web Worker.",
  "Optional oracle recall only for small datasets.",
];

export default function PomaiSearchPlayground() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Pomai Search" tone="green" />
        <div>
          <h1>Playground</h1>
          <p>Offline WASM demos that prove deterministic ingest and hybrid search.</p>
        </div>
        <div className={styles.heroMeta}>
          <span>Source: {pomaiSearchDocs.source.repo}</span>
          <span>Last updated: {pomaiSearchDocs.source.lastUpdated}</span>
          <span>Revision: {pomaiSearchDocs.source.sha}</span>
        </div>
      </section>

      <PomaiSearchNav current="playground" />

      <RichText content={pomaiSearchDocs.pages.playground} />

      <section className={styles.section}>
        <h2>Guardrails for the upcoming demo</h2>
        <div className={styles.grid}>
          {guardrails.map((item) => (
            <Card key={item}>
              <p>{item}</p>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
