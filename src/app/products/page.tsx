import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./products.module.css";

const products = [
  {
    title: "PomaiDB",
    description: "Local-first embedded vector database with crash-safe guarantees.",
    href: "/",
  },
  {
    title: "Pomai Search",
    description: "Deterministic vector search engine with hybrid ranking and snapshots.",
    href: "/pomai-search",
  },
];

export default function ProductsPage() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Pomai Hub" tone="green" />
        <div>
          <h1>Products</h1>
          <p>Pomai Hub hosts multiple local-first AI products. Explore each product space below.</p>
        </div>
      </section>

      <SectionHeading
        eyebrow="Pomai"
        title="Choose your product"
        description="PomaiDB and Pomai Search share the same deterministic, offline-first design principles."
      />

      <div className={styles.grid}>
        {products.map((product) => (
          <Card key={product.title}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <a href={product.href} className={styles.cardLink}>
              Open {product.title} →
            </a>
          </Card>
        ))}
      </div>
    </Container>
  );
}
