import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import TrustBar from './components/sections/TrustBar';
import ProblemSection from './components/sections/ProblemSection';
import Solutions from './components/sections/Solutions';
import FeaturesMatrix from './components/sections/FeaturesMatrix';
import HowItWorks from './components/sections/HowItWorks';
import DashboardPreview from './components/sections/DashboardPreview';
import Testimonials from './components/sections/Testimonials';
import Pricing from './components/sections/Pricing';
import FAQ from './components/sections/FAQ';
import FinalCTA from './components/sections/FinalCTA';
import Footer from './components/sections/Footer';
import AuthModal from './components/AuthModal';

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <Hero onOpenAuth={() => setAuthOpen(true)} />
      <TrustBar />
      <ProblemSection />
      <Solutions />
      <FeaturesMatrix />
      <HowItWorks />
      <DashboardPreview />
      <Testimonials />
      <Pricing onOpenAuth={() => setAuthOpen(true)} />
      <FAQ />
      <FinalCTA onOpenAuth={() => setAuthOpen(true)} />
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
