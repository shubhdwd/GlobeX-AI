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
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  
  const [currentPage, setCurrentPage] = useState('landing');
  const [authOpen, setAuthOpen] = useState(false);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.2
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium text-[#0F172A]' }} />
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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="h-full"
          >
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
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Footer is only shown on non-sidebar pages */}
      {(currentPage === 'landing' || currentPage === 'profile' || currentPage === 'developer-mode') && (
        <Footer onNavigate={setCurrentPage} />
      )}

      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={() => { 
          setAuthOpen(false); 
          const pending = localStorage.getItem('pendingProductQuery');
          if (pending) {
            setCurrentPage('global-expansion');
          } else {
            setCurrentPage('dashboard'); 
          }
        }}
      />
    </div>
  );
}
