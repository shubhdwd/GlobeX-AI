import React from 'react';
import { AnimatedCounter } from '../ui/AnimatedCounter';

const stats = [
  { value: 203, suffix: '', label: 'Countries Covered' },
  { value: 10, suffix: 'M+', label: 'Trade Records' },
  { value: 500, suffix: '+', label: 'Indian Exporters' },
  { value: 50, suffix: 'K+', label: 'Verified Importers' },
];

export default function TrustBar() {
  return (
    <section className="w-full bg-white border-b border-[#E5E7EB] py-6 md:py-8">
      <div className="section-container">
        {/* 2-col on mobile, 4-col on md+ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="text-[28px] md:text-[32px] font-bold text-[#0F172A] tracking-tight leading-none">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[12px] font-medium text-[#64748B] mt-1.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
