"use client";

const fogClouds = [
  { className: "fog-cloud fog-cloud-1" },
  { className: "fog-cloud fog-cloud-2" },
  { className: "fog-cloud fog-cloud-3" },
  { className: "fog-cloud fog-cloud-4" },
];

export function FogLayer() {
  return (
    <div className="fog-layer" aria-hidden="true">
      {fogClouds.map((cloud, i) => (
        <div key={i} className={cloud.className} />
      ))}
    </div>
  );
}
