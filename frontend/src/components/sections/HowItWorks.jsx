import React from 'react';
import { useFadeIn } from '../../lib/useFadeIn';
import { Search, BarChart3, ListChecks, FileOutput } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '1',
    title: 'Enter Your Product',
    desc: 'Provide your HS code, product name, or description. Our system recognizes thousands of product categories.',
  },
  {
    icon: BarChart3,
    number: '2',
    title: 'AI Analyzes Trade Data',
    desc: 'Our engine processes millions of customs records and demand signals to identify the most promising markets.',
  },
  {
    icon: ListChecks,
    number: '3',
    title: 'Review Opportunities',
    desc: 'Explore ranked country opportunities with import volumes, growth trends, and verified buyer leads.',
  },
  {
    icon: FileOutput,
    number: '4',
    title: 'Export & Outreach',
    desc: 'Download detailed reports, export buyer contact lists, and begin targeted outreach to importers.',
  },
];

export default function HowItWorks() {
  const fade = useFadeIn();

  return (
    <section id="how-it-works" className="w-full bg-white py-10 md:py-14 border-b border-[#E5E7EB]">
      <div className="section-container" ref={fade.ref}>
        <div className={fade.className}>
          {/* Section header */}
          <div className="mb-8 md:text-center">
            <span className="type-label text-[#2563EB] mb-2 block">How It Works</span>
            <h2 className="type-h2 mb-3">From Product to Actionable Intelligence in 4 Steps</h2>
          </div>

          {/* Mobile: vertical progression. Desktop: horizontal 4-col */}
          <div className="block md:hidden">
            {steps.map((step, idx) => (
              <div key={idx}>
                {/* Step row */}
                <div className="flex items-start gap-4 py-4">
                  {/* Left: number + connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-white text-[15px] font-bold">{step.number}</span>
                    </div>
                    {/* Vertical connector — not after last step */}
                    {idx < steps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[#E5E7EB] mt-2" style={{ minHeight: '32px' }} />
                    )}
                  </div>
                  {/* Right: text */}
                  <div className="pt-2 pb-4">
                    <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1.5">{step.title}</h3>
                    <p className="text-[13px] text-[#64748B] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: 4-column horizontal layout */}
          <div className="hidden md:grid grid-cols-4 gap-0">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center px-5 py-6">
                {/* Connector line between steps */}
                {idx < steps.length - 1 && (
                  <div
                    className="absolute top-[38px] h-px bg-[#E5E7EB]"
                    style={{ left: '50%', right: '-50%' }}
                  />
                )}
                <div className="relative z-10 w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-white text-sm font-bold">{step.number}</span>
                </div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1.5">{step.title}</h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed max-w-[190px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
