import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ onOpenAuth }) {
  return (
    <section id="hero" className="min-h-screen w-full flex items-center pt-24 pb-12 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Column: Content */}
        <div className="flex flex-col items-start text-left">

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


        </div>

        {/* Right Column: Empty (Globe Background shows through) */}
        <div className="hidden lg:block h-[600px] w-full">
          {/* The Globe is fixed in the background, this empty div just ensures the grid layout gives it space */}
        </div>
      </div>
    </section>
  );
}

