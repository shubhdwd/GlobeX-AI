import React, { useState, useEffect } from 'react';
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
import ProfileSetup from './components/ProfileSetup';
import DashboardHeader from './components/DashboardHeader';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import AICopilotPage from './components/dashboard/AICopilotPage';
import GlobalExpansion from './components/dashboard/GlobalExpansion';
import MarketIntelligence from './components/dashboard/MarketIntelligence';
import BuyerDiscovery from './components/dashboard/BuyerDiscovery';
import TradeCompliance from './components/dashboard/TradeCompliance';
import DocumentsPage from './components/dashboard/DocumentsPage';
import AnalyticsDashboard from './components/dashboard/AnalyticsDashboard';
import SettingsPage from './components/dashboard/SettingsPage';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  
  const [currentPage, setCurrentPage] = useState('landing');
  const [authOpen, setAuthOpen] = useState(false);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // If authenticated, make sure they are on 'agents' or 'profile'
  // Actually, we'll just let the state manage it. The AuthModal onSuccess sets it.

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Conditionally render the correct header */}
      {currentPage === 'landing' ? (
        <Navbar 
          onOpenAuth={() => setAuthOpen(true)} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
      ) : (currentPage === 'profile' || currentPage === 'developer-mode') ? (
        <DashboardHeader onNavigate={setCurrentPage} />
      ) : null}
      
      {/* Main Content Area */}
      <div className="flex-1">
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
        ) : currentPage === 'profile' ? (
          <ProfileSetup onBack={() => setCurrentPage('dashboard')} />
        ) : currentPage === 'developer-mode' ? (
          <AiAgentsHub 
            onBackToLanding={() => setCurrentPage('dashboard')} 
            onNavigateToProfile={() => setCurrentPage('profile')}
          />
        ) : (
          <DashboardLayout 
            currentPage={currentPage} 
            onNavigate={setCurrentPage} 
            onLogout={() => { logout(); setCurrentPage('landing'); }}
          >
            {currentPage === 'dashboard' && <DashboardHome onNavigate={setCurrentPage} />}
            {currentPage === 'global-expansion' && <GlobalExpansion />}
            {currentPage === 'markets' && <MarketIntelligence />}
            {currentPage === 'buyers' && <BuyerDiscovery />}
            {currentPage === 'compliance' && <TradeCompliance />}
            {currentPage === 'documents' && <DocumentsPage />}
            {currentPage === 'analytics' && <AnalyticsDashboard />}
            {currentPage === 'copilot' && <AICopilotPage onNavigate={setCurrentPage} />}
            {currentPage === 'settings' && <SettingsPage />}
          </DashboardLayout>
        )}
      </div>
      
      {/* Footer is only shown on non-sidebar pages */}
      {(currentPage === 'landing' || currentPage === 'profile' || currentPage === 'developer-mode') && (
        <Footer onNavigate={setCurrentPage} />
      )}

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={() => { setAuthOpen(false); setCurrentPage('dashboard'); }}
      />
    </div>
  );
}
