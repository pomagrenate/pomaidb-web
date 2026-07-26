"use client";

interface ForegroundLayerProps {
  scrollProgress: number; // 0 to 1
}

export function ForegroundLayer({ scrollProgress }: ForegroundLayerProps) {
  // Foreground moves much faster than background = strong parallax depth (walking effect)
  const translateY = scrollProgress * 25;

  return (
    <div
      className="foreground-layer"
      aria-hidden="true"
      style={{
        transform: `translateY(${translateY}%)`,
        willChange: "transform",
      }}
    >
      {/* Bottom-left: bush */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/layer2/bush.png"
        alt=""
        className="foreground-bush"
        draggable={false}
        loading="lazy"
      />

      {/* Bottom-right: rocks */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/layer2/rocks.png"
        alt=""
        className="foreground-rocks"
        draggable={false}
        loading="lazy"
      />
    </div>
  );
}
