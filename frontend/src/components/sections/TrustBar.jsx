import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';

const stats = [
  { value: 203, suffix: '', label: 'Countries Analyzed' },
  { value: 10, suffix: 'M+', label: 'Trade Records' },
  { value: 500, suffix: '+', label: 'Indian Exporters' },
  { value: 99, suffix: '.9%', label: 'Uptime Reliability' }
];

export default function TrustBar() {
  return (
    <section id="trust" className="w-full bg-[#040d1a]/75 border-y border-[rgba(0,212,255,0.15)] py-10 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#00d4ff] tracking-tight">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </h3>
            <p className="type-label text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
