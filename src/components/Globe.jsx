import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import GlobeGL from 'react-globe.gl';

const ARC_REL_LEN = 0.4;
const FLIGHT_TIME = 2000;

const INDIA = { lat: 20.5937, lng: 78.9629, label: 'India (Hub)' };
const HUBS = [
  { lat: 37.0902, lng: -95.7129, label: 'USA' },
  { lat: 51.1657, lng: 10.4515, label: 'Germany' },
  { lat: 23.4241, lng: 53.8478, label: 'UAE' },
  { lat: 36.2048, lng: 138.2529, label: 'Japan' }
];

const arcsData = HUBS.map(hub => ({
  startLat: INDIA.lat,
  startLng: INDIA.lng,
  endLat: hub.lat,
  endLng: hub.lng,
  color: ['#fbbf24', '#38bdf8']
}));

const Globe = forwardRef(({ opacity = 1 }, ref) => {
  const globeEl = useRef();

  useImperativeHandle(ref, () => ({
    setPointOfView: (pov, duration) => {
      if (globeEl.current) {
        globeEl.current.pointOfView(pov, duration);
      }
    }
  }));

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = false;
      controls.enableZoom = false; // Disable zoom to enforce scroll-driven zoom
    }
  }, []);

  return (
    <div style={{ opacity, transition: 'opacity 1s ease-in-out' }} className="absolute inset-0 z-0 pointer-events-none">
      <GlobeGL
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"

        arcsData={arcsData}
        arcColor="color"
        arcDashLength={ARC_REL_LEN}
        arcDashGap={2}
        arcDashInitialGap={() => Math.random()}
        arcDashAnimateTime={FLIGHT_TIME}
        arcsTransitionDuration={1000}

        labelsData={[INDIA, ...HUBS]}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={d => d.label}
        labelSize={1.5}
        labelDotRadius={0.5}
        labelColor={() => 'rgba(255, 165, 0, 0.75)'}
        labelResolution={2}
      />
    </div>
  );
});

export default Globe;
