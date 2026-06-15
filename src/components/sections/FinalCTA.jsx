import React from 'react';
import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 bg-[#020617]/80 backdrop-blur-sm z-20 relative">
      <div className="w-full max-w-4xl z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight"
        >
          Ready to scale globally?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto"
        >
          Join hundreds of MSMEs and exporters using ExportPilot AI to dominate international markets.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <button className="bg-[#38bdf8] hover:bg-sky-400 text-slate-900 font-bold py-4 px-10 rounded-full text-xl transition-all shadow-[0_0_25px_rgba(56,189,248,0.6)]">
            Start Your Free Trial
          </button>
          <button className="bg-transparent hover:bg-white/5 text-white font-semibold py-4 px-10 rounded-full text-xl transition-all border border-slate-600">
            Book a Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
