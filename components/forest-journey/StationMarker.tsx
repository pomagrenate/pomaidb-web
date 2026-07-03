"use client";

import type { Station } from "@/data/stations";

interface StationMarkerProps {
  station: Station;
  isActive: boolean;
  side: "left" | "right";
}

export function StationMarker({ station, isActive, side }: StationMarkerProps) {
  return (
    <div
      className={`station-marker ${isActive ? "station-marker--active" : ""} station-marker--${side}`}
      data-station-id={station.id}
    >
      {/* Stone image */}
      <div className={`stone-wrapper ${isActive ? "stone-wrapper--active" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/layer2/stone.png"
          alt={`${station.markerLabel} — Station ${station.number}`}
          className="stone-image"
          draggable={false}
        />

        {/* Glow ring behind stone */}
        {isActive && <div className="stone-glow" aria-hidden="true" />}

        {/* Firefly cluster near active stone */}
        {isActive && (
          <div className="stone-firefly-cluster" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="stone-firefly"
                style={{
                  animationDelay: `${i * 0.4}s`,
                  left: `${30 + (i % 3) * 15}%`,
                  top: `${10 + Math.floor(i / 2) * 20}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Station label badge */}
      <div className={`station-badge station-badge--${side} ${isActive ? "station-badge--active" : ""}`}>
        <span className="station-badge__number">Waypoint {station.number}</span>
        <span className="station-badge__name">{station.markerLabel}</span>
      </div>
    </div>
  );
}
