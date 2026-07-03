"use client";

import Link from "next/link";
import { useRef, useCallback } from "react";
import type { Station } from "@/data/stations";

interface StationCardProps {
  station: Station;
  isVisible: boolean;
  side: "left" | "right";
}

interface RuneProps {
  className: string;
  flip?: "x" | "y" | "both";
}

function RuneCorner({ className, flip }: RuneProps) {
  const transforms: Record<string, string> = {
    x: "scaleX(-1)",
    y: "scaleY(-1)",
    both: "scale(-1)",
  };
  const transformStyle = flip ? transforms[flip] : undefined;
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={transformStyle ? { transform: transformStyle } : undefined}
    >
      <path d="M2 2 L10 2 L2 10 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M5 2 L5 5 L2 5" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

export function StationCard({ station, isVisible, side }: StationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse-glow effect: track cursor position relative to card
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mouse-x", `50%`);
    card.style.setProperty("--mouse-y", `50%`);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`station-card station-card--${side} ${isVisible ? "station-card--visible" : ""}`}
      role="article"
      aria-label={`Station ${station.number}: ${station.name}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mouse-glow spotlight */}
      <div className="station-card__glow" aria-hidden="true" />

      {/* Rune corners */}
      <RuneCorner className="rune-corner rune-corner--tl" />
      <RuneCorner className="rune-corner rune-corner--tr" flip="x" />
      <RuneCorner className="rune-corner rune-corner--bl" flip="y" />
      <RuneCorner className="rune-corner rune-corner--br" flip="both" />

      {/* Station number chip */}
      <div className="station-card__number-chip">
        <span className="station-card__number-label">Station</span>
        <span className="station-card__number-value">{station.number}</span>
      </div>

      {/* Project name */}
      <h2 className="station-card__title">{station.name}</h2>

      {/* Subtitle */}
      <p className="station-card__subtitle">{station.subtitle}</p>

      {/* Divider */}
      <div className="station-card__divider" aria-hidden="true" />

      {/* Description */}
      <p className="station-card__description">{station.description}</p>

      {/* Tags */}
      <div className="station-card__tags">
        {station.tags.map((tag) => (
          <span key={tag} className="station-card__tag">
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="station-card__links">
        {station.links.map((link) =>
          link.href.startsWith("http") ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`station-card__link ${link.primary ? "station-card__link--primary" : "station-card__link--secondary"}`}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className={`station-card__link ${link.primary ? "station-card__link--primary" : "station-card__link--secondary"}`}
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
