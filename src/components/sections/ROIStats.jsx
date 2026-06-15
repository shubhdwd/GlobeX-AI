import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '3x', label: 'Average Growth in Export Volume' },
  { value: '45%', label: 'Reduction in Lead Acquisition Cost' },
  { value: '150+', label: 'Countries Analyzed Real-Time' }
];

export default function ROIStats() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 pointer-events-none">
      <div className="w-full max-w-5xl z-10 text-center pointer-events-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-white"
        >
          Transform Your Export Potential
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2 }}
              className="glass-panel p-10 rounded-3xl border border-slate-700/50 shadow-xl"
            >
              <div className="text-5xl md:text-6xl font-extrabold text-[#fbbf24] mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                {stat.value}
              </div>
              <div className="text-xl text-slate-300 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
