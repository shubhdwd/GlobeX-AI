import React, { useState, useEffect } from 'react';
import { BarChart3, Menu, X, Phone, Mail } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

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
          <a href="#" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#2563EB] flex items-center justify-center">
              <BarChart3 size={15} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-[#0F172A] tracking-tight">GlobeX</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
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
            <a href="#" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#2563EB] flex items-center justify-center">
                <BarChart3 size={15} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-[#0F172A]">GlobeX</span>
            </a>
            <button className="text-[#64748B] p-2" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col p-5 gap-0.5 flex-1">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium text-[#0F172A] py-3 border-b border-[#F1F5F9]">
                {link.name}
              </a>
            ))}
          </div>
          <div className="p-5 flex flex-col gap-2.5 border-t border-[#E5E7EB]">
            <button onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }} className="btn-secondary w-full py-2.5 text-[13px]">Sign In</button>
            <button onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }} className="btn-primary w-full py-2.5 text-[13px]">Book a Free Demo</button>
          </div>
        </div>
      )}
    </>
  );
}
