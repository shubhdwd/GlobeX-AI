import React, { useState } from 'react';
import ScrollGlobe from './components/ScrollGlobe';
import Hero from './components/sections/Hero';
import HowItWorks from './components/sections/HowItWorks';
import FeaturesMatrix from './components/sections/FeaturesMatrix';
import DemoPreview from './components/sections/DemoPreview';
import ROIStats from './components/sections/ROIStats';
import GlobalNetwork from './components/sections/GlobalNetwork';
import FinalCTA from './components/sections/FinalCTA';
import AuthModal from './components/AuthModal';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <ScrollGlobe>
        <Hero onOpenAuth={() => setAuthOpen(true)} />
        <HowItWorks />
        <FeaturesMatrix />
        <DemoPreview />
        <ROIStats />
        <GlobalNetwork />
        <FinalCTA onOpenAuth={() => setAuthOpen(true)} />
      </ScrollGlobe>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
