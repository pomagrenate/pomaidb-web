"use client";

import type { Station } from "@/data/stations";

interface JourneyProgressProps {
  stations: Station[];
  activeIndex: number;
  scrollProgress: number; // 0 to 1
}

export function JourneyProgress({
  stations,
  activeIndex,
  scrollProgress,
}: JourneyProgressProps) {
  return (
    <div className="journey-progress" aria-label="Journey progress">
      {/* Vertical track */}
      <div className="journey-progress__track" aria-hidden="true">
        {/* Fill bar */}
        <div
          className="journey-progress__fill"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Station dots */}
      <div className="journey-progress__dots">
        {stations.map((station, i) => (
          <div
            key={station.id}
            className={`journey-progress__dot ${
              i === activeIndex
                ? "journey-progress__dot--active"
                : i < activeIndex
                ? "journey-progress__dot--passed"
                : ""
            }`}
            title={`Station ${station.number}: ${station.name}`}
          >
            {i === activeIndex && (
              <span className="journey-progress__dot-label">
                {station.number}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Progress text */}
      <div className="journey-progress__label" aria-live="polite">
        <span className="journey-progress__label-text">
          {Math.round(scrollProgress * 100)}%
        </span>
      </div>
    </div>
  );
}
