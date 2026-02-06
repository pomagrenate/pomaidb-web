import Link from "next/link";
import Button from "./Button";
import Container from "./Container";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.cta}>
          <div>
            <h3>Build with PomaiDB</h3>
            <p>
              Local-first vector search with crash-safe guarantees, ready for
              embedded deployments.
            </p>
          </div>
          <Button href="https://github.com/pomai/pomaidb" variant="secondary">
            View on GitHub
          </Button>
        </div>
        <div className={styles.meta}>
          <span>© 2025 PomaiDB. Engineered for local-first AI.</span>
          <div className={styles.links}>
            <Link href="/docs">Docs</Link>
            <Link href="/benchmarks">Benchmarks</Link>
            <Link href="/architecture">Architecture</Link>
            <Link href="/examples">Examples</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
