import React from 'react';
import { motion } from 'framer-motion';

export default function DemoPreview() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-6xl z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="glass-panel rounded-3xl overflow-hidden border border-slate-700/50 shadow-[0_0_50px_rgba(56,189,248,0.15)]"
        >
          {/* Mock Browser Bar */}
          <div className="bg-slate-900/90 p-4 flex items-center gap-2 border-b border-slate-700/50">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-4 text-slate-400 text-sm font-mono flex-1 text-center opacity-70">app.exportpilot.ai/analyzer</div>
          </div>
          
          {/* Mock Dashboard Body */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-[#020617]/60 h-[600px] backdrop-blur-md">
            <div className="col-span-1 space-y-6">
              <div className="h-32 bg-slate-800/40 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#38bdf8]/10 to-transparent animate-shimmer" />
              </div>
              <div className="h-64 bg-slate-800/40 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/5 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="h-64 bg-slate-800/40 rounded-2xl relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#38bdf8]/10 to-transparent animate-shimmer" />
                 <p className="text-slate-500 font-medium">Market Demand Heatmap Rendering...</p>
              </div>
              <div className="h-48 bg-slate-800/40 rounded-2xl relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/10 to-transparent animate-shimmer" />
                 <p className="text-slate-500 font-medium">Competitor Analytics Loading...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
