import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function Navbar({ onOpenAuth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'navbar py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer">
            <img src="/logo.png" alt="GlobeX AI" className="h-9 w-auto object-contain" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="type-label text-slate-300 hover:text-[#00d4ff] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onOpenAuth}
              className="bg-transparent hover:bg-white/5 text-white type-label py-2 px-5 rounded-full transition-all border border-slate-600"
            >
              Sign In
            </button>
            <button
              onClick={onOpenAuth}
              className="bg-[#00d4ff] hover:bg-sky-400 text-slate-900 type-label py-2 px-5 rounded-full transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)]"
            >
              Start Free Trial
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] bg-[#040d1a] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center">
                <img src="/logo.png" alt="GlobeX AI" className="h-9 w-auto object-contain" />
              </div>
              <button
                className="text-slate-300 hover:text-white bg-slate-800 p-2 rounded-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="type-h3 text-white border-b border-slate-800 pb-4"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="bg-transparent text-white type-label py-4 px-5 rounded-xl border border-slate-600 text-center w-full"
              >
                Sign In
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="bg-[#00d4ff] text-slate-900 type-label py-4 px-5 rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.4)] text-center w-full"
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
