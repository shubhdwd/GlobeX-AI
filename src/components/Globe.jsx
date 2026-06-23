import React, { useEffect, useRef, forwardRef } from 'react';
import GlobeGL from 'react-globe.gl';

/* ── Trade Route Endpoints ──────────────────────────────────────────── */
const CITIES = {
  mumbai:    { lat: 19.0760, lng: 72.8777,   label: 'Mumbai' },
  newYork:   { lat: 40.7128, lng: -74.0060,  label: 'New York' },
  frankfurt: { lat: 50.1109, lng: 8.6821,    label: 'Frankfurt' },
  dubai:     { lat: 25.2048, lng: 55.2708,   label: 'Dubai' },
  tokyo:     { lat: 35.6762, lng: 139.6503,  label: 'Tokyo' },
};

/* ── Trade Routes from India ─────────────────────────────────────────── */
const TRADE_ROUTES = [
  {
    startLat: CITIES.mumbai.lat, startLng: CITIES.mumbai.lng,
    endLat: CITIES.newYork.lat,  endLng: CITIES.newYork.lng,
    color: ['#2563EB', '#60A5FA'],
  },
  {
    startLat: CITIES.mumbai.lat, startLng: CITIES.mumbai.lng,
    endLat: CITIES.frankfurt.lat, endLng: CITIES.frankfurt.lng,
    color: ['#2563EB', '#059669'],
  },
  {
    startLat: CITIES.mumbai.lat, startLng: CITIES.mumbai.lng,
    endLat: CITIES.dubai.lat,    endLng: CITIES.dubai.lng,
    color: ['#2563EB', '#0EA5E9'],
  },
  {
    startLat: CITIES.mumbai.lat, startLng: CITIES.mumbai.lng,
    endLat: CITIES.tokyo.lat,    endLng: CITIES.tokyo.lng,
    color: ['#2563EB', '#8B5CF6'],
  },
];

/* ── Hub Points ──────────────────────────────────────────────────────── */
const HUB_POINTS = Object.values(CITIES).map(c => ({
  lat: c.lat,
  lng: c.lng,
  label: c.label,
  color: c.label === 'Mumbai' ? '#059669' : '#2563EB',
  size: c.label === 'Mumbai' ? 0.5 : 0.35,
}));

/* ── Labels ──────────────────────────────────────────────────────────── */
const LABELS = Object.values(CITIES).map(c => ({
  lat: c.lat,
  lng: c.lng,
  text: c.label,
  color: '#334155',
  size: c.label === 'Mumbai' ? 1.2 : 0.9,
  dot: c.label === 'Mumbai' ? 0.5 : 0.35,
}));

/* ── Globe Component ─────────────────────────────────────────────────── */
const Globe = forwardRef(({ width, height }, ref) => {
  const globeEl = useRef();

  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    // Set initial point of view to show India
    globeEl.current.pointOfView({ lat: 20, lng: 78, altitude: 2.2 }, 0);
  }, []);

  return (
    <div className="w-full h-full">
      <GlobeGL
        ref={globeEl}
        width={width}
        height={height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="rgba(37, 99, 235, 0.25)"
        atmosphereAltitude={0.15}
        backgroundColor="rgba(0,0,0,0)"

        arcsData={TRADE_ROUTES}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashInitialGap={() => Math.random() * 2}
        arcDashAnimateTime={2500}
        arcStroke={0.4}
        arcsTransitionDuration={800}

        pointsData={HUB_POINTS}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointAltitude={0.01}
        pointsMerge={false}
        pointsTransitionDuration={500}

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
