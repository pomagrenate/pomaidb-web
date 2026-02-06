"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";
import Container from "./Container";
import styles from "./Header.module.css";

const navItems = [
  { label: "Docs", href: "/docs" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Architecture", href: "/architecture" },
  { label: "Examples", href: "/examples" },
  { label: "GitHub", href: "https://github.com/pomai/pomaidb" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/pomai-logo.svg"
            alt="PomaiDB logo"
            width={40}
            height={40}
            priority
          />
          <span>PomaiDB</span>
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.cta}>
          <Button href="/docs" variant="primary">
            Get Started
          </Button>
          <button
            className={styles.mobileToggle}
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </Container>
      <div
        id="mobile-nav"
        className={`${styles.mobileNav} ${open ? styles.mobileOpen : ""}`}
      >
        <Container className={styles.mobileInner}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  );
}
