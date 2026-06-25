import React, { useState, useEffect } from 'react';
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
import AiAgentsHub from './components/AiAgentsHub';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import BuyerDiscovery from './components/dashboard/BuyerDiscovery';
import MarketIntelligence from './components/dashboard/MarketIntelligence';
import AICopilot from './components/dashboard/AICopilot';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [dashboardPage, setDashboardPage] = useState('dashboard');
  const [authOpen, setAuthOpen] = useState(false);
  
  // Simple auth state mock for hackathon
  const isAuthenticated = !!localStorage.getItem('token');

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, dashboardPage]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('landing');
    // Force a re-render by reloading or just state change (state change handles it since isAuthenticated checks token which is now gone, wait, isAuthenticated is derived from localStorage, so we need a state variable for it)
    window.location.reload();
  };

  if (isAuthenticated) {
    return (
      <DashboardLayout 
        currentPage={dashboardPage} 
        onNavigate={setDashboardPage}
        onLogout={handleLogout}
      >
        {dashboardPage === 'dashboard' && <DashboardHome />}
        {dashboardPage === 'buyers' && <BuyerDiscovery />}
        {dashboardPage === 'markets' && <MarketIntelligence />}
        {dashboardPage === 'copilot' && <AICopilot />}
      </DashboardLayout>
    );
  }

  return (
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
          <Testimonials />
          <Pricing onOpenAuth={() => setAuthOpen(true)} />
          <FAQ />
          <FinalCTA onOpenAuth={() => setAuthOpen(true)} />
        </>
      ) : (
        <AiAgentsHub onBackToLanding={() => setCurrentPage('landing')} />
      )}
      
      <Footer onNavigate={setCurrentPage} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

