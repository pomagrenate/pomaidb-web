"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "./Button";
import Container from "./Container";
import styles from "./Header.module.css";

const navItems = [
  { label: "Docs", href: "/docs" },
  { label: "WASM Playground", href: "/wasm-playground" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Architecture", href: "/architecture" },
  { label: "GitHub", href: "https://github.com/AutoCookies/pomaidb/tree/main" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    const initial =
      stored === "light" || stored === "dark"
        ? stored
        : prefersLight
          ? "light"
          : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("theme", next);
      return next;
    });
  };

  const themeLabel = theme === "light" ? "Light" : "Dark";

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.png"
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
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"
              } mode`}
          >
            {themeLabel} mode
          </button>
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
          <button
            type="button"
            className={`${styles.themeToggle} ${styles.mobileThemeToggle}`}
            onClick={toggleTheme}
          >
            {themeLabel} mode
          </button>
        </Container>
      </div>
    </header>
  );
}
