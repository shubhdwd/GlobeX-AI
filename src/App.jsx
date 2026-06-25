import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import TrustBar from './components/sections/TrustBar';
import ProblemSection from './components/sections/ProblemSection';
import Solutions from './components/sections/Solutions';
import FeaturesMatrix from './components/sections/FeaturesMatrix';
import HowItWorks from './components/sections/HowItWorks';
import DashboardPreview from './components/sections/DashboardPreview';
import Pricing from './components/sections/Pricing';
import FAQ from './components/sections/FAQ';
import Footer from './components/sections/Footer';
import AuthModal from './components/AuthModal';
import AiAgentsHub from './components/AiAgentsHub';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [authOpen, setAuthOpen] = useState(false);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <AuthProvider>
    <div className="bg-white min-h-screen">
      <Navbar 
        onOpenAuth={() => setAuthOpen(true)} 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      {currentPage === 'landing' ? (
        <>
          <Hero onOpenAuth={() => setAuthOpen(true)} />
          <TrustBar />
          <ProblemSection />
          <Solutions />
          <FeaturesMatrix />
          <HowItWorks />
          <DashboardPreview />
          <Pricing onOpenAuth={() => setAuthOpen(true)} />
          <FAQ />
        </>
      ) : (
        <AiAgentsHub onBackToLanding={() => setCurrentPage('landing')} />
      )}
      
      <Footer onNavigate={setCurrentPage} />
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={() => { setAuthOpen(false); setCurrentPage('agents'); }}
      />
    </div>
    </AuthProvider>
  );
}

