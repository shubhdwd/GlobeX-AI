import React from 'react';
import { useFadeIn } from '../../lib/useFadeIn';
import { AlertTriangle, Clock, Search, DollarSign } from 'lucide-react';

const problems = [
  {
    icon: Search,
    title: 'No Market Visibility',
    text: 'Struggling to identify which countries have real demand for your products',
  },
  {
    icon: AlertTriangle,
    title: 'Outdated Buyer Data',
    text: 'Relying on outdated trade directories and word-of-mouth referrals for buyer leads',
  },
  {
    icon: Clock,
    title: 'Weeks of Manual Research',
    text: 'Spending weeks on market research that could be done in minutes with the right data',
  },
  {
    icon: DollarSign,
    title: 'Expensive, Fragmented Tools',
    text: 'Paying for multiple expensive data subscriptions without actionable insights',
  },
];

export default function ProblemSection() {
  const fade = useFadeIn();

  return (
    <section className="w-full bg-[#F5F7FA] py-10 md:py-14 border-b border-[#E5E7EB]">
      <div className="section-container" ref={fade.ref}>
        <div className={fade.className}>
          {/* Section header */}
          <div className="mb-8 md:text-center">
            <span className="type-label text-[#EF4444] mb-2 block">The Challenge</span>
            <h2 className="type-h2 mb-3">
              Indian Exporters Face Critical Market Intelligence Gaps
            </h2>
            <p className="text-[14px] md:text-[15px] text-[#64748B] md:max-w-2xl md:mx-auto leading-relaxed">
              Most exporters lack access to real-time trade data, verified buyer databases,
              and competitive intelligence — leading to missed opportunities and wasted resources.
            </p>
          </div>

          {/* Problem cards — single column on mobile, 2-col on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl md:mx-auto">
            {problems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#E5E7EB]"
              >
                <div className="w-9 h-9 min-w-[36px] rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center">
                  <item.icon size={16} className="text-[#EF4444]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#0F172A] mb-0.5">{item.title}</p>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
