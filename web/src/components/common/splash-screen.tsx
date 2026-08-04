"use client";

import { useEffect, useState } from "react";

const SPLASH_DURATION_MS = 3000;
const FADE_DURATION_MS = 500;

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(
      () => setIsLeaving(true),
      SPLASH_DURATION_MS - FADE_DURATION_MS,
    );
    const removeTimer = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      setIsVisible(false);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`marketplace-splash ${isLeaving ? "marketplace-splash--leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="AzizMarket is loading"
    >
      <div className="marketplace-splash__glow marketplace-splash__glow--one" aria-hidden="true" />
      <div className="marketplace-splash__glow marketplace-splash__glow--two" aria-hidden="true" />

      <div className="marketplace-splash__content">
        <div className="marketplace-splash__mark" aria-hidden="true">
          <span>A</span>
          <span className="marketplace-splash__orbit" />
        </div>
        <p className="marketplace-splash__name">
          Aziz<span>Market</span>
        </p>
        <p className="marketplace-splash__tagline">Buy better. Sell further.</p>
        <div className="marketplace-splash__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
