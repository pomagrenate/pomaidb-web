"use client";

interface ForestBackgroundProps {
  scrollProgress: number; // 0 to 1
}

export function ForestBackground({ scrollProgress }: ForestBackgroundProps) {
  // Subtle scale from 1.0 to 1.12 as the user scrolls deeper
  const scale = 1 + scrollProgress * 0.12;
  // Slight vertical pan upward
  const translateY = scrollProgress * -4;

  return (
    <div className="forest-bg-wrapper" aria-hidden="true">
      {/* Main background image */}
      <div
        className="forest-bg-image"
        style={{
          transform: `scale(${scale}) translateY(${translateY}%)`,
          willChange: "transform",
        }}
      />

      {/* Dark overlay — deepens as scroll progresses */}
      <div
        className="forest-bg-overlay"
        style={{
          opacity: 0.35 + scrollProgress * 0.2,
        }}
      />

      {/* Bottom gradient fade to black for card readability */}
      <div className="forest-bg-bottom-fade" />

      {/* Top vignette */}
      <div className="forest-vignette" />
    </div>
  );
}
