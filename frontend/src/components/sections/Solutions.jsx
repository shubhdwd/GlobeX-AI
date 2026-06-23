import React from 'react';
import { useFadeIn } from '../../lib/useFadeIn';
import { TrendingUp, Users, BarChart3, ArrowRight } from 'lucide-react';

const solutions = [
  {
    icon: TrendingUp,
    title: 'Market Opportunity Analysis',
    description: 'Identify which countries have growing demand for your products using real customs data, import volumes, and growth trend analysis across 203 countries.',
  },
  {
    icon: Users,
    title: 'Verified Importer Discovery',
    description: 'Access databases of verified international buyers with trade histories, import volumes, product categories, and direct contact details.',
  },
  {
    icon: BarChart3,
    title: 'Competitor Export Intelligence',
    description: 'Track competitor shipment patterns, destination markets, and volumes. Benchmark your exports and identify strategic gaps in untapped markets.',
  },
];

export default function Solutions() {
  const fade = useFadeIn();

  return (
    <section id="solutions" className="w-full bg-white py-14 md:py-16 border-b border-[#E5E7EB]">
      <div className="section-container" ref={fade.ref}>
        <div className={fade.className}>
          <div className="text-center mb-10">
            <span className="type-label text-[#2563EB] mb-2 block">Our Solutions</span>
            <h2 className="type-h2 mb-3">GlobeX Solves These Problems With Data</h2>
            <p className="text-[14px] text-[#64748B] max-w-2xl mx-auto">
              Purpose-built trade intelligence tools for Indian exporters to find markets, discover buyers, and outperform competitors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {solutions.map((sol, idx) => (
              <div key={idx} className="p-5 bg-[#F5F7FA] rounded border border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center mb-4">
                  <sol.icon size={18} className="text-[#2563EB]" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#0F172A] mb-2">{sol.title}</h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed mb-4">{sol.description}</p>
                <a href="#features" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                  Learn more <ArrowRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
