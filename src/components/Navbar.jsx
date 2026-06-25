import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth, currentPage, onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'AI Agents', href: '#', action: () => onNavigate('agents'), type: 'action', isActive: currentPage === 'agents' },
    { name: 'Solutions', href: '#solutions', type: 'anchor', isActive: currentPage === 'landing' && window.location.hash === '#solutions' },
    { name: 'Features', href: '#features', type: 'anchor', isActive: currentPage === 'landing' && window.location.hash === '#features' },
    { name: 'How It Works', href: '#how-it-works', type: 'anchor', isActive: currentPage === 'landing' && window.location.hash === '#how-it-works' },
    { name: 'Pricing', href: '#pricing', type: 'anchor', isActive: currentPage === 'landing' && window.location.hash === '#pricing' },
  ];

  const handleLinkClick = (e, link) => {
    if (link.type === 'action') {
      e.preventDefault();
      link.action();
    } else if (currentPage !== 'landing') {
      // If we are not on landing page, redirect to landing first
      e.preventDefault();
      onNavigate('landing');
      // Delay slightly to let the page mount before scrolling
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top info bar */}
      <div className="hidden md:block w-full bg-[#0F172A] text-white text-xs py-1.5">
        <div className="section-container flex items-center justify-end gap-5">
          <a href="mailto:sales@globexai.com" className="flex items-center gap-1.5 text-[#CBD5E1] hover:text-white transition-colors">
            <Mail size={12} />
            sales@globexai.com
          </a>
          <a href="tel:+919876543210" className="flex items-center gap-1.5 text-[#CBD5E1] hover:text-white transition-colors">
            <Phone size={12} />
            +91 98765 43210
          </a>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`sticky top-0 w-full z-50 transition-shadow duration-200 bg-white border-b border-[#E5E7EB] ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="section-container flex items-center justify-between h-14">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}
            className="flex items-center gap-2"
          >
            <img src="/globex-logo.jpg" alt="GlobeX Logo" className="w-8 h-8 rounded-lg object-contain bg-white border border-[#E5E7EB]" />
            <span className="text-base font-bold text-[#0F172A] tracking-tight">GlobeX</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`text-[13px] font-medium transition-colors ${
                  link.isActive 
                    ? 'text-[#2563EB]' 
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(p => !p)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-[#F5F7FA] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[11px] font-bold">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-[12px] font-semibold text-[#0F172A] leading-none">{user.name || user.email}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      {user.role === 'SELLER' ? '📦 Seller' : '🛒 Buyer'}
                    </p>
                  </div>
                  <ChevronDown size={13} className={`text-[#94A3B8] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-50">
                    <div className="px-3 py-2 border-b border-[#F1F5F9]">
                      <p className="text-[11px] font-medium text-[#0F172A] truncate">{user.email}</p>
                      <p className="text-[10px] text-[#94A3B8]">{user.companyName || 'GlobeX User'}</p>
                    </div>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-[#EF4444] hover:bg-[#FFF1F2] transition-colors"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="text-[13px] font-medium text-[#334155] hover:text-[#0F172A] py-1.5 px-3 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="btn-primary text-[13px] py-2 px-4"
                >
                  Book a Free Demo
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-[#334155]" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-[#E5E7EB]">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('landing'); setMobileMenuOpen(false); }} className="flex items-center gap-2">
              <img src="/globex-logo.jpg" alt="GlobeX Logo" className="w-8 h-8 rounded-lg object-contain bg-white border border-[#E5E7EB]" />
              <span className="text-base font-bold text-[#0F172A]">GlobeX</span>
            </a>
            <button className="text-[#64748B] p-2" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col p-5 gap-0.5 flex-1">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link)}
                className={`text-[15px] font-medium py-3 border-b border-[#F1F5F9] ${
                  link.isActive ? 'text-[#2563EB]' : 'text-[#0F172A]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="p-5 flex flex-col gap-2.5 border-t border-[#E5E7EB]">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[13px] font-bold">
                    {(user.name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A]">{user.name || user.email}</p>
                    <p className="text-[11px] text-[#64748B]">{user.role === 'SELLER' ? '📦 Seller' : '🛒 Buyer'}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-[13px] font-medium text-[#EF4444] border border-[#FCA5A5] rounded-lg hover:bg-[#FFF1F2] transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }} className="btn-secondary w-full py-2.5 text-[13px]">Sign In</button>
                <button onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }} className="btn-primary w-full py-2.5 text-[13px]">Book a Free Demo</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
