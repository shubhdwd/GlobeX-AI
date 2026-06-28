import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';
import Globe from '../Globe';

export default function Hero({ onOpenAuth }) {
  const globeContainerRef = useRef(null);
  const [globeSize, setGlobeSize] = useState(320);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (globeContainerRef.current) {
        const vw = window.innerWidth;
        if (mobile) {
          // On mobile: globe fills most of viewport width, capped at 360px
          setGlobeSize(Math.min(vw - 32, 360));
        } else {
          const rect = globeContainerRef.current.getBoundingClientRect();
          setGlobeSize(Math.min(rect.width, rect.height, 480));
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const stats = [
    { value: '203', label: 'Countries' },
    { value: '10M+', label: 'Trade Records' },
    { value: '50K+', label: 'Importers' },
  ];

  return (
    <section id="hero" className="w-full bg-[#F5F7FA] border-b border-[#E5E7EB]">
      <div className="section-container py-8 md:py-12 lg:py-16">

        {/* Mobile layout: single column, content then globe */}
        {/* Desktop layout: 2-column side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Content column */}
          <div className="flex flex-col">
            {/* Badge */}
            <div className="inline-flex items-center self-start gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
                Export Intelligence Platform
              </span>
            </div>

            {/* Headline — mobile-first size */}
            <h1 className="type-h1 mb-4 leading-tight">
              Find Your Next Export Market and Qualified Buyers — in Minutes
            </h1>

            {/* Description */}
            <p className="text-[15px] md:text-[16px] text-[#64748B] mb-6 leading-relaxed max-w-xl">
              GlobeX uses AI and real customs data to help Indian exporters discover
              profitable markets, evaluate demand, and connect with verified international importers.
            </p>

            {/* CTAs — Search driven onboarding */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const input = form.elements.namedItem('heroQuery');
                if (input && input.value.trim()) {
                  localStorage.setItem('pendingProductQuery', input.value.trim());
                  onOpenAuth();
                }
              }}
              className="flex flex-col sm:flex-row gap-3 mb-6 relative w-full max-w-lg"
            >
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  type="text"
                  name="heroQuery"
                  required
                  placeholder="What product do you want to export?"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#E2E8F0] rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all shadow-sm"
                />
              </div>
              <button
                id="hero-cta-btn"
                type="submit"
                className="btn-primary w-full sm:w-auto px-6 py-3.5 text-[15px] gap-2 rounded-xl whitespace-nowrap shadow-md hover:shadow-lg transition-all"
              >
                Analyze Market
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Trust strip — horizontal on mobile */}
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[18px] font-bold text-[#0F172A] leading-none">{s.value}</span>
                  <span className="text-[11px] text-[#64748B] mt-0.5">{s.label}</span>
                </div>
              ))}
              <div className="h-8 w-px bg-[#E5E7EB] hidden sm:block" />
              <div className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                <CheckCircle size={13} className="text-[#059669] shrink-0" />
                No credit card required
              </div>
            </div>
          </div>

          {/* Globe — shown on ALL screen sizes, sized responsively */}
          <div
            ref={globeContainerRef}
            className="flex items-center justify-center w-full"
            style={{
              height: isMobile ? `${globeSize}px` : '440px',
              minHeight: isMobile ? '280px' : '380px',
            }}
          >
            <Globe width={globeSize} height={isMobile ? globeSize : Math.min(globeSize, 460)} />
          </div>
        </div>

      </div>
    </section>
  );
}
