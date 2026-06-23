import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';

const stats = [
  { value: 3, suffix: 'x', label: 'Average Growth in Export Volume' },
  { value: 45, suffix: '%', label: 'Reduction in Lead Acquisition Cost' },
  { value: 150, suffix: '+', label: 'Countries Analyzed Real-Time' }
];

export default function ROIStats() {
  return (
    <section id="roi" className="w-full py-20 px-6 md:px-12 bg-[#020617]/75 relative z-10 border-y border-[#fbbf24]/20">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="type-h2 mb-16 text-white"
        >
          Transform Your Export Potential
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#fbbf24]/20">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center pt-8 md:pt-0 first:pt-0"
            >
              <div className="text-5xl md:text-6xl font-extrabold text-[#fbbf24] mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="type-body text-slate-300 font-medium max-w-[200px]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

