import Link from "next/link";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./playground.module.css";

const pages = [
  {
    title: "Normal vectors",
    href: "/wasm-playground/normal",
    description: "Deterministic ingest/search/iterate with clustered vectors.",
  },
  {
    title: "RAG vectors + tokens",
    href: "/wasm-playground/rag",
    description: "Deterministic text chunks, tokens, embeddings, and retrieval.",
  },
  {
    title: "End-to-end normal pipeline",
    href: "/wasm-playground/pipeline",
    description: "Generate → ingest → iterate → train classifier with reproducible split.",
  },
  {
    title: "End-to-end RAG retrieval",
    href: "/wasm-playground/rag-pipeline",
    description: "Generate docs → ingest → retrieve → inspect context output.",
  },
];

export default function WasmPlaygroundLanding() {
  return (
    <div className={styles.page}>
      <Container>
        <SectionHeading
          eyebrow="WASM Playground"
          title="Trust Playground: deterministic, reproducible PomaiDB proof"
          description="Four production-grade WASM demos that validate ingest/search/iterate, deterministic behavior, and clear limits. Everything runs offline in your browser."
        />
        <div className={styles.grid}>
          {pages.map((page) => (
            <Card key={page.href}>
              <h3>{page.title}</h3>
              <p>{page.description}</p>
              <div className={styles.linkRow}>
                <Link href={page.href} className={styles.highlight}>
                  Open playground →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
