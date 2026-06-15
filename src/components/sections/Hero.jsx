import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function Hero() {
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
          className="max-w-xl mx-auto"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search with HSN Code (e.g. 100630)" 
              className="w-full bg-[#0f172a]/80 border border-slate-700 text-white rounded-full py-4 pl-12 pr-32 focus:outline-none focus:ring-2 focus:ring-[#38bdf8] transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#38bdf8] hover:bg-sky-400 text-slate-900 font-semibold py-2 px-6 rounded-full transition-all shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              Analyze
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
