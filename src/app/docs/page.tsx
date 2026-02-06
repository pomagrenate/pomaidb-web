import Link from "next/link";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./docs.module.css";

const docsGroups = [
  {
    title: "Getting Started",
    description: "Install PomaiDB, create your first collection, and run a local search.",
    links: [
      { label: "Quickstart", href: "/docs/get-started" },
      { label: "Operations runbook", href: "/docs/operations-runbook" },
    ],
  },
  {
    title: "Core semantics",
    description: "Canonical behavior, snapshot rules, and system invariants.",
    links: [
      { label: "Canonical semantics", href: "/docs/canonical-semantics" },
      { label: "Consistency model", href: "/docs/consistency-model" },
      { label: "Database contract", href: "/docs/database-contract" },
    ],
  },
  {
    title: "Search & routing",
    description: "Indexing plans, current pipeline gaps, and CBR-S routing details.",
    links: [
      { label: "Canonical search plan", href: "/docs/canonical-search-plan" },
      {
        label: "Search pipeline (current)",
        href: "/docs/search-pipeline-current-state",
      },
      { label: "CBR-S routing", href: "/docs/cbr-s" },
    ],
  },
  {
    title: "Performance & APIs",
    description: "Ingestion analysis, ABI contracts, and reference material.",
    links: [
      { label: "Ingestion throughput", href: "/docs/ingestion-throughput" },
      { label: "C API (stable ABI)", href: "/docs/c-api" },
      { label: "PomaiDB reference docs", href: "/docs/reference" },
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
            Everything you need to build crash-safe local vector search. Explore
            the canonical semantics, routing model, and operational playbooks
            behind PomaiDB.
          </p>
        </div>
        <div className={styles.heroCard}>
          <span>MDX-ready</span>
          <p>
            Each major spec lives in its own MDX page. Add new docs under
            <code> /docs</code> to grow the knowledge base.
          </p>
        </div>
      </section>

      <SectionHeading
        eyebrow="Documentation"
        title="Start with the fundamentals."
        description="Browse PomaiDB's operating contracts, search architecture, and performance guidance."
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
        <div id="semantics" className={styles.section}>
          <h2>Canonical semantics</h2>
          <p>
            PomaiDB's identity is anchored in WAL-first durability and bounded
            staleness. The canonical semantics doc defines the invariant write
            and read paths.
          </p>
        </div>
        <div id="search" className={styles.section}>
          <h2>Search architecture</h2>
          <p>
            The canonical plan describes the IVF pipeline, while the current
            state report tracks what still runs brute force today.
          </p>
        </div>
        <div id="operations" className={styles.section}>
          <h2>Operations playbook</h2>
          <p>
            Build configurations, crash testing loops, and inspection commands
            live in the operations runbook so you can validate durability end to
            end.
          </p>
        </div>
        <div id="api" className={styles.section}>
          <h2>Stable API contract</h2>
          <p>
            The C ABI page spells out ownership, thread safety, and versioning
            rules to keep embedding integrations safe across releases.
          </p>
        </div>
      </div>
    </Container>
  );
}
