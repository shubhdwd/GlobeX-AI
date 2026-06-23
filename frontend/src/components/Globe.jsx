import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import GlobeGL from 'react-globe.gl';

/* ── City Definitions ───────────────────────────────────────────────────── */
const CITIES = {
  mumbai:    { lat: 19.0760, lng: 72.8777, label: 'Mumbai',    color: '#00d4ff' },
  newYork:   { lat: 40.7128, lng: -74.0060, label: 'New York', color: '#a855f7' },
  frankfurt: { lat: 50.1109, lng: 8.6821,  label: 'Frankfurt', color: '#00ff88' },
  dubai:     { lat: 25.2048, lng: 55.2708, label: 'Dubai',     color: '#fbbf24' },
  tokyo:     { lat: 35.6762, lng: 139.6503, label: 'Tokyo',    color: '#f43f5e' },
};

/* ── Trade Routes: India (Mumbai) → World ───────────────────────────────── */
const TRADE_ROUTES = [
  {
    startLat: CITIES.mumbai.lat,    startLng: CITIES.mumbai.lng,
    endLat:   CITIES.newYork.lat,   endLng:   CITIES.newYork.lng,
    color: ['#00d4ff', '#a855f7'],
    label: 'India → USA',
  },
  {
    startLat: CITIES.mumbai.lat,    startLng: CITIES.mumbai.lng,
    endLat:   CITIES.frankfurt.lat, endLng:   CITIES.frankfurt.lng,
    color: ['#00d4ff', '#00ff88'],
    label: 'India → Germany',
  },
  {
    startLat: CITIES.mumbai.lat,    startLng: CITIES.mumbai.lng,
    endLat:   CITIES.dubai.lat,     endLng:   CITIES.dubai.lng,
    color: ['#00d4ff', '#fbbf24'],
    label: 'India → UAE',
  },
  {
    startLat: CITIES.mumbai.lat,    startLng: CITIES.mumbai.lng,
    endLat:   CITIES.tokyo.lat,     endLng:   CITIES.tokyo.lng,
    color: ['#00d4ff', '#f43f5e'],
    label: 'India → Japan',
  },
];

/* ── Hub Points (glowing dots) ──────────────────────────────────────────── */
const HUB_POINTS = Object.values(CITIES).map(c => ({
  lat:   c.lat,
  lng:   c.lng,
  label: c.label,
  color: c.color,
  size:  c.label === 'Mumbai' ? 0.6 : 0.4,
}));

/* ── Labels ─────────────────────────────────────────────────────────────── */
const LABELS = Object.values(CITIES).map(c => ({
  lat:   c.lat,
  lng:   c.lng,
  text:  c.label,
  color: c.color,
  size:  c.label === 'Mumbai' ? 1.4 : 1.0,
  dot:   c.label === 'Mumbai' ? 0.6 : 0.4,
}));

/* ── Component ──────────────────────────────────────────────────────────── */
const Globe = forwardRef(({ opacity = 1, size }, ref) => {
  const globeEl = useRef();

  useImperativeHandle(ref, () => ({
    setPointOfView: (pov, duration) => {
      if (globeEl.current) globeEl.current.pointOfView(pov, duration);
    },
  }));

  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 0.35;   // slow, subtle drift
    controls.enableZoom      = false;
    controls.enablePan       = false;
  }, []);

  /* Dimensions: use prop or fill container */
  const dim = size ?? undefined;

  return (
    <div
      style={{ opacity, transition: 'opacity 1.2s ease-in-out' }}
      className="absolute inset-0 z-0 pointer-events-none"
    >
      <GlobeGL
        ref={globeEl}
        width={dim}
        height={dim}

        /* Globe appearance */
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="rgba(0, 180, 255, 0.6)"
        atmosphereAltitude={0.18}
        backgroundColor="rgba(0,0,0,0)"

        /* ── Trade Route Arcs ── */
        arcsData={TRADE_ROUTES}
        arcColor="color"
        arcDashLength={0.35}
        arcDashGap={0.15}
        arcDashInitialGap={() => Math.random() * 2}
        arcDashAnimateTime={2200}
        arcStroke={0.5}
        arcsTransitionDuration={800}

        /* ── Glowing Hub Points ── */
        pointsData={HUB_POINTS}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointAltitude={0.01}
        pointsMerge={false}
        pointsTransitionDuration={500}

        /* ── City Labels ── */
        labelsData={LABELS}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelSize="size"
        labelDotRadius="dot"
        labelColor={d => d.color}
        labelResolution={3}
        labelAltitude={0.015}
      />
    </div>
  );
});

Globe.displayName = 'Globe';
export default Globe;

