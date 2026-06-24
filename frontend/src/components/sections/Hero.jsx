import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Globe from '../Globe';

export default function Hero({ onOpenAuth }) {
  const globeContainerRef = useRef(null);
  const [globeSize, setGlobeSize] = useState(460);

  useEffect(() => {
    const updateSize = () => {
      if (globeContainerRef.current) {
        const rect = globeContainerRef.current.getBoundingClientRect();
        setGlobeSize(Math.min(rect.width, rect.height, 480));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const checks = [
    'Trade data from 203 countries',
    '10M+ customs records analyzed',
    'Verified importer databases',
  ];

  return (
    <section id="hero" className="w-full bg-[#F5F7FA] border-b border-[#E5E7EB]">
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#EFF6FF] border border-[#DBEAFE] mb-5">
              <span className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-wider">Export Intelligence Platform</span>
            </div>

            <h1 className="type-h1 mb-4 leading-tight">
              Identify High-Potential Export Markets and Qualified Buyers in Minutes
            </h1>

            <p className="text-[15px] text-[#64748B] mb-6 leading-relaxed max-w-lg">
              GlobeX uses trade intelligence and AI-powered research to help Indian exporters discover profitable countries, evaluate demand, and find verified importers.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mb-6">
              <button
                id="hero-cta-btn"
                onClick={onOpenAuth}
                className="btn-primary py-2.5 px-5 text-[13px] flex items-center justify-center gap-2"
              >
                Start Market Analysis
                <ArrowRight size={14} />
              </button>
              <button className="btn-secondary py-2.5 px-5 text-[13px]">
                Book a Free Demo
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {checks.map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-[#64748B]">
                  <CheckCircle size={14} className="text-[#059669] shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Globe */}
          <div ref={globeContainerRef} className="hidden lg:flex items-center justify-center h-[440px] relative">
            <Globe width={globeSize} height={globeSize} />
          </div>
        </div>
      </div>
    </section>
  );
}
