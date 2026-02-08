import Badge from "@/components/Badge";
import Container from "@/components/Container";
import PomaiSearchNav from "@/components/PomaiSearchNav";
import RichText from "@/components/RichText";
import { pomaiSearchDocs } from "@/lib/pomaiSearchDocs.generated";
import styles from "../pomai-search.module.css";

export default function PomaiSearchGettingStarted() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Pomai Search" tone="green" />
        <div>
          <h1>Quickstart</h1>
          <p>Install Pomai Search, configure your first engine, and run a simple query.</p>
        </div>
        <div className={styles.heroMeta}>
          <span>Source: {pomaiSearchDocs.source.repo}</span>
          <span>Last updated: {pomaiSearchDocs.source.lastUpdated}</span>
          <span>Revision: {pomaiSearchDocs.source.sha}</span>
        </div>
      </section>

      <PomaiSearchNav current="gettingStarted" />

      <RichText content={pomaiSearchDocs.pages.gettingStarted} />
    </Container>
  );
}
