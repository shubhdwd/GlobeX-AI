import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA({ onOpenAuth }) {
  return (
    <section id="contact" className="w-full bg-[#0F172A] py-14 md:py-16">
      <div className="section-container text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
          Start Making Data-Driven Export Decisions
        </h2>
        <p className="text-[14px] text-[#94A3B8] mb-6 max-w-xl mx-auto">
          Join 500+ Indian exporters using GlobeX to identify markets, discover buyers, and grow international revenue. Start your 14-day free trial today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="cta-primary-btn"
            onClick={onOpenAuth}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold py-2.5 px-6 rounded flex items-center gap-2 transition-colors"
          >
            Start Market Analysis
            <ArrowRight size={14} />
          </button>
          <button className="bg-transparent text-white border border-[#334155] hover:border-[#64748B] text-[13px] font-semibold py-2.5 px-6 rounded transition-colors">
            Schedule a Demo
          </button>
        </div>
        <p className="text-[11px] text-[#64748B] mt-4">
          No credit card required · 14-day free trial · Cancel anytime
        </p>
      </div>
    </section>
  );
}
