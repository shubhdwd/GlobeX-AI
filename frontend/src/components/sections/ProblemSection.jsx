import React from 'react';
import { useFadeIn } from '../../lib/useFadeIn';
import { AlertTriangle, Clock, Search, DollarSign } from 'lucide-react';

const problems = [
  { icon: Search, text: 'Struggling to identify which countries have real demand for your products' },
  { icon: AlertTriangle, text: 'Relying on outdated trade directories and word-of-mouth referrals for buyer leads' },
  { icon: Clock, text: 'Spending weeks on market research that could be done in minutes with the right data' },
  { icon: DollarSign, text: 'Paying for multiple expensive data subscriptions without actionable insights' },
];

export default function ProblemSection() {
  const fade = useFadeIn();

  return (
    <section className="w-full bg-[#F5F7FA] py-14 md:py-16 border-b border-[#E5E7EB]">
      <div className="section-container" ref={fade.ref}>
        <div className={fade.className}>
          <div className="text-center mb-10">
            <span className="type-label text-[#EF4444] mb-2 block">The Challenge</span>
            <h2 className="type-h2 mb-3">Indian Exporters Face Critical Market Intelligence Gaps</h2>
            <p className="text-[14px] text-[#64748B] max-w-2xl mx-auto">
              Most exporters lack access to real-time trade data, verified buyer databases, and competitive intelligence — leading to missed opportunities and wasted resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {problems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded border border-[#E5E7EB]">
                <div className="w-8 h-8 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center shrink-0">
                  <item.icon size={14} className="text-[#EF4444]" />
                </div>
                <p className="text-[13px] text-[#334155] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
