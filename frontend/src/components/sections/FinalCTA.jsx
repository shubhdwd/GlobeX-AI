import React from 'react';
import { motion } from 'framer-motion';

export default function FinalCTA({ onOpenAuth }) {
  return (
    <section id="contact" className="w-full py-32 px-6 flex items-center justify-center relative overflow-hidden bg-[#020617]/75 z-20">
      
      {/* Radial Glow Background */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[#00d4ff]/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-4xl z-10 text-center relative">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="type-h1 mb-6 text-white tracking-tight"
        >
          Ready to scale globally?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="type-sub text-slate-300 mb-10 max-w-2xl mx-auto"
        >
          Join hundreds of MSMEs and exporters using ExportPilot AI to dominate international markets. Start your 14-day free trial today.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            id="cta-free-trial-btn"
            onClick={onOpenAuth}
            className="btn-primary py-4 px-10 text-xl shadow-[0_0_25px_rgba(56,189,248,0.6)] w-full sm:w-auto"
          >
            Start Your Free Trial
          </button>
          <button className="btn-secondary py-4 px-10 text-xl w-full sm:w-auto">
            Book a Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}


