import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./architecture.module.css";

export default function ArchitecturePage() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Architecture" tone="green" />
        <h1>Crash-safe storage and routed search, engineered in layers.</h1>
        <p>
          PomaiDB combines an embedded storage engine with a router that narrows
          query fanout. Each shard is a crash-safe actor with WAL-backed segments
          and deterministic replay.
        </p>
      </section>

      <SectionHeading
        eyebrow="System overview"
        title="Engine → Router → Shards"
        description="The engine coordinates request flow, the router selects shard targets via CBR-S, and shard actors handle WAL + segment management."
      />

      <div className={styles.diagram}>
        <div className={styles.diagramRow}>
          <div className={styles.diagramNode}>Engine</div>
          <div className={styles.diagramArrow}>→</div>
          <div className={styles.diagramNode}>CBR-S Router</div>
          <div className={styles.diagramArrow}>→</div>
          <div className={styles.diagramNode}>Shard Actors</div>
        </div>
        <div className={styles.diagramStack}>
          <div>WAL</div>
          <div>Segments</div>
          <div>Manifest</div>
          <div>Index</div>
        </div>
      </div>

      <SectionHeading
        eyebrow="File layout"
        title="WAL, segments, and manifest files"
        description="PomaiDB stores append-only WALs, immutable segment files, and a small manifest that points to the active state."
      />

      <div className={styles.grid}>
        <Card>
          <h3>WAL</h3>
          <p>
            Every write enters the WAL first. WAL replay truncates partial
            batches and ensures idempotent rebuilds.
          </p>
        </Card>
        <Card>
          <h3>Segments</h3>
          <p>
            Immutable segment files store vector payloads. Segments are compacted
            in the background to keep search speed consistent.
          </p>
        </Card>
        <Card>
          <h3>Manifest</h3>
          <p>
            The manifest is swapped atomically and fsynced to its directory. A
            valid manifest always points to a crash-safe snapshot.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="Crash safety contract"
        title="Atomic rename + fsync + WAL replay"
        description="PomaiDB guarantees that every commit is either fully visible or fully rolled back after a crash."
      />

      <div className={styles.contract}>
        <Card>
          <h3>Atomic manifest swap</h3>
          <p>
            Commit metadata is written to a temp file, fsynced, then atomically
            renamed into place with a directory fsync.
          </p>
        </Card>
        <Card>
          <h3>Truncation-safe WAL replay</h3>
          <p>
            WAL replay ignores partial batches and rebuilds shard indexes
            deterministically, preserving data integrity.
          </p>
        </Card>
        <Card>
          <h3>Crash harness</h3>
          <p>
            The crash harness injects power-loss events and validates manifests,
            WAL replay, and segment recovery on restart.
          </p>
        </Card>
      </div>

      <SectionHeading
        eyebrow="CBR-S routing"
        title="Context-based routing with dual probe"
        description="Routing uses epochs to keep shard models fresh and dual probes to guarantee recall when distribution shifts."
      />

      <div className={styles.routing}>
        <Card>
          <h3>Epoch-aware routing</h3>
          <p>
            Shard profiles evolve with epochs. Router updates keep search
            accuracy stable even as distributions drift.
          </p>
        </Card>
        <Card>
          <h3>Dual probe fallback</h3>
          <p>
            If routing uncertainty is high, PomaiDB probes a secondary shard set
            to keep recall above target thresholds.
          </p>
        </Card>
      </div>
    </Container>
  );
}
