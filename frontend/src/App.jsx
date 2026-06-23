import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import ScrollGlobe from './components/ScrollGlobe';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import TrustBar from './components/sections/TrustBar';
import AboutUs from './components/sections/AboutUs';
import FeaturesMatrix from './components/sections/FeaturesMatrix';
import HowItWorks from './components/sections/HowItWorks';
import ROIStats from './components/sections/ROIStats';
import FinalCTA from './components/sections/FinalCTA';
import Footer from './components/sections/Footer';
import FloatingActions from './components/FloatingActions';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';

/* ── Landing page wrapper ───────────────────────────────────────────────── */
function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="bg-[#020617] min-h-screen">
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <ScrollGlobe>
        <Hero onOpenAuth={() => setAuthOpen(true)} />
        <TrustBar />
        <AboutUs />
        <FeaturesMatrix />
        <HowItWorks />
        <ROIStats />
        <FinalCTA onOpenAuth={() => setAuthOpen(true)} />
        <Footer />
      </ScrollGlobe>
      <FloatingActions onOpenAuth={() => setAuthOpen(true)} />
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
