"use client";

import { useCallback } from "react";

/**
 * Injects mouse-glow tracking into all .fp-card elements on the page.
 * Drop this anywhere in a page layout — it uses event delegation on document.
 */
export function FpCardGlowScript() {
  return (
    <script
      // Inline script — runs immediately, no hydration delay
      dangerouslySetInnerHTML={{
        __html: `
(function() {
  function trackMouse(e) {
    var card = e.target.closest('.fp-card');
    if (!card) return;
    var rect = card.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  }
  document.addEventListener('mousemove', trackMouse, { passive: true });
})();
        `.trim(),
      }}
    />
  );
}
