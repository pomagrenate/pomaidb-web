import Badge from "@/components/Badge";
import Container from "@/components/Container";
import PomaiSearchNav from "@/components/PomaiSearchNav";
import RichText from "@/components/RichText";
import { pomaiSearchDocs } from "@/lib/pomaiSearchDocs.generated";
import styles from "../pomai-search.module.css";

export default function PomaiSearchSnapshots() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Pomai Search" tone="green" />
        <div>
          <h1>Snapshots &amp; determinism contract</h1>
          <p>Replayable snapshots and contract-driven deterministic ranking.</p>
        </div>
        <div className={styles.heroMeta}>
          <span>Source: {pomaiSearchDocs.source.repo}</span>
          <span>Last updated: {pomaiSearchDocs.source.lastUpdated}</span>
          <span>Revision: {pomaiSearchDocs.source.sha}</span>
        </div>
      </section>

      <PomaiSearchNav current="snapshots" />

      <RichText content={pomaiSearchDocs.pages.snapshots} />
    </Container>
  );
}
