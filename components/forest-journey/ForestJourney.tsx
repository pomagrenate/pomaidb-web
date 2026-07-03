"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { stations } from "@/data/stations";
import { ForestBackground } from "./ForestBackground";
import { FogLayer } from "./FogLayer";
import { FireflyLayer } from "./FireflyLayer";
import { ForegroundLayer } from "./ForegroundLayer";
import { StationMarker } from "./StationMarker";
import { StationCard } from "./StationCard";
import { JourneyProgress } from "./JourneyProgress";

// Stations are revealed at these scroll progress thresholds (0–1)
const STATION_THRESHOLDS = stations.map((_, i) => {
  // First station at 5%, last at 92%, evenly distributed
  return 0.05 + (i / (stations.length - 1)) * 0.87;
});

// Alternate sides: first station right, then alternating
const SIDES: Array<"left" | "right"> = stations.map((_, i) =>
  i % 2 === 0 ? "right" : "left"
);

// Dynamic height: at least 500vh, scales with station count
const JOURNEY_HEIGHT = `${Math.max(500, stations.length * 70)}vh`;

export function ForestJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStation, setActiveStation] = useState(-1);
  const [visibleStations, setVisibleStations] = useState<boolean[]>(
    new Array(stations.length).fill(false)
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;

    // How far the container top has moved above the viewport top
    const scrolled = -rect.top;
    const maxScroll = containerHeight - viewportHeight;

    const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1);
    setScrollProgress(progress);

    // Determine which stations are visible (passed their threshold)
    let lastActive = -1;
    const newVisible = stations.map((_, i) => {
      const isReached = progress >= STATION_THRESHOLDS[i];
      if (isReached) lastActive = i;
      return isReached;
    });

    setVisibleStations(newVisible);
    setActiveStation(lastActive);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="forest-journey-container"
      id="forest-journey"
      style={{ height: JOURNEY_HEIGHT }}
    >
      {/* Sticky canvas — pins while container scrolls */}
      <div className="forest-journey-canvas">

        {/* Layer 1: Background */}
        <ForestBackground scrollProgress={reducedMotion ? 0 : scrollProgress} />

        {/* Layer 2: Fog */}
        <FogLayer />

        {/* Layer 3: Fireflies */}
        <FireflyLayer />

        {/* Layer 4: Foreground nature elements */}
        <ForegroundLayer scrollProgress={reducedMotion ? 0 : scrollProgress} />

        {/* Layer 5: Station markers + cards */}
        <div className="stations-layer">
          {stations.map((station, i) => (
            <div
              key={station.id}
              className={`station-slot station-slot--${SIDES[i]} ${
                visibleStations[i] ? "station-slot--visible" : ""
              }`}
              style={{
                // Each station occupies a vertical band of the canvas
                // We use CSS variables for positioning
                "--station-index": i,
              } as React.CSSProperties}
            >
              {/* Marker (stone) */}
              <StationMarker
                station={station}
                isActive={activeStation === i}
                side={SIDES[i]}
              />

              {/* Project card */}
              <StationCard
                station={station}
                isVisible={visibleStations[i]}
                side={SIDES[i]}
              />
            </div>
          ))}
        </div>

        {/* Layer 6: Hero text (shown at scroll 0) */}
        <div
          className="journey-hero"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 5),
            transform: `translateY(${scrollProgress * -8}%)`,
            pointerEvents: scrollProgress > 0.15 ? "none" : "auto",
          }}
        >
          <div className="journey-hero__inner">
            <p className="journey-hero__eyebrow">
              <span className="journey-hero__eyebrow-dot" aria-hidden="true" />
              Personal AI Lab
            </p>
            <h1 className="journey-hero__title">
              Quan Van
            </h1>
            <p className="journey-hero__subtitle">
              A personal lab for local-first AI systems,<br />
              research notes, and engineering stories.
            </p>
            <div className="journey-hero__cta">
              <span className="journey-hero__scroll-hint" aria-hidden="true">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <rect x="3" y="1" width="10" height="14" rx="5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8" cy="5" r="1.5" fill="currentColor" className="scroll-dot-animate" />
                </svg>
                Scroll to begin
              </span>
            </div>
          </div>
        </div>

        {/* Layer 7: Journey progress sidebar */}
        <JourneyProgress
          stations={stations}
          activeIndex={activeStation}
          scrollProgress={scrollProgress}
        />

        {/* Scroll progress gradient at bottom */}
        <div
          className="journey-bottom-reveal"
          style={{ opacity: Math.min(scrollProgress * 3, 1) }}
        />
      </div>
    </div>
  );
}
