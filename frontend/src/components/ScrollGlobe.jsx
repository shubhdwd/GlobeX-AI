import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from './Globe';
import { StarsBackground } from '@/components/ui/stars';

/* ── Camera positions per page section ─────────────────────────────────── */
// Sections: hero, trustbar, about, features, how-it-works, roi, cta
const SECTION_POVS = [
  { lat: 19.0760, lng:  72.8777, altitude: 1.8 }, // 0: Hero — Mumbai close-up
  { lat: 19.0760, lng:  72.8777, altitude: 2.2 }, // 1: TrustBar — pull back
  { lat: 30.0000, lng:  50.0000, altitude: 2.0 }, // 2: About Us — India + Middle East
  { lat: 45.0000, lng:  10.0000, altitude: 2.5 }, // 3: Features — Europe view
  { lat: 35.0000, lng: 100.0000, altitude: 2.0 }, // 4: How It Works — Asia-Pacific
  { lat: 20.5937, lng:  78.9629, altitude: 3.0 }, // 5: ROI Stats — full globe zoom-out
  { lat: 20.5937, lng:  78.9629, altitude: 2.5 }, // 6: Final CTA — settle
];

/* Linear interpolation helper */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

const SECTION_IDS = [
  'hero', 'trust', 'about', 'features', 'how-it-works', 'roi', 'contact',
];

export default function ScrollGlobe({ children }) {
  const globeRef      = useRef();
  const currentPov    = useRef(SECTION_POVS[0]);
  const targetPov     = useRef(SECTION_POVS[0]);
  const rafId         = useRef(null);
  const [globeOpacity, setGlobeOpacity] = useState(1);

  /* ── Smooth lerp animation loop ── */
  const animate = useCallback(() => {
    if (!globeRef.current) return;

    const cur = currentPov.current;
    const tgt = targetPov.current;
    const T   = 0.04; // lerp speed (lower = smoother)

    const next = {
      lat:      lerp(cur.lat,      tgt.lat,      T),
      lng:      lerp(cur.lng,      tgt.lng,      T),
      altitude: lerp(cur.altitude, tgt.altitude, T),
    };

    // Only call setPointOfView when meaningfully different
    const diff =
      Math.abs(next.lat      - cur.lat)      +
      Math.abs(next.lng      - cur.lng)      +
      Math.abs(next.altitude - cur.altitude);

    if (diff > 0.001) {
      globeRef.current.setPointOfView(next, 0);
      currentPov.current = next;
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  /* ── IntersectionObserver for section detection ── */
  useEffect(() => {
    const sectionEls = SECTION_IDS.map(id => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const idx = SECTION_IDS.indexOf(entry.target.id);
          if (idx === -1) return;

          targetPov.current = SECTION_POVS[idx];

          // Globe opacity: subtle in CTA, normal elsewhere
          setGlobeOpacity(idx === 6 ? 0.2 : 1);
        });
      },
      { threshold: 0.3 }
    );

    sectionEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Initial POV ── */
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.setPointOfView(SECTION_POVS[0], 0);
    }
  }, []);

  return (
    <div className="relative w-full text-white">
      {/* Fixed Globe Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <StarsBackground speed={20} factor={0.05}>
          <Globe ref={globeRef} opacity={globeOpacity} />
        </StarsBackground>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}


