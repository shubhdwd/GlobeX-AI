import React, { useRef, useEffect, useState } from 'react';
import Globe from './Globe';
import { StarsBackground } from '@/components/ui/stars';

const SECTION_POVS = [
  { lat: 20.5937, lng: 78.9629, altitude: 0.8 }, // 0: Hero
  { lat: 15.0000, lng: 85.0000, altitude: 1.2 }, // 1: How it works
  { lat: 30.0000, lng: 70.0000, altitude: 1.0 }, // 2: Features Matrix
  { lat: 20.5937, lng: 78.9629, altitude: 0.4 }, // 3: Demo Preview (deep dive)
  { lat: 25.0000, lng: 40.0000, altitude: 1.5 }, // 4: ROI
  { lat: 20.5937, lng: 78.9629, altitude: 2.5 }, // 5: Global Network (zoomed out)
  { lat: 20.5937, lng: 78.9629, altitude: 2.5 }, // 6: Final CTA
];

export default function ScrollGlobe({ children }) {
  const globeRef = useRef();
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate which section is currently most visible
      const sectionHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Add a small offset so it transitions slightly before the section fully hits the top
      const index = Math.min(
        Math.max(0, Math.floor((scrollY + sectionHeight * 0.5) / sectionHeight)),
        SECTION_POVS.length - 1
      );
      
      if (index !== currentSection) {
        setCurrentSection(index);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.setPointOfView(SECTION_POVS[currentSection], 1500);
    }
  }, [currentSection]);

  // Fade out globe on the last section (CTA)
  const globeOpacity = currentSection === 6 ? 0.1 : 1;

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
