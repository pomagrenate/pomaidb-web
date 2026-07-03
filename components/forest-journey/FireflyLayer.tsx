"use client";

import { useMemo, useEffect, useState } from "react";

interface Firefly {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  floatDuration: number;
  floatDelay: number;
  hue: number;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function FireflyLayer() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const fireflies = useMemo<Firefly[]>(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      top: `${10 + rand() * 75}%`,
      left: `${2 + rand() * 96}%`,
      size: 2 + rand() * 3,
      duration: 1.5 + rand() * 2.5,
      delay: rand() * 4,
      floatDuration: 4 + rand() * 6,
      floatDelay: rand() * 6,
      hue: 80 + rand() * 40,
    }));
  }, []);

  // Under reduced-motion: show static dots, no animation
  if (reducedMotion) {
    return (
      <div className="firefly-layer" aria-hidden="true">
        {fireflies.slice(0, 12).map((f) => (
          <div
            key={f.id}
            className="firefly firefly--static"
            style={{
              top: f.top,
              left: f.left,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: 0.25,
              boxShadow: `0 0 ${f.size * 2}px ${f.size * 0.5}px hsl(${f.hue}, 80%, 70%)`,
              background: `hsl(${f.hue}, 80%, 80%)`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="firefly-layer" aria-hidden="true">
      {fireflies.map((f) => (
        <div
          key={f.id}
          className="firefly"
          style={{
            top: f.top,
            left: f.left,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDuration: `${f.duration}s, ${f.floatDuration}s`,
            animationDelay: `${f.delay}s, ${f.floatDelay}s`,
            boxShadow: `0 0 ${f.size * 3}px ${f.size}px hsl(${f.hue}, 90%, 70%)`,
            background: `hsl(${f.hue}, 90%, 80%)`,
          }}
        />
      ))}
    </div>
  );
}
