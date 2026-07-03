"use client";

import { FpCardGlowScript } from "./FpCardGlowScript";

interface ForestPageShellProps {
  /** Short eyebrow label above the title, e.g. "Academic Publications" */
  eyebrow: string;
  /** Page title */
  title: string;
  /** Optional subtitle / description */
  description?: string;
  /** Page content */
  children: React.ReactNode;
}

/**
 * Shared dark-forest shell for all inner pages.
 * Renders a stylized header banner with subtle atmosphere,
 * then the page content on a matching dark background.
 */
export function ForestPageShell({
  eyebrow,
  title,
  description,
  children,
}: ForestPageShellProps) {
  return (
    <div className="fp-shell">
      {/* Inject mouse-glow tracker for all fp-card elements */}
      <FpCardGlowScript />

      {/* ── Header Banner ── */}
      <header className="fp-shell__header">
        {/* Atmospheric layers inside header */}
        <div className="fp-shell__header-bg" aria-hidden="true" />
        <div className="fp-shell__header-fog fp-shell__header-fog--1" aria-hidden="true" />
        <div className="fp-shell__header-fog fp-shell__header-fog--2" aria-hidden="true" />
        <div className="fp-shell__header-vignette" aria-hidden="true" />

        <div className="fp-shell__header-content">
          <p className="fp-shell__eyebrow">
            <span className="fp-shell__eyebrow-dot" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="fp-shell__title">{title}</h1>
          {description && (
            <p className="fp-shell__description">{description}</p>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div className="fp-shell__body">{children}</div>
    </div>
  );
}
