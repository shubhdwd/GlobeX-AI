import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const solutions = ['Market Analysis', 'Lead Discovery', 'Competitor Intel', 'AI Trade Agents', 'Demand Forecasting'];
  const company = ['About Us', 'Pricing', 'Blog', 'Careers', 'Contact'];
  const legal = ['Privacy Policy', 'Terms of Service', 'Data Security', 'Refund Policy', 'FAQs'];

  return (
    <footer className="w-full bg-[#0F172A] border-t border-[#1E293B]">
      <div className="section-container py-10 md:py-12">

        {/* Mobile: Brand + contact on top full-width, then 2-col link grid */}
        {/* Desktop: 5-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('landing'); }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <img
                src="/globex-logo.jpg"
                alt="GlobeX Logo"
                className="w-7 h-7 rounded-lg object-contain bg-white border border-[#334155]"
                loading="lazy"
              />
              <span className="text-[16px] font-bold text-white">GlobeX</span>
            </a>
            <p className="text-[13px] text-[#94A3B8] leading-relaxed max-w-xs mb-5">
              Export market intelligence platform for Indian manufacturers, traders, and MSME exporters.
              Discover markets, find verified buyers, and grow your export revenue with data.
            </p>
            {/* Contact links — large tap targets */}
            <div className="flex flex-col gap-3">
              <a
                href="mailto:sales@globexai.com"
                className="flex items-center gap-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors"
                style={{ minHeight: '32px' }}
              >
                <Mail size={14} className="text-[#64748B] shrink-0" />
                sales@globexai.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 text-[13px] text-[#94A3B8] hover:text-white transition-colors"
                style={{ minHeight: '32px' }}
              >
                <Phone size={14} className="text-[#64748B] shrink-0" />
                +91 98765 43210
              </a>
              <p className="text-[12px] text-[#64748B]">123 Tech Park, Phase 1, Mumbai 400001</p>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider mb-4">Solutions</h4>
            <ul className="flex flex-col gap-2.5">
              {solutions.map(item => (
                <li key={item}>
                  <a
                    href={item === 'AI Trade Agents' ? '#' : '#solutions'}
                    onClick={(e) => {
                      if (item === 'AI Trade Agents' && onNavigate) {
                        e.preventDefault();
                        onNavigate('agents');
                      }
                    }}
                    className="text-[13px] text-[#94A3B8] hover:text-white transition-colors block py-0.5"
                    style={{ minHeight: '32px', lineHeight: '32px' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {company.map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13px] text-[#94A3B8] hover:text-white transition-colors block py-0.5"
                    style={{ minHeight: '32px', lineHeight: '32px' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5">
              {legal.map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-[13px] text-[#94A3B8] hover:text-white transition-colors block py-0.5"
                    style={{ minHeight: '32px', lineHeight: '32px' }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1E293B]">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-[#64748B]">© {new Date().getFullYear()} GlobeX. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Privacy</a>
            <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Terms</a>
            <a href="#" className="text-[12px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
