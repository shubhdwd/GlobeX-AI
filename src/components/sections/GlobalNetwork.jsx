import React from 'react';
import { motion } from 'framer-motion';

export default function GlobalNetwork() {
  return (
    <section className="min-h-screen w-full flex items-center justify-start px-8 md:px-24 pointer-events-none">
      <div className="w-full max-w-lg z-10 glass-panel p-10 rounded-3xl border border-slate-700/50 shadow-[0_0_40px_rgba(251,191,36,0.1)] pointer-events-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-white"
        >
          Connecting India to the World
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-300 leading-relaxed"
        >
          Watch your trade network expand globally. Our platform monitors live trade data, international demand, and emerging market trends, ensuring you are always one step ahead in the global supply chain.
        </motion.p>
      </div>
    </section>
  );
}
