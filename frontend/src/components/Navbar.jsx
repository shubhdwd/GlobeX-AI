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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [profileOpen]);

  const navLinks = [
    { name: 'AI Agents', href: '#', action: () => onNavigate('dashboard'), type: 'action', isActive: currentPage === 'dashboard' },
    { name: 'Solutions', href: '#solutions', type: 'anchor', isActive: false },
    { name: 'Features', href: '#features', type: 'anchor', isActive: false },
    { name: 'How It Works', href: '#how-it-works', type: 'anchor', isActive: false },
    { name: 'Pricing', href: '#pricing', type: 'anchor', isActive: false },
  ];

  const handleLinkClick = (e, link) => {
    if (link.type === 'action') {
      e.preventDefault();
      link.action();
    } else if (currentPage !== 'landing') {
      e.preventDefault();
      onNavigate('landing');
      setTimeout(() => {
        const element = document.querySelector(link.href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top info bar — desktop only */}
      <div className="hidden md:block w-full bg-[#0F172A] text-white text-xs py-1.5">
        <div className="section-container flex items-center justify-end gap-6">
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

      {/* Main navbar — sticky on all viewports */}
      <nav className={`sticky top-0 w-full z-50 bg-white border-b border-[#E5E7EB] transition-shadow duration-200 ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="section-container flex items-center justify-between h-14">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('landing'); }}
            className="flex items-center gap-2 shrink-0"
            aria-label="GlobeX Home"
          >
            <img src="/globex-logo.jpg" alt="GlobeX Logo" className="w-8 h-8 rounded-lg object-contain bg-white border border-[#E5E7EB]" />
            <span className="text-[17px] font-bold text-[#0F172A] tracking-tight">GlobeX</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`text-[13px] font-medium transition-colors ${
                  link.isActive ? 'text-[#2563EB]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-primary text-[13px] py-2 px-4 !min-h-0 flex items-center gap-2"
                style={{ minHeight: '36px' }}
              >
                Go to Dashboard <ChevronDown size={13} className="-rotate-90" />
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="text-[13px] font-medium text-[#334155] hover:text-[#0F172A] py-2 px-3 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="btn-primary text-[13px] py-2 px-4 !min-h-0"
                  style={{ minHeight: '36px' }}
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile: right side — CTA + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {!isAuthenticated && (
              <button
                onClick={onOpenAuth}
                className="text-[13px] font-semibold text-white bg-[#2563EB] px-3 py-2 rounded-md leading-none"
                style={{ minHeight: '38px' }}
              >
                Get Started
              </button>
            )}
            {/* Hamburger — large tap target */}
            <button
              className="p-2.5 text-[#334155] hover:text-[#0F172A] rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — full screen overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          {/* Menu header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-[#E5E7EB]">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate('landing'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2"
            >
              <img src="/globex-logo.jpg" alt="GlobeX Logo" className="w-8 h-8 rounded-lg object-contain bg-white border border-[#E5E7EB]" />
              <span className="text-[17px] font-bold text-[#0F172A]">GlobeX</span>
            </a>
            <button
              className="p-2.5 text-[#64748B] hover:text-[#334155] rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav links — large touch targets */}
          <div className="flex flex-col px-4 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`flex items-center text-[16px] font-medium py-4 border-b border-[#F1F5F9] ${
                  link.isActive ? 'text-[#2563EB]' : 'text-[#0F172A]'
                }`}
                style={{ minHeight: '56px' }}
              >
                {link.name}
              </a>
            ))}

            {/* Contact info inside mobile menu */}
            <div className="mt-6 mb-2">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Contact Us</p>
              <a href="mailto:sales@globexai.com" className="flex items-center gap-2 text-[14px] text-[#64748B] py-2">
                <Mail size={15} className="text-[#2563EB]" /> sales@globexai.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-[14px] text-[#64748B] py-2">
                <Phone size={15} className="text-[#2563EB]" /> +91 98765 43210
              </a>
            </div>
          </div>

          {/* Mobile CTAs */}
          <div className="px-4 py-4 flex flex-col gap-3 border-t border-[#E5E7EB]">
            {isAuthenticated && user ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard'); }}
                className="btn-primary w-full text-[15px] flex items-center justify-center gap-2"
              >
                Go to Dashboard <ChevronDown size={15} className="-rotate-90" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="btn-secondary w-full text-[15px]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="btn-primary w-full text-[15px]"
                >
                  Start Free — 14 Days Trial
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
