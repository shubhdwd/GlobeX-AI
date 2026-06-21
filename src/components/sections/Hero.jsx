import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ onOpenAuth }) {
  return (
    <section className="h-screen w-full flex items-center justify-center pt-20 px-4">
      <div className="max-w-4xl w-full text-center z-10 glass-panel p-8 md:p-12 rounded-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#38bdf8] to-white bg-clip-text text-transparent"
        >
          Making chance one container at a time
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto"
        >
          Discover buyers, analyze global demand, and automate your international outreach with the premier AI platform for Indian exporters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            id="hero-free-trial-btn"
            onClick={onOpenAuth}
            className="bg-[#38bdf8] hover:bg-sky-400 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-all shadow-[0_0_20px_rgba(56,189,248,0.5)]"
          >
            Start Your Free Trial
          </button>
          <button className="bg-transparent hover:bg-white/5 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all border border-slate-600">
            Watch Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}

