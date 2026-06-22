import React from 'react';
import { Sparkles } from 'lucide-react';

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Inline SVG brand icons (Facebook, Instagram, Twitter removed from lucide-react)
const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-[#020617] pt-20 pb-10 px-6 md:px-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center">
              <Sparkles size={16} color="#020617" />
            </div>
            <span className="type-h4 text-white">GlobeX AI</span>
          </div>
          <p className="type-body text-slate-400">
            The world's premier export intelligence platform for Indian businesses. Expand your global footprint today.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#00d4ff] hover:text-slate-900 transition-colors">
              <TwitterIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#00d4ff] hover:text-slate-900 transition-colors">
              <LinkedinIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#00d4ff] hover:text-slate-900 transition-colors">
              <FacebookIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#00d4ff] hover:text-slate-900 transition-colors">
              <InstagramIcon size={18} />
            </a>
          </div>
        </div>

        {/* Product Column */}
        <div>
          <h4 className="type-strong text-white mb-6">Product</h4>
          <ul className="space-y-4">
            <li><a href="#" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">Features</a></li>
            <li><a href="#" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">Pricing</a></li>
            <li><a href="#" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">API Access</a></li>
            <li><a href="#" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">Case Studies</a></li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="type-strong text-white mb-6">Company</h4>
          <ul className="space-y-4">
            <li><a href="#" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">About Us</a></li>
            <li><a href="#" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">Blog</a></li>
            <li><a href="#" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">Careers</a></li>
            <li><a href="#" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">Press</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="type-strong text-white mb-6">Contact</h4>
          <ul className="space-y-4">
            <li><a href="mailto:sales@globexai.com" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">sales@globexai.com</a></li>
            <li><a href="tel:+919876543210" className="type-body text-slate-400 hover:text-[#00d4ff] transition-colors">+91 98765 43210</a></li>
            <li className="type-body text-slate-400">123 Tech Park, Phase 1<br/>Mumbai, India 400001</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="type-small text-slate-500">
          © {new Date().getFullYear()} GlobeX AI. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="type-small text-slate-500 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="type-small text-slate-500 hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
