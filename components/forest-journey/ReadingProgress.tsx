"use client";

import { useEffect, useState } from "react";

/**
 * Thin glowing reading progress bar fixed at the very top of the viewport.
 * Used on blog post pages only.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setProgress(Math.min(scrollTop / docHeight, 1));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className="reading-progress-bar"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="reading-progress-bar__fill"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
