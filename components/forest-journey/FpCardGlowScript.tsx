"use client";

import Script from "next/script";

export function FpCardGlowScript() {
  return (
    <Script
      id="fp-card-glow-script"
      strategy="afterInteractive"
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