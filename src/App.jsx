import React from 'react';
import ScrollGlobe from './components/ScrollGlobe';
import Hero from './components/sections/Hero';
import HowItWorks from './components/sections/HowItWorks';
import FeaturesMatrix from './components/sections/FeaturesMatrix';
import DemoPreview from './components/sections/DemoPreview';
import ROIStats from './components/sections/ROIStats';
import GlobalNetwork from './components/sections/GlobalNetwork';
import FinalCTA from './components/sections/FinalCTA';

export default function App() {
  return (
    <ScrollGlobe>
      <Hero />
      <HowItWorks />
      <FeaturesMatrix />
      <DemoPreview />
      <ROIStats />
      <GlobalNetwork />
      <FinalCTA />
    </ScrollGlobe>
  );
}
