import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ onOpenAuth }) {
  return (
    <section id="hero" className="min-h-screen w-full flex items-center pt-24 pb-12 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Column: Content */}
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 mb-6"
          >
            <span className="type-caption text-slate-300">🌐 AI-Powered Export Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="type-h1 mb-6 text-white"
          >
            Discover Global Buyers From <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">203 Countries</span> In A Single Platform
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="type-sub text-slate-300 mb-10 max-w-xl"
          >
            Experience freedom from multiple vendors and expensive subscriptions. Access comprehensive global trade data, uncover new markets, and automate your international outreach.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              id="hero-free-trial-btn"
              onClick={onOpenAuth}
              className="btn-primary w-full sm:w-auto py-3 px-8 text-lg"
            >
              Start Free Trial
            </button>
            <button className="btn-secondary w-full sm:w-auto py-3 px-8 text-lg">
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-8 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-700 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=1e293b`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <span className="type-strong text-white">Trusted by 500+</span>
              <span className="type-caption text-slate-400">Indian exporters</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Empty (Globe Background shows through) */}
        <div className="hidden lg:block h-[600px] w-full">
          {/* The Globe is fixed in the background, this empty div just ensures the grid layout gives it space */}
        </div>
      </div>
    </section>
  );
}

