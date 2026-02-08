import Link from "next/link";
import styles from "./PomaiSearchNav.module.css";
import type { PomaiSearchDocKey } from "@/lib/pomaiSearchDocs.generated";

const links: { key: PomaiSearchDocKey; label: string; href: string }[] = [
  { key: "overview", label: "Overview", href: "/pomai-search" },
  { key: "gettingStarted", label: "Quickstart", href: "/pomai-search/getting-started" },
  { key: "api", label: "API Reference", href: "/pomai-search/api" },
  { key: "architecture", label: "Architecture", href: "/pomai-search/architecture" },
  { key: "performance", label: "Performance", href: "/pomai-search/performance" },
  { key: "snapshots", label: "Snapshots & Determinism", href: "/pomai-search/snapshots-determinism" },
  { key: "cAbi", label: "C ABI", href: "/pomai-search/c-abi" },
  { key: "benchmarks", label: "Benchmarks", href: "/pomai-search/benchmarks" },
  { key: "playground", label: "Playground", href: "/pomai-search/playground" },
  { key: "nonGoals", label: "Non-goals", href: "/pomai-search/non-goals" },
];

export default function PomaiSearchNav({ current }: { current?: PomaiSearchDocKey }) {
  return (
    <nav className={styles.nav} aria-label="Pomai Search documentation">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={current === link.key ? styles.active : styles.link}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export { links as pomaiSearchNavLinks };
