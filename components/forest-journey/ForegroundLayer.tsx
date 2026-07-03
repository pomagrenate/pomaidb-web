"use client";

interface ForegroundLayerProps {
  scrollProgress: number; // 0 to 1
}

export function ForegroundLayer({ scrollProgress }: ForegroundLayerProps) {
  // Foreground moves faster than background = parallax depth
  const translateY = scrollProgress * 12;

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
      />

      {/* Bottom-right: rocks */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/layer2/rocks.png"
        alt=""
        className="foreground-rocks"
        draggable={false}
      />
    </div>
  );
}
