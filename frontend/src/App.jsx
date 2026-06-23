import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

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
import Dashboard from './pages/Dashboard';

/* ── Landing page wrapper ───────────────────────────────────────────────── */
function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

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
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </div>
  );
}

/* ── Route guard for /dashboard ─────────────────────────────────────────── */
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

/* ── App root ───────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
